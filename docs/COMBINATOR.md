# The Combinator

*A design for the next version of the Build Little Worlds machine.*

## The shift

The current site is a **generator**: you give it a seed, it returns one
citation protocol. Each protocol is a sealed object. Nothing happens
between protocols.

The Combinator makes protocols **reproduce**. You take two (or more)
protocols, push them into the same world, and the machine reports what
*breaks* — the contradictions — and what scholars *invent* to survive the
contradiction — the emergent customs. Those emergent customs are then
promotable into new, first-class protocols that can be collided again.

The result is not a document you read or a game you win. It is a **lineage
you cultivate**. Contradiction is the reproductive act. A world is the tree
of everything your collisions have bred.

This is the most generative version because the output is also input. The
corpus grows under its own rules, and — for a classroom — students can
*watch form generate thought*: change two footnote-rules, collide them, and
a new intellectual custom falls out that nobody designed on purpose.

## The core model

Three object types, one of which feeds back into the others.

### 1. Protocol (unchanged from today, plus an id)

```json
{
  "id": "p_8f3a",
  "title": "The Unpreserved Source Rule",
  "summary": "Every citation must name the part of the source it could not carry forward.",
  "components": ["loss clause", "witness mark", "repair interval"],
  "tags": ["protocol", "memory", "responsibility"],
  "lineage": []
}
```

`lineage` is empty for protocols generated from a raw seed. It is populated
when a protocol was *bred* from a collision (see below).

### 2. Collision (new)

The output of pushing 2+ protocols into one world. This is where
"conflicts and emergent customs" lives.

```json
{
  "id": "c_22d1",
  "parents": ["p_8f3a", "p_1b9c"],
  "world": "A short paragraph describing the shared world these protocols now co-govern.",
  "conflicts": [
    {
      "tension": "Naming what you failed to preserve requires speaking of the source; the silence rule forbids speaking of refused sources at all.",
      "stakes": "A scholar who cites a refused source cannot complete the loss clause without breaking the silence."
    }
  ],
  "emergent_customs": [
    {
      "name": "The Sealed Loss",
      "rule": "Scholars record what they failed to preserve in a sealed mark that names the omission without naming the source.",
      "born_from": "Both the loss clause AND the silence rule, reconciled.",
      "seed": "a scholarly world where omissions are recorded but their objects stay unnamed"
    }
  ],
  "dissent": "The strongest objection a scholar in this world would raise."
}
```

Two things make a Collision generative rather than decorative:

- **Every conflict is a real either/or**, not a vibe. It states the
  incompatibility *and* the concrete situation where a scholar is forced to
  choose.
- **Every emergent custom carries a `seed`** — a ready-made prompt string.
  That seed is the umbilical cord: one click turns the custom into a new
  Protocol via the *existing* `/api/generate-unit` endpoint.

### 3. Bred Protocol (a Protocol whose lineage is non-empty)

When a user promotes an emergent custom, the new protocol records where it
came from:

```json
{
  "id": "p_5e07",
  "title": "The Sealed Loss",
  "...": "...",
  "lineage": ["c_22d1"]
}
```

Now `p_5e07` can be collided with anything — including its own grandparents.
Inbreeding is allowed and often the most interesting; a world's deepest
contradictions surface when a custom is collided back against the protocol
that spawned the tension it was invented to resolve.

## Data flow

```
  seed ──► /api/generate-unit ──► Protocol ─┐
                                            │ (pick 2+)
                            ┌───────────────┘
                            ▼
              /api/combine-protocols ──► Collision
                            │
                            │ emergent_customs[].seed
                            ▼
                 /api/generate-unit ──► Bred Protocol ──► (collide again)
```

No new persistence layer is required for the prototype: the lineage tree
lives in browser memory (and optionally `localStorage`, mirroring how the
current app stashes the API URL and token). The Worker stays stateless.

## The collision endpoint

`POST /api/combine-protocols`

Reuses the existing gateway machinery wholesale: same access-token check,
same per-IP rate limit, same CORS allowlist, same Gemini structured-JSON
pattern. Only the schema and the system prompt change.

**Request**

```json
{
  "protocols": [
    { "title": "...", "summary": "...", "components": ["..."], "tags": ["..."] },
    { "title": "...", "summary": "...", "components": ["..."], "tags": ["..."] }
  ],
  "model": "gemini-3.5-flash"
}
```

Accepts 2–4 protocols. Only `title`/`summary`/`components` are sent to the
model; ids and lineage stay client-side.

**Response schema** (enforced via Gemini `responseJsonSchema`)

```
world             string
conflicts[]       { tension, stakes }          1–4 items
emergent_customs[]{ name, rule, born_from, seed } 1–4 items
dissent           string
```

**System prompt, in spirit**

> You are a comparative scholar of citation systems. Given two or more
> citation protocols, you do not merge them into something tidy. You hold
> them in the same world and report, with precision, where they cannot both
> be obeyed. For each genuine contradiction, describe the exact situation
> that forces a scholar to choose. Then invent the *customs scholars would
> actually develop* to live inside the contradiction — not fixes, but
> habits, workarounds, taboos, and rituals. Each custom must be a thing a
> real scholarly culture would do, specific enough to become its own
> protocol. End with the single strongest dissent.

The prompt's whole job is to forbid the model's default move — smoothing two
ideas into a bland synthesis — and force it toward friction and invention.

## UI flow (prototype)

1. **Bench.** Generated protocols appear as cards (reusing the result-card
   look). Each card has a checkbox.
2. **Collide.** Select 2–4, hit *Collide*. The world paragraph, the
   conflicts, the emergent customs, and the dissent render below.
3. **Breed.** Each emergent custom has a *Promote to protocol* button. It
   fires the existing generator with the custom's `seed`, and the new
   protocol drops onto the bench with a small lineage badge.
4. **Lineage.** A running list (later: a graph) shows which protocols were
   bred from which collisions. This is the "world" — not a single artifact
   but the accumulated tree.

The prototype keeps everything on one page and degrades gracefully: if the
gateway is unreachable it still demonstrates the flow with a built-in sample
collision so the interaction is legible without a token.

## Why "conflicts → customs → new protocols" is the right loop

A merged-offspring model (two protocols breed one tidy hybrid) converges:
each generation is smoother than the last, and the world flattens. The
conflict model **diverges**: every collision exposes a new fault line, every
custom invented to paper over it becomes a new surface for new collisions.
The system never settles. That open-endedness is the experiment — and it is
exactly the lesson a writing classroom wants, that a small change to the
rules of acknowledgement reorganizes what can be thought, argued, refused,
and inherited.

## Build notes / what ships in this prototype

- `worker/src/index.js`: add `combine` route, schema, prompt, validation,
  normalizer. Shares auth/rate-limit/CORS untouched.
- `worker/test/index.test.js`: validation + a mocked-Gemini collision test.
- `docs/combinator.html` + `docs/combinator.js` + shared `styles.css`
  (with a few appended combinator classes): the playable bench.
- No change to the live `index.html`; the combinator is a sibling page so
  the current site keeps working while this is evaluated.

## Future moves (not in this prototype)

- **Lineage graph** (nodes = protocols, edges = collisions) as a visible,
  rearrangeable map.
- **Playable dilemma** mode: turn a `conflict.stakes` into a scenario the
  user must adjudicate, and feed the ruling back as a new custom.
- **Saved worlds**: export a lineage tree as JSON; reload and keep breeding.
- **Recursion rule**: let the site's own protocols govern how protocols may
  cite each other, so the corpus becomes self-describing.
