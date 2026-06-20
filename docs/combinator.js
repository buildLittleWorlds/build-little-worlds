const MODEL = "gemini-3.5-flash";

const GENERATE_PATH = "/api/generate-unit";
const COMBINE_PATH = "/api/combine-protocols";
const EXPORT_VERSION = 1;

const ORIGIN_DEFAULT =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8787"
    : "https://build-little-worlds-api.profplate.workers.dev";

// The stored API URL points at the generate endpoint (compatible with the
// main site). We derive the combine URL from it so one field configures both.
const DEFAULT_API_URL = `${ORIGIN_DEFAULT}${GENERATE_PATH}`;

const els = {
  apiUrl: document.querySelector("#api-url"),
  token: document.querySelector("#access-token"),
  seedForm: document.querySelector("#seed-form"),
  status: document.querySelector("#lab-status"),
  benchGrid: document.querySelector("#bench-grid"),
  benchCount: document.querySelector("#bench-count"),
  collideBtn: document.querySelector("#collide-btn"),
  sampleBtn: document.querySelector("#sample-btn"),
  exportBtn: document.querySelector("#export-btn"),
  importBtn: document.querySelector("#import-btn"),
  importFile: document.querySelector("#import-file"),
  clearBtn: document.querySelector("#clear-btn"),
  collisionPanel: document.querySelector("#collision-panel"),
  collisionMeta: document.querySelector("#collision-meta"),
  collisionWorld: document.querySelector("#collision-world"),
  conflictsList: document.querySelector("#conflicts-list"),
  customsList: document.querySelector("#customs-list"),
  dissentText: document.querySelector("#dissent-text"),
  lineageList: document.querySelector("#lineage-list"),
};

// ---------- state ----------

const state = {
  protocols: [], // { id, title, summary, components, tags, lineage: [] }
  selected: new Set(),
  collisions: [],
  lineage: [], // { name, rule, collisionId, newProtocolId }
};

let idCounter = 0;
const nextId = (prefix) => `${prefix}_${(++idCounter).toString(36)}${Date.now().toString(36).slice(-3)}`;

// ---------- config persistence (mirrors the main site) ----------

els.apiUrl.value = localStorage.getItem("blw_api_url") || DEFAULT_API_URL;
els.token.value = sessionStorage.getItem("blw_access_token") || "";

els.apiUrl.addEventListener("change", () => {
  localStorage.setItem("blw_api_url", els.apiUrl.value.trim());
});
els.token.addEventListener("change", () => {
  sessionStorage.setItem("blw_access_token", els.token.value.trim());
});

function combineUrl() {
  const base = els.apiUrl.value.trim() || DEFAULT_API_URL;
  return base.replace(GENERATE_PATH, COMBINE_PATH);
}

function setStatus(message) {
  els.status.textContent = message;
}

function updateActionStates() {
  els.collideBtn.disabled = state.selected.size < 2;
  els.exportBtn.disabled = state.protocols.length === 0;
}

// ---------- generate a protocol ----------

els.seedForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(els.seedForm);
  const apiUrl = els.apiUrl.value.trim();
  const token = els.token.value.trim();

  localStorage.setItem("blw_api_url", apiUrl);
  sessionStorage.setItem("blw_access_token", token);

  setStatus("Generating...");
  els.seedForm.querySelector("button").disabled = true;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-blw-access-token": token },
      body: JSON.stringify({
        kind: data.get("kind"),
        prompt: data.get("prompt"),
        model: MODEL,
      }),
    });
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || "The gateway rejected this request.");
    }
    addProtocol(body);
    setStatus("Ready");
    els.seedForm.querySelector('textarea[name="prompt"]').value = "";
  } catch (error) {
    setStatus(error.message || "Request failed.");
  } finally {
    els.seedForm.querySelector("button").disabled = false;
  }
});

// Generate a protocol from a custom's seed, then tag its lineage.
async function breedFromCustom(custom, collisionId) {
  const apiUrl = els.apiUrl.value.trim();
  const token = els.token.value.trim();
  setStatus(`Breeding "${custom.name}"...`);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-blw-access-token": token },
      body: JSON.stringify({ kind: "custom", prompt: custom.seed, model: MODEL }),
    });
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || "The gateway rejected this request.");
    }
    const bred = addProtocol(body, [collisionId]);
    recordLineage(custom, collisionId, bred.id);
    setStatus("Ready");
  } catch (error) {
    setStatus(error.message || "Breeding failed.");
  }
}

// ---------- collide ----------

els.collideBtn.addEventListener("click", async () => {
  const chosen = state.protocols.filter((p) => state.selected.has(p.id));
  if (chosen.length < 2) return;

  setStatus("Colliding...");
  els.collideBtn.disabled = true;

  const payload = {
    protocols: chosen.map((p) => ({
      title: p.title,
      summary: p.summary,
      components: p.components,
    })),
    model: MODEL,
  };

  try {
    const response = await fetch(combineUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-blw-access-token": els.token.value.trim(),
      },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || "The gateway rejected this request.");
    }
    renderCollision(body, chosen);
    setStatus("Ready");
  } catch (error) {
    renderCollision(SAMPLE_COLLISION, chosen, { sample: true });
    setStatus(`${error.message || "Collision failed."} Showing a sample collision.`);
  } finally {
    updateActionStates();
  }
});

// ---------- bench rendering ----------

function addProtocol(raw, lineage = []) {
  const protocol = {
    id: typeof raw.id === "string" && raw.id ? raw.id : nextId("p"),
    title: raw.title || "Untitled Protocol",
    summary: raw.summary || "",
    components: Array.isArray(raw.components) ? raw.components : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    lineage,
  };
  state.protocols.push(protocol);
  renderBench();
  return protocol;
}

function toggleSelect(id) {
  if (state.selected.has(id)) {
    state.selected.delete(id);
  } else {
    state.selected.add(id);
  }
  renderBench();
}

function renderBench() {
  els.benchGrid.replaceChildren(
    ...state.protocols.map((protocol) => {
      const card = document.createElement("article");
      card.className = "bench-card" + (state.selected.has(protocol.id) ? " selected" : "");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-pressed", String(state.selected.has(protocol.id)));

      const check = document.createElement("span");
      check.className = "check";
      check.textContent = state.selected.has(protocol.id) ? "✓" : "";
      card.appendChild(check);

      if (protocol.lineage.length) {
        const badge = document.createElement("span");
        badge.className = "lineage-badge";
        badge.textContent = "bred";
        card.appendChild(badge);
      }

      const title = document.createElement("h4");
      title.textContent = protocol.title;
      card.appendChild(title);

      const summary = document.createElement("p");
      summary.textContent = protocol.summary;
      card.appendChild(summary);

      const select = () => toggleSelect(protocol.id);
      card.addEventListener("click", select);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select();
        }
      });
      return card;
    }),
  );

  const count = state.protocols.length;
  const sel = state.selected.size;
  els.benchCount.textContent = count
    ? `${count} protocol${count === 1 ? "" : "s"} on the bench · ${sel} selected`
    : "No protocols yet. Generate one above, or load the sample world.";
  els.collideBtn.disabled = sel < 2;
  updateActionStates();
}

// ---------- collision rendering ----------

function renderCollision(collision, parents, options = {}) {
  els.collisionMeta.textContent =
    `Collision of: ${parents.map((p) => p.title).join("  ×  ")}` +
    (collision.model ? `  ·  ${collision.rawProvider || "gemini"} / ${collision.model}` : "") +
    (options.sample ? "  ·  sample fallback" : "");
  els.collisionWorld.textContent = collision.world || "";

  const collisionId = typeof collision.id === "string" && collision.id ? collision.id : nextId("c");
  state.collisions.push({
    id: collisionId,
    parentIds: parents.map((p) => p.id),
    world: collision.world || "",
    conflicts: Array.isArray(collision.conflicts) ? collision.conflicts : [],
    emergent_customs: Array.isArray(collision.emergent_customs)
      ? collision.emergent_customs
      : [],
    dissent: collision.dissent || "",
    rawProvider: collision.rawProvider || (options.sample ? "sample" : "gemini"),
    model: collision.model || MODEL,
  });

  els.conflictsList.replaceChildren(
    ...(collision.conflicts || []).map((conflict) => {
      const wrap = document.createElement("div");
      wrap.className = "conflict-item";
      const tension = document.createElement("p");
      tension.className = "tension";
      tension.textContent = conflict.tension;
      const stakes = document.createElement("p");
      stakes.className = "stakes";
      stakes.textContent = conflict.stakes;
      wrap.append(tension, stakes);
      return wrap;
    }),
  );

  els.customsList.replaceChildren(
    ...(collision.emergent_customs || []).map((custom) => {
      const wrap = document.createElement("div");
      wrap.className = "custom-item";

      const name = document.createElement("h5");
      name.textContent = custom.name;

      const rule = document.createElement("p");
      rule.className = "rule";
      rule.textContent = custom.rule;

      const born = document.createElement("p");
      born.className = "born";
      born.textContent = custom.born_from ? `Born from: ${custom.born_from}` : "";

      const promote = document.createElement("button");
      promote.type = "button";
      promote.className = "promote";
      promote.textContent = "Promote to protocol →";
      promote.addEventListener("click", () => {
        promote.disabled = true;
        promote.textContent = "Bred ✓";
        breedFromCustom(custom, collisionId);
      });

      wrap.append(name, rule, born, promote);
      return wrap;
    }),
  );

  els.dissentText.textContent = collision.dissent || "";
  els.collisionPanel.hidden = false;
  els.collisionPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- lineage log ----------

function recordLineage(custom, collisionId, newProtocolId) {
  state.lineage.push({
    name: custom.name,
    rule: custom.rule || "",
    collisionId,
    newProtocolId,
  });
  renderLineage();
}

function renderLineage() {
  if (!state.lineage.length) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent =
      "Nothing has been bred yet. Collide protocols, then promote a custom into a new protocol to start a lineage.";
    els.lineageList.replaceChildren(empty);
    return;
  }

  const items = state.lineage.map((entry) => {
    const li = document.createElement("li");
    li.textContent = `"${entry.name}" was bred from a collision into a new collidable protocol.`;
    return li;
  });
  els.lineageList.replaceChildren(...items);
}

// ---------- toolbar ----------

els.clearBtn.addEventListener("click", () => {
  state.protocols = [];
  state.selected.clear();
  state.collisions = [];
  state.lineage = [];
  renderBench();
  els.collisionPanel.hidden = true;
  renderLineage();
  setStatus("Ready");
});

// A built-in sample so the interaction is legible without a token or network.
els.sampleBtn.addEventListener("click", () => {
  SAMPLE_PROTOCOLS.forEach((p) => addProtocol(p));
  setStatus("Sample world loaded — select two and collide.");
});

els.exportBtn.addEventListener("click", () => {
  const payload = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    protocols: state.protocols,
    collisions: state.collisions,
    lineage: state.lineage,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `build-little-worlds-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  setStatus("World exported.");
});

els.importBtn.addEventListener("click", () => {
  els.importFile.click();
});

els.importFile.addEventListener("change", async () => {
  const file = els.importFile.files?.[0];
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());
    importWorld(data);
    setStatus(`Imported "${file.name}".`);
  } catch (error) {
    setStatus(error.message || "Import failed.");
  } finally {
    els.importFile.value = "";
  }
});

function importWorld(data) {
  if (!data || typeof data !== "object" || !Array.isArray(data.protocols)) {
    throw new Error("Import file must contain a protocols array.");
  }

  const seen = new Set();
  const protocols = data.protocols.map((raw) => {
    const protocol = normalizeImportedProtocol(raw);
    while (seen.has(protocol.id)) {
      protocol.id = nextId("p");
    }
    seen.add(protocol.id);
    return protocol;
  });

  state.protocols = protocols;
  state.selected.clear();
  state.collisions = Array.isArray(data.collisions)
    ? data.collisions.map(normalizeImportedCollision)
    : [];
  state.lineage = Array.isArray(data.lineage)
    ? data.lineage.map(normalizeImportedLineage)
    : [];

  renderBench();
  renderLineage();
  els.collisionPanel.hidden = true;
}

function normalizeImportedProtocol(raw) {
  const id = typeof raw?.id === "string" && raw.id ? raw.id : nextId("p");
  return {
    id,
    title: String(raw?.title || "Untitled Protocol").slice(0, 160),
    summary: String(raw?.summary || "").slice(0, 1200),
    components: Array.isArray(raw?.components)
      ? raw.components.slice(0, 8).map(String).filter(Boolean)
      : [],
    tags: Array.isArray(raw?.tags)
      ? raw.tags.slice(0, 10).map(String).filter(Boolean)
      : [],
    lineage: Array.isArray(raw?.lineage) ? raw.lineage.map(String).filter(Boolean) : [],
  };
}

function normalizeImportedCollision(raw) {
  return {
    id: typeof raw?.id === "string" && raw.id ? raw.id : nextId("c"),
    parentIds: Array.isArray(raw?.parentIds) ? raw.parentIds.map(String) : [],
    world: String(raw?.world || "").slice(0, 1200),
    conflicts: Array.isArray(raw?.conflicts) ? raw.conflicts : [],
    emergent_customs: Array.isArray(raw?.emergent_customs)
      ? raw.emergent_customs
      : [],
    dissent: String(raw?.dissent || "").slice(0, 600),
    rawProvider: String(raw?.rawProvider || "imported").slice(0, 80),
    model: String(raw?.model || MODEL).slice(0, 80),
  };
}

function normalizeImportedLineage(raw) {
  return {
    name: String(raw?.name || "Untitled Custom").slice(0, 160),
    rule: String(raw?.rule || "").slice(0, 600),
    collisionId: String(raw?.collisionId || ""),
    newProtocolId: String(raw?.newProtocolId || ""),
  };
}

const SAMPLE_PROTOCOLS = [
  {
    title: "The Unpreserved Source Rule",
    summary:
      "Every citation must name the part of the source the scholar could not carry forward.",
    components: ["loss clause", "witness mark", "repair interval"],
    tags: ["protocol", "memory", "responsibility"],
  },
  {
    title: "The Law of Silent Sources",
    summary:
      "A source that has refused citation may never be named, quoted, or pointed to in any work.",
    components: ["refusal registry", "naming taboo", "silent footnote"],
    tags: ["refusal", "authority", "ethics"],
  },
  {
    title: "The Witness Ledger",
    summary:
      "No claim is citeable until a living witness stands and reaffirms it before the work is read.",
    components: ["standing oath", "reaffirmation quorum", "lapsed-claim decay"],
    tags: ["evidence", "authority", "memory"],
  },
];

const SAMPLE_COLLISION = {
  world:
    "A faculty tries to honor both loss and silence: every scholar must disclose what a source failed to carry forward, yet some sources have withdrawn the right to be named.",
  conflicts: [
    {
      tension:
        "The loss clause demands that a scholar name the source and the omission; the silence rule forbids naming a refused source at all.",
      stakes:
        "A dissertation that relies on a refused source cannot complete its loss clause without breaking the source's refusal.",
    },
    {
      tension:
        "The witness mark depends on another reader verifying the loss, while the naming taboo prevents the witness from knowing what they are verifying.",
      stakes:
        "A witness can either certify an omission blindly or demand the forbidden name and become complicit in the violation.",
    },
  ],
  emergent_customs: [
    {
      name: "The Sealed Loss",
      rule:
        "Scholars record that a loss exists inside a sealed mark, while a small office of confessors privately holds the unnamed source.",
      born_from: "loss clause + naming taboo",
      seed: "a world where omissions are recorded but their objects stay unnamed",
    },
    {
      name: "Blind Witnessing",
      rule:
        "Witnesses certify the shape and seriousness of an omission without being permitted to inspect the forbidden source itself.",
      born_from: "witness mark + refusal registry",
      seed: "a scholarly culture where witnesses verify omissions without seeing their sources",
    },
  ],
  dissent:
    "A sealed loss that hides its object cannot be repaired by anyone outside the confessors, so the repair interval becomes a ceremony around a locked door.",
  rawProvider: "sample",
  model: MODEL,
};

renderBench();
renderLineage();
