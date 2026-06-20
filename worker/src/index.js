const DEFAULT_API_PATH = "/api/generate-unit";
const MAX_PROMPT_CHARS = 1000;
const MAX_COMPONENTS = 6;
const DEFAULT_RATE_LIMIT_PER_HOUR = 30;
const DEFAULT_MODEL = "gemini-3.5-flash";

const ALLOWED_KINDS = [
  "protocol",
  "obligation",
  "evidence-ritual",
  "memory-system",
  "authority-rule",
  "refusal-custom",
  "source-interface",
  "institution",
  "custom",
];

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    components: {
      type: "array",
      minItems: 3,
      maxItems: MAX_COMPONENTS,
      items: { type: "string" },
    },
    tags: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: { type: "string" },
    },
  },
  required: ["title", "summary", "components", "tags"],
};

const SYSTEM_PROMPT = [
  "You generate compact citation protocols for a world-building lab.",
  "Treat citation as an alternate scholarly system, not ordinary citation formatting.",
  "Return exactly one compact JSON object matching this schema:",
  JSON.stringify(RESPONSE_SCHEMA),
  "The components array means protocol parts: rules, rituals, obligations, interfaces, memory systems, refusal customs, or consequences.",
  "Make the protocol concrete, reusable, and easy to combine with other protocols.",
  "Show how scholarship, evidence, memory, authority, or responsibility changes under this protocol.",
  "Avoid proper nouns from copyrighted fictional worlds.",
].join("\n");

const rateLimitBuckets = new Map();

export default {
  async fetch(request, env = {}, ctx = {}) {
    return handleRequest(request, env, ctx);
  },
};

export async function handleRequest(request, env = {}, ctx = {}) {
  const url = new URL(request.url);
  const corsHeaders = buildCorsHeaders(request, env);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    return jsonResponse(
      {
        ok: true,
        providers: {
          gemini: Boolean(env.GEMINI_API_KEY),
        },
      },
      { headers: corsHeaders },
    );
  }

  if (request.method !== "POST" || url.pathname !== DEFAULT_API_PATH) {
    return jsonResponse(
      { error: "not_found", message: "No route matches this request." },
      { status: 404, headers: corsHeaders },
    );
  }

  const authResult = verifyAccess(request, env);
  if (!authResult.ok) {
    return jsonResponse(authResult.body, {
      status: authResult.status,
      headers: corsHeaders,
    });
  }

  const rateLimitResult = checkRateLimit(request, env);
  if (!rateLimitResult.ok) {
    return jsonResponse(rateLimitResult.body, {
      status: 429,
      headers: {
        ...corsHeaders,
        "Retry-After": String(rateLimitResult.retryAfterSeconds),
      },
    });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      { error: "bad_json", message: "Request body must be valid JSON." },
      { status: 400, headers: corsHeaders },
    );
  }

  const validation = validatePayload(payload);
  if (!validation.ok) {
    return jsonResponse(validation.body, {
      status: 400,
      headers: corsHeaders,
    });
  }

  const startedAt = Date.now();
  const { kind, prompt, model } = validation.value;
  const provider = "gemini";

  try {
    const generated = await generateWithGemini({ kind, prompt, model, env });

    const body = normalizeCitationProtocol({
      unit: generated.unit,
      rawProvider: provider,
      model,
    });

    logRequest({ ok: true, kind, provider, model, startedAt, ctx });
    return jsonResponse(body, { headers: corsHeaders });
  } catch (error) {
    logRequest({ ok: false, kind, provider, model, startedAt, ctx, error });
    return jsonResponse(
      {
        error: "provider_error",
        message: readableProviderError(error),
        rawProvider: provider,
        model,
      },
      { status: error.status || 502, headers: corsHeaders },
    );
  }
}

export function validatePayload(payload) {
  const kind = normalizeKind(payload?.kind);
  const prompt = typeof payload?.prompt === "string" ? payload.prompt.trim() : "";
  const requestedModel =
    typeof payload?.model === "string" ? payload.model.trim() : "";
  const model = requestedModel || DEFAULT_MODEL;

  if (!kind || !ALLOWED_KINDS.includes(kind)) {
    return {
      ok: false,
      body: {
        error: "bad_kind",
        message: `Kind must be one of: ${ALLOWED_KINDS.join(", ")}.`,
      },
    };
  }

  if (!prompt) {
    return {
      ok: false,
      body: { error: "empty_prompt", message: "Prompt is required." },
    };
  }

  if (prompt.length > MAX_PROMPT_CHARS) {
    return {
      ok: false,
      body: {
        error: "prompt_too_long",
        message: `Prompt must be ${MAX_PROMPT_CHARS} characters or fewer.`,
      },
    };
  }

  if (model !== DEFAULT_MODEL) {
    return {
      ok: false,
      body: {
        error: "bad_model",
        message: `Model must be ${DEFAULT_MODEL}.`,
      },
    };
  }

  return { ok: true, value: { kind, prompt, model } };
}

async function generateWithGemini({ kind, prompt, model, env }) {
  if (!env.GEMINI_API_KEY) {
    throw providerError("Gemini is not configured on this API gateway.", 500);
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: buildUserPrompt(kind, prompt) }],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 700,
          responseMimeType: "application/json",
          responseJsonSchema: RESPONSE_SCHEMA,
        },
      }),
    },
  );

  const body = await readJsonResponse(response);
  if (!response.ok) {
    throw providerError(extractErrorMessage(body, "Gemini request failed."), response.status);
  }

  const text = body?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  return { unit: parseModelJson(text) };
}

function buildUserPrompt(kind, prompt) {
  return [
    `Citation protocol kind: ${kind}`,
    `World seed: ${prompt}`,
    "Generate one compact citation protocol that could combine with other scholarly-world primitives.",
  ].join("\n");
}

function normalizeCitationProtocol({ unit, rawProvider, model }) {
  const components = Array.isArray(unit.components)
    ? unit.components.slice(0, MAX_COMPONENTS).map(String).filter(Boolean)
    : [];
  const tags = Array.isArray(unit.tags)
    ? unit.tags.slice(0, 8).map((tag) => String(tag).toLowerCase()).filter(Boolean)
    : [];

  return {
    title: String(unit.title || "Untitled Unit").slice(0, 120),
    summary: String(unit.summary || "").slice(0, 1200),
    components,
    tags,
    rawProvider,
    model,
  };
}

function parseModelJson(text) {
  const trimmed = String(text || "").trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(withoutFence);
  } catch {
    const start = withoutFence.indexOf("{");
    const end = withoutFence.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(withoutFence.slice(start, end + 1));
    }
    throw providerError("The model did not return valid JSON.", 502);
  }
}

function verifyAccess(request, env) {
  if (!env.BLW_ACCESS_TOKEN) {
    return {
      ok: false,
      status: 500,
      body: {
        error: "gateway_not_configured",
        message: "BLW_ACCESS_TOKEN is not configured on this API gateway.",
      },
    };
  }

  const authHeader = request.headers.get("Authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const token = request.headers.get("x-blw-access-token") || bearer;

  if (token !== env.BLW_ACCESS_TOKEN) {
    return {
      ok: false,
      status: 401,
      body: { error: "unauthorized", message: "Access token is missing or invalid." },
    };
  }

  return { ok: true };
}

function checkRateLimit(request, env) {
  const limit = Number(env.RATE_LIMIT_PER_HOUR || DEFAULT_RATE_LIMIT_PER_HOUR);
  if (!Number.isFinite(limit) || limit <= 0) {
    return { ok: true };
  }

  const key =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("x-forwarded-for") ||
    "local";
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const current = rateLimitBuckets.get(key);

  if (!current || now - current.startedAt >= windowMs) {
    rateLimitBuckets.set(key, { startedAt: now, count: 1 });
    return { ok: true };
  }

  if (current.count >= limit) {
    const retryAfterSeconds = Math.ceil((windowMs - (now - current.startedAt)) / 1000);
    return {
      ok: false,
      retryAfterSeconds,
      body: {
        error: "rate_limited",
        message: "Hourly request limit reached for this gateway.",
      },
    };
  }

  current.count += 1;
  return { ok: true };
}

function buildCorsHeaders(request, env) {
  const allowedOrigins = String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = request.headers.get("Origin");
  const origin =
    requestOrigin && allowedOrigins.includes(requestOrigin)
      ? requestOrigin
      : allowedOrigins[0] || "*";

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,x-blw-access-token",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

async function readJsonResponse(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status: init.status || 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...(init.headers || {}),
    },
  });
}

function extractErrorMessage(body, fallback) {
  return body?.error?.message || body?.message || body?.raw || fallback;
}

function readableProviderError(error) {
  if (error?.message) {
    return error.message.slice(0, 400);
  }
  return "The provider request failed.";
}

function providerError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function normalizeKind(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function logRequest({ ok, kind, provider, model, startedAt, error }) {
  const durationMs = Date.now() - startedAt;
  const entry = {
    ok,
    kind,
    provider,
    model,
    durationMs,
    error: error ? readableProviderError(error) : undefined,
  };
  console.log(JSON.stringify(entry));
}
