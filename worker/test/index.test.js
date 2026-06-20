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
    kind: "Protocol",
    prompt: "a university where every citation names what it failed to preserve",
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.kind, "protocol");
  assert.equal(result.value.model, "gemini-3.5-flash");
});

test("validatePayload rejects old fantasy unit kinds", () => {
  const result = validatePayload({
    kind: "spell",
    prompt: "a lantern",
  });

  assert.equal(result.ok, false);
  assert.equal(result.body.error, "bad_kind");
});

test("validatePayload rejects unknown models", () => {
  const result = validatePayload({
    kind: "protocol",
    prompt: "a footnote that must be witnessed",
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
      kind: "protocol",
      prompt: "a footnote that must be witnessed",
    }),
  });

  const response = await handleRequest(request, env);
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.error, "unauthorized");
});

test("gateway calls Gemini and normalizes a citation protocol", async (t) => {
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
    assert.match(
      requestBody.systemInstruction.parts[0].text,
      /compact citation protocols/,
    );
    assert.match(
      requestBody.contents[0].parts[0].text,
      /Citation protocol kind: protocol/,
    );

    return new Response(
      JSON.stringify({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    title: "The Unpreserved Source Rule",
                    summary: "Every citation must name the part of the source that the scholar could not carry forward.",
                    components: ["loss clause", "witness mark", "repair interval"],
                    tags: ["protocol", "memory", "responsibility"],
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
      kind: "protocol",
      prompt: "a university where every citation names what it failed to preserve",
    }),
  });

  const response = await handleRequest(request, env);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://www.buildlittleworlds.com");
  assert.equal(body.title, "The Unpreserved Source Rule");
  assert.equal(body.rawProvider, "gemini");
  assert.equal(body.model, "gemini-3.5-flash");
  assert.deepEqual(body.tags, ["protocol", "memory", "responsibility"]);
});
