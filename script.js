// FindMyAI — static directory. All data is loaded from tools.json.
const categoryNames = ["All", "Writing", "Image", "Video", "Coding", "Research", "Audio", "Design", "Productivity", "Marketing"];
const categoryEmoji = {Writing:"✍️",Image:"🎨",Video:"🎬",Coding:"💻",Research:"🔎",Audio:"🎧",Design:"🪄",Productivity:"⚡",Marketing:"📣"};
let allTools = [];
let selectedCategory = "All";
let selectedPricing = "All";
let featuredOnly = false;

const $ = (selector) => document.querySelector(selector);
const toolsGrid = $("#toolsGrid");

function initials(name) {
  return name.split(/[\s-]+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}

async function loadTools() {
  try {
    const response = await fetch("tools.json");
    if (!response.ok) throw new Error("Could not load tools.json");
    allTools = await response.json();
    renderCategories();
    renderTools();
  } catch (error) {
    toolsGrid.innerHTML = `<div class="empty-state"><h3>Could not load the tools list</h3><p>Make sure index.html and tools.json are in the same folder. If your browser blocks local JSON access, use the included Python preview command in README.</p></div>`;
    $("#resultCount").textContent = "0 tools";
    console.error(error);
  }
}

function renderCategories() {
  const list = $("#categoryList");
  list.innerHTML = categoryNames.map(category => {
    const count = category === "All" ? allTools.length : allTools.filter(tool => tool.category === category).length;
    const label = category === "All" ? "✦ All tools" : `${categoryEmoji[category] || "✦"} ${category}`;
    return `<button class="category-btn ${selectedCategory === category ? "active" : ""}" data-category="${category}"><span>${label}</span><span class="category-count">${count}</span></button>`;
  }).join("");
  list.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    renderCategories();
    renderTools();
  }));
}

function getFilteredTools() {
  const query = $("#searchInput").value.trim().toLowerCase();
  return allTools.filter(tool => {
    const searchable = [tool.name, tool.description, tool.category, tool.bestFor, ...(tool.tags || [])].join(" ").toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    const matchesPricing = selectedPricing === "All" || tool.pricing === selectedPricing;
    const matchesFeatured = !featuredOnly || tool.featured === true;
    return matchesQuery && matchesCategory && matchesPricing && matchesFeatured;
  }).sort((a,b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name));
}

function renderTools() {
  const filtered = getFilteredTools();
  $("#resultCount").textContent = `${filtered.length} ${filtered.length === 1 ? "tool" : "tools"}`;
  $("#emptyState").hidden = filtered.length !== 0;
  toolsGrid.innerHTML = filtered.map(tool => `
    <article class="tool-card">
      <div class="card-top">
        <div class="avatar ${tool.category.toLowerCase()}">${initials(tool.name)}</div>
        <span class="pricing-pill">${tool.pricing}</span>
      </div>
      <div class="card-title"><h3>${escapeHTML(tool.name)}</h3>${tool.featured ? '<span class="featured-label">★ Featured</span>' : ""}</div>
      <p class="description">${escapeHTML(tool.description)}</p>
      <div class="meta"><span>${categoryEmoji[tool.category] || "✦"} ${escapeHTML(tool.category)}</span><span>${escapeHTML(tool.bestFor || "")}</span></div>
      <div class="card-actions">
        <button class="details-btn" data-id="${escapeHTML(tool.id)}">View details</button>
        <a class="visit-btn" href="${safeURL(tool.url)}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${escapeHTML(tool.name)}">↗</a>
      </div>
    </article>`).join("");
  toolsGrid.querySelectorAll(".details-btn").forEach(button => {
    button.addEventListener("click", () => openDetails(button.dataset.id));
  });
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

function safeURL(value = "") {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? escapeHTML(url.href) : "#";
  } catch { return "#"; }
}

function openDetails(id) {
  const tool = allTools.find(item => item.id === id);
  if (!tool) return;
  $("#dialogAvatar").textContent = initials(tool.name);
  $("#dialogCategory").textContent = `${categoryEmoji[tool.category] || "✦"} ${tool.category} · ${tool.pricing}`;
  $("#dialogName").textContent = tool.name;
  $("#dialogDescription").textContent = tool.description;
  $("#dialogBestFor").textContent = tool.bestFor || "General use";
  $("#dialogTags").innerHTML = (tool.tags || []).map(tag => `<span>#${escapeHTML(tag)}</span>`).join("");
  $("#dialogVisit").href = safeURL(tool.url);
  $("#toolDialog").showModal();
}

$("#searchInput").addEventListener("input", renderTools);
$("#searchForm").addEventListener("submit", event => {
  event.preventDefault();
  renderTools();
  $("#explore").scrollIntoView({behavior:"smooth"});
});
document.querySelectorAll(".popular button").forEach(button => button.addEventListener("click", () => {
  $("#searchInput").value = button.dataset.search;
  renderTools();
  $("#explore").scrollIntoView({behavior:"smooth"});
}));
document.querySelectorAll('input[name="pricing"]').forEach(input => input.addEventListener("change", () => {
  selectedPricing = input.value;
  renderTools();
}));
$("#featuredBtn").addEventListener("click", () => {
  featuredOnly = !featuredOnly;
  $("#featuredBtn").classList.toggle("active", featuredOnly);
  renderTools();
});
function resetFilters() {
  $("#searchInput").value = "";
  selectedCategory = "All";
  selectedPricing = "All";
  featuredOnly = false;
  document.querySelector('input[name="pricing"][value="All"]').checked = true;
  $("#featuredBtn").classList.remove("active");
  renderCategories();
  renderTools();
}
$("#clearBtn").addEventListener("click", resetFilters);
$("#resetBtn").addEventListener("click", resetFilters);
$("#dialogClose").addEventListener("click", () => $("#toolDialog").close());
$("#toolDialog").addEventListener("click", event => {
  if (event.target === $("#toolDialog")) $("#toolDialog").close();
});
$("#year").textContent = new Date().getFullYear();
$("#menuBtn").addEventListener("click", () => $("#nav").classList.toggle("open"));
$("#nav").querySelectorAll("a").forEach(link => link.addEventListener("click", () => $("#nav").classList.remove("open")));

loadTools();
