const DOCS = {
  module: {
    title: "Building Little Worlds",
    eyebrow: "Core module",
    file: "MODULE.md",
    summary: "The main course text: citation as primitive, constraint, contradiction, assignments, glossary, and agent brief.",
  },
  combinator: {
    title: "The Combinator",
    eyebrow: "Design note",
    file: "COMBINATOR.md",
    summary: "How protocols collide, breed emergent customs, and become lineage instead of one-off generated objects.",
  },
  bestiary: {
    title: "A Bestiary of Worlds",
    eyebrow: "Worked examples",
    file: "BESTIARY.md",
    summary: "Seven cultivated citation-worlds with stacks, collisions, emergent customs, sample texts, and dissent.",
  },
};

const cardGrid = document.querySelector("#reading-card-grid");
const body = document.querySelector("#reading-body");
const toc = document.querySelector("#reading-toc");

const params = new URLSearchParams(window.location.search);
const initialDoc = DOCS[params.get("doc")] ? params.get("doc") : "module";

renderCards(initialDoc);
loadDoc(initialDoc);

function renderCards(activeKey) {
  cardGrid.replaceChildren(
    ...Object.entries(DOCS).map(([key, doc]) => {
      const link = document.createElement("a");
      link.className = `reading-card${key === activeKey ? " active" : ""}`;
      link.href = `readings.html?doc=${key}`;
      link.dataset.doc = key;
      link.innerHTML = `
        <span>${doc.eyebrow}</span>
        <strong>${doc.title}</strong>
        <small>${doc.summary}</small>
      `;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.history.pushState({}, "", link.href);
        renderCards(key);
        loadDoc(key);
      });
      return link;
    }),
  );
}

window.addEventListener("popstate", () => {
  const key = DOCS[new URLSearchParams(window.location.search).get("doc")]
    ? new URLSearchParams(window.location.search).get("doc")
    : "module";
  renderCards(key);
  loadDoc(key);
});

async function loadDoc(key) {
  const doc = DOCS[key];
  body.innerHTML = `<p>Loading ${escapeHtml(doc.title)}...</p>`;
  toc.replaceChildren();

  try {
    const response = await fetch(doc.file, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load ${doc.file}.`);
    }
    const markdown = await response.text();
    const rendered = renderMarkdown(markdown);
    body.innerHTML = rendered.html;
    renderToc(rendered.headings);
    document.title = `${doc.title} | Build Little Worlds`;
  } catch (error) {
    body.innerHTML = `
      <h1>${escapeHtml(doc.title)}</h1>
      <p>${escapeHtml(error.message || "This reading could not be loaded.")}</p>
      <p><a href="${doc.file}">Open the source Markdown</a></p>
    `;
  }
}

function renderToc(headings) {
  const items = headings
    .filter((heading) => heading.level <= 3)
    .slice(0, 80)
    .map((heading) => {
      const item = document.createElement("li");
      item.className = `toc-level-${heading.level}`;
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.text;
      item.appendChild(link);
      return item;
    });

  if (!items.length) {
    const item = document.createElement("li");
    item.className = "empty";
    item.textContent = "No headings found.";
    toc.replaceChildren(item);
    return;
  }

  toc.replaceChildren(...items);
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  const headings = [];
  let paragraph = [];
  let list = null;
  let currentListItem = null;
  let quote = [];
  let code = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(" ").trim())}</p>`);
    paragraph = [];
  };

  const flushQuote = () => {
    if (!quote.length) return;
    html.push(`<blockquote><p>${renderInline(quote.join(" ").trim())}</p></blockquote>`);
    quote = [];
  };

  const flushList = () => {
    if (!list) return;
    if (currentListItem) {
      list.items.push(currentListItem.join(" ").trim());
      currentListItem = null;
    }
    const tag = list.type === "ol" ? "ol" : "ul";
    const items = list.items.map((item) => `<li>${renderInline(item)}</li>`).join("");
    html.push(`<${tag}>${items}</${tag}>`);
    list = null;
  };

  const flushAll = () => {
    flushParagraph();
    flushQuote();
    flushList();
  };

  for (const line of lines) {
    if (code) {
      if (/^```/.test(line)) {
        html.push(`<pre><code>${escapeHtml(code.lines.join("\n"))}</code></pre>`);
        code = null;
      } else {
        code.lines.push(line);
      }
      continue;
    }

    const fence = line.match(/^```/);
    if (fence) {
      flushAll();
      code = { lines: [] };
      continue;
    }

    if (!line.trim()) {
      flushAll();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      const text = stripMarkdown(heading[2].trim());
      const id = uniqueSlug(text, headings);
      headings.push({ level, text, id });
      html.push(`<h${level} id="${id}">${renderInline(heading[2].trim())}</h${level}>`);
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushAll();
      html.push("<hr>");
      continue;
    }

    const quoteLine = line.match(/^>\s?(.*)$/);
    if (quoteLine) {
      flushParagraph();
      flushList();
      quote.push(quoteLine[1]);
      continue;
    }

    const listLine = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
    if (listLine) {
      flushParagraph();
      flushQuote();
      const type = /\d+\./.test(listLine[2]) ? "ol" : "ul";
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      if (currentListItem) {
        list.items.push(currentListItem.join(" ").trim());
      }
      currentListItem = [listLine[3]];
      continue;
    }

    if (list && /^\s{2,}\S/.test(line)) {
      currentListItem.push(line.trim());
      continue;
    }

    flushQuote();
    flushList();
    paragraph.push(line.trim());
  }

  flushAll();
  if (code) {
    html.push(`<pre><code>${escapeHtml(code.lines.join("\n"))}</code></pre>`);
  }

  return { html: html.join("\n"), headings };
}

function renderInline(value) {
  let html = escapeHtml(value);

  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
    const href = normalizeHref(url);
    return `<a href="${href}">${text}</a>`;
  });

  return html;
}

function normalizeHref(url) {
  const trimmed = String(url || "").trim();
  if (trimmed === "MODULE.md") return "readings.html?doc=module";
  if (trimmed === "COMBINATOR.md") return "readings.html?doc=combinator";
  if (trimmed === "BESTIARY.md") return "readings.html?doc=bestiary";
  return escapeHtml(trimmed);
}

function stripMarkdown(value) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function uniqueSlug(text, headings) {
  const base =
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "section";
  const existing = new Set(headings.map((heading) => heading.id));
  let id = base;
  let index = 2;
  while (existing.has(id)) {
    id = `${base}-${index}`;
    index += 1;
  }
  return id;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
