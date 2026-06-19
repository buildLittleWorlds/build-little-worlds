import test from "node:test";
import assert from "node:assert/strict";
import { handleRequest, validatePayload } from "../src/index.js";

const env = {
  BLW_ACCESS_TOKEN: "local-test-token",
  GEMINI_API_KEY: "gemini-test-key",
  ALLOWED_ORIGINS: "https://www.buildlittleworlds.com,http://localhost:8000",
  RATE_LIMIT_PER_HOUR: "100",
};

test("validatePayload applies defaults and allowlists", () => {
  const result = validatePayload({
    kind: "Spell",
    prompt: "a lantern that remembers roads",
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.kind, "spell");
  assert.equal(result.value.model, "gemini-3.5-flash");
});

test("validatePayload rejects unknown models", () => {
  const result = validatePayload({
    kind: "spell",
    prompt: "a lantern",
    provider: "gemini",
    model: "not-real",
  });

  assert.equal(result.ok, false);
  assert.equal(result.body.error, "bad_model");
});

test("gateway rejects requests without the private access token", async () => {
  const request = new Request("https://api.example.com/api/generate-unit", {
    method: "POST",
    body: JSON.stringify({
      kind: "spell",
      prompt: "a lantern",
    }),
  });

  const response = await handleRequest(request, env);
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.error, "unauthorized");
});

test("gateway calls Gemini and normalizes a world unit", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /generativelanguage\.googleapis\.com/);
    assert.equal(init.headers["x-goog-api-key"], env.GEMINI_API_KEY);
    const requestBody = JSON.parse(init.body);
    assert.equal(requestBody.generationConfig.responseMimeType, "application/json");
    assert.deepEqual(
      requestBody.generationConfig.responseJsonSchema.required,
      ["title", "summary", "components", "tags"],
    );

    return new Response(
      JSON.stringify({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    title: "Roadmemory Lantern",
                    summary: "A brass lantern that glows brighter on paths its bearer has taken before.",
                    components: ["warm brass cage", "map-smoke wick", "remembered crossroads"],
                    tags: ["spell", "travel", "memory"],
                  }),
                },
              ],
            },
          },
        ],
      }),
      { status: 200 },
    );
  };

  const request = new Request("https://api.example.com/api/generate-unit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-blw-access-token": env.BLW_ACCESS_TOKEN,
      Origin: "https://www.buildlittleworlds.com",
    },
    body: JSON.stringify({
      kind: "spell",
      prompt: "a lantern that remembers roads",
    }),
  });

  const response = await handleRequest(request, env);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://www.buildlittleworlds.com");
  assert.equal(body.title, "Roadmemory Lantern");
  assert.equal(body.rawProvider, "gemini");
  assert.equal(body.model, "gemini-3.5-flash");
  assert.deepEqual(body.tags, ["spell", "travel", "memory"]);
});
