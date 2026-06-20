import test from "node:test";
import assert from "node:assert/strict";
import { handleRequest, validatePayload, validateCombinePayload } from "../src/index.js";

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

test("validateCombinePayload accepts two well-formed protocols", () => {
  const result = validateCombinePayload({
    protocols: [
      { title: "Unpreserved Source Rule", summary: "names what it failed to keep", components: ["loss clause"] },
      { title: "Law of Silent Sources", summary: "refused sources may not be named", components: ["naming taboo"] },
    ],
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.protocols.length, 2);
  assert.equal(result.value.model, "gemini-3.5-flash");
});

test("validateCombinePayload rejects fewer than two protocols", () => {
  const result = validateCombinePayload({
    protocols: [{ title: "Only One" }],
  });

  assert.equal(result.ok, false);
  assert.equal(result.body.error, "bad_protocols");
});

test("validateCombinePayload rejects protocols without titles", () => {
  const result = validateCombinePayload({
    protocols: [{ summary: "no title here" }, { summary: "also no title" }],
  });

  assert.equal(result.ok, false);
  assert.equal(result.body.error, "bad_protocols");
});

test("combine route calls Gemini and normalizes a collision", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async (url, init) => {
    assert.match(String(url), /generativelanguage\.googleapis\.com/);
    const requestBody = JSON.parse(init.body);
    assert.equal(requestBody.generationConfig.responseMimeType, "application/json");
    assert.deepEqual(
      requestBody.generationConfig.responseJsonSchema.required,
      ["world", "conflicts", "emergent_customs", "dissent"],
    );
    assert.match(requestBody.systemInstruction.parts[0].text, /comparative scholar of citation systems/);
    assert.match(requestBody.contents[0].parts[0].text, /Collide these citation protocols/);

    return new Response(
      JSON.stringify({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    world: "A faculty that must both name its losses and stay silent about refused sources.",
                    conflicts: [
                      {
                        tension: "The loss clause requires speaking of a source; the silence rule forbids naming refused sources.",
                        stakes: "A scholar citing a refused source cannot complete the loss clause without breaking silence.",
                      },
                    ],
                    emergent_customs: [
                      {
                        name: "The Sealed Loss",
                        rule: "Omissions are recorded in a sealed mark that names the loss but not the source.",
                        born_from: "loss clause + naming taboo",
                        seed: "a world where omissions are recorded but their objects stay unnamed",
                      },
                    ],
                    dissent: "A sealed loss that hides its object cannot be repaired by anyone but its author.",
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

  const request = new Request("https://api.example.com/api/combine-protocols", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-blw-access-token": env.BLW_ACCESS_TOKEN,
      Origin: "https://www.buildlittleworlds.com",
    },
    body: JSON.stringify({
      protocols: [
        { title: "Unpreserved Source Rule", summary: "names what it failed to keep", components: ["loss clause"] },
        { title: "Law of Silent Sources", summary: "refused sources may not be named", components: ["naming taboo"] },
      ],
    }),
  });

  const response = await handleRequest(request, env);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.rawProvider, "gemini");
  assert.equal(body.conflicts.length, 1);
  assert.equal(body.emergent_customs.length, 1);
  assert.equal(body.emergent_customs[0].name, "The Sealed Loss");
  assert.match(body.emergent_customs[0].seed, /omissions are recorded/);
  assert.ok(body.dissent.length > 0);
});

test("combine route rejects requests without the access token", async () => {
  const request = new Request("https://api.example.com/api/combine-protocols", {
    method: "POST",
    body: JSON.stringify({
      protocols: [{ title: "A" }, { title: "B" }],
    }),
  });

  const response = await handleRequest(request, env);
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.error, "unauthorized");
});
