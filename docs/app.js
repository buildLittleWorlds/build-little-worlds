const MANIFEST_URL = "posts.json";
const SITE_TITLE = "Therapeutic Reading Notes";
const MAX_HOME_POSTS = 10;

const postList = document.querySelector("#post-list");
const postBody = document.querySelector("#post-body");

if (postList) {
  renderIndex();
}

if (postBody) {
  renderPost();
}

async function renderIndex() {
  try {
    const posts = await loadPosts();
    postList.replaceChildren(...posts.slice(0, MAX_HOME_POSTS).map(renderPostCard));
  } catch (error) {
    postList.innerHTML = `<p class="notice">${escapeHtml(error.message || "Posts could not be loaded.")}</p>`;
  }
}

async function renderPost() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug") || "";

  try {
    const posts = await loadPosts();
    const post = posts.find((item) => item.slug === slug);

    if (!post) {
      renderMissingPost(posts);
      return;
    }

    const response = await fetch(post.file, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load ${post.file}.`);
    }

    const markdown = await response.text();
    const rendered = renderMarkdown(markdown);
    document.title = `${post.title} | ${SITE_TITLE}`;
    postBody.innerHTML = `
      <header class="post-header">
        <h1>${escapeHtml(post.title)}</h1>
        <p class="post-meta">${formatDate(post.date)}</p>
        <p class="post-description">${escapeHtml(post.description)}</p>
      </header>
      <div class="markdown-body">${rendered}</div>
    `;
  } catch (error) {
    postBody.innerHTML = `
      <p class="notice">${escapeHtml(error.message || "This post could not be loaded.")}</p>
      <p><a href="index.html">Return to all posts</a></p>
    `;
  }
}

async function loadPosts() {
  const response = await fetch(MANIFEST_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("The post manifest could not be loaded.");
  }

  const posts = await response.json();
  if (!Array.isArray(posts)) {
    throw new Error("The post manifest is not an array.");
  }

  return posts.slice().sort((a, b) => {
    const dateCompare = String(b.date || "").localeCompare(String(a.date || ""));
    return dateCompare || Number(b.order || 0) - Number(a.order || 0);
  });
}

function renderPostCard(post) {
  const article = document.createElement("article");
  article.className = "post-card";

  const title = document.createElement("h3");
  const link = document.createElement("a");
  link.href = `post.html?slug=${encodeURIComponent(post.slug)}`;
  link.textContent = post.title || "Untitled";
  title.appendChild(link);

  const description = document.createElement("p");
  description.textContent = post.description || "";

  const meta = document.createElement("p");
  meta.className = "post-meta";
  meta.textContent = formatDate(post.date);

  article.append(title, description, meta);
  return article;
}

function renderMissingPost(posts) {
  document.title = `Post Not Found | ${SITE_TITLE}`;
  const links = posts
    .map((post) => `<li><a href="post.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></li>`)
    .join("");

  postBody.innerHTML = `
    <header class="post-header">
      <h1>Post not found</h1>
      <p class="post-description">The requested slug does not match a published post in the local manifest.</p>
    </header>
    <div class="markdown-body">
      <p>Choose one of the current posts instead:</p>
      <ul>${links}</ul>
    </div>
  `;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let list = null;
  let quote = [];
  let code = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(" ").trim())}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    const tag = list.type === "ol" ? "ol" : "ul";
    const items = list.items.map((item) => `<li>${renderInline(item)}</li>`).join("");
    html.push(`<${tag}>${items}</${tag}>`);
    list = null;
  };

  const flushQuote = () => {
    if (!quote.length) return;
    html.push(`<blockquote><p>${renderInline(quote.join(" ").trim())}</p></blockquote>`);
    quote = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
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

    if (/^```/.test(line)) {
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
      html.push(`<h${level}>${renderInline(heading[2].trim())}</h${level}>`);
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
      list.items.push(listLine[3]);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushAll();

  if (code) {
    html.push(`<pre><code>${escapeHtml(code.lines.join("\n"))}</code></pre>`);
  }

  return html.join("\n");
}

function renderInline(value) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function formatDate(value) {
  if (!value) return "Undated";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
