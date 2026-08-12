/* =========================================================
   这个文件不用手动改内容了！
   房源资料 → 改 data/properties.json (或用 /admin 后台编辑)
   个人资料 → 改 data/profile.json (或用 /admin 后台编辑)
   这里只是负责「把数据显示到网页上」的逻辑，一般不需要碰。
========================================================= */

let PROPERTIES = [];

const grid = document.getElementById("listingGrid");
const emptyState = document.getElementById("emptyState");
const regionSelect = document.getElementById("regionSelect");
const searchInput = document.getElementById("searchInput");
const typeSelect = document.getElementById("typeSelect");
const chips = document.querySelectorAll(".chip");

let activeCategory = "all";
let WHATSAPP_NUMBER = "60123456789";

/* =========================================================
   加载数据
========================================================= */
async function loadProperties() {
  try {
    const res = await fetch("data/properties.json", { cache: "no-store" });
    const json = await res.json();
    PROPERTIES = json.items || [];
  } catch (err) {
    console.error("无法读取 data/properties.json", err);
    PROPERTIES = [];
  }
}

async function loadProfile() {
  try {
    const res = await fetch("data/profile.json", { cache: "no-store" });
    const p = await res.json();

    setText("brandName", p.name, true);
    setText("profileName", p.name);
    setText("profileBio", p.bio);
    setText("statRen", p.ren);
    setText("statDeals", p.deals);
    setText("statRating", p.rating);
    setText("contactPhone", p.phone_display);
    setText("contactEmail", p.email);
    setText("footerName", p.name);

    const photo = document.getElementById("profilePhoto");
    if (photo && p.photo) photo.src = p.photo;

    const callBtn = document.getElementById("callBtn");
    if (callBtn && p.phone_tel) callBtn.href = `tel:${p.phone_tel}`;

    if (p.whatsapp) WHATSAPP_NUMBER = p.whatsapp;
  } catch (err) {
    console.error("无法读取 data/profile.json", err);
  }
}

function setText(id, value, keepSmallTag) {
  const el = document.getElementById(id);
  if (!el || !value) return;
  if (keepSmallTag) {
    el.innerHTML = `${value}<br><small>Property Consultant</small>`;
  } else {
    el.textContent = value;
  }
}

/* =========================================================
   渲染房源
========================================================= */
function populateRegions() {
  regionSelect.querySelectorAll("option:not(:first-child)").forEach(o => o.remove());
  const regions = [...new Set(PROPERTIES.map(p => p.region))].sort();
  regions.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    regionSelect.appendChild(opt);
  });
}

function placeholderImg(title) {
  return `https://placehold.co/600x450/0f3d3e/f4f6f5?text=${encodeURIComponent(title || "Property")}`;
}

function renderCard(p) {
  const el = document.createElement("article");
  el.className = "ticket";
  el.innerHTML = `
    <div class="ticket-image">
      <span class="ticket-purpose">${p.purpose === "Sale" ? "For Sale" : "For Rent"}</span>
      <img src="${p.image}" alt="${p.title}" onerror="this.src='${placeholderImg(p.title)}'">
    </div>
    <div class="ticket-body">
      <div class="ticket-price">${p.price}</div>
      <h3 class="ticket-title">${p.title}</h3>
      <p class="ticket-loc">${p.region} · ${p.beds} bed · ${p.baths} bath · ${p.sqft}</p>
    </div>
    <div class="ticket-stub">
      <span>${p.category}</span>
      <a href="#chat" data-ask="${p.title} (${p.region})">Ask about this →</a>
    </div>
  `;
  return el;
}

function applyFilters() {
  const keyword = searchInput.value.trim().toLowerCase();
  const region = regionSelect.value;
  const purpose = typeSelect.value;

  const filtered = PROPERTIES.filter(p => {
    const matchesKeyword =
      !keyword ||
      p.title.toLowerCase().includes(keyword) ||
      p.region.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword);
    const matchesRegion = region === "all" || p.region === region;
    const matchesPurpose = purpose === "all" || p.purpose === purpose;
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    return matchesKeyword && matchesRegion && matchesPurpose && matchesCategory;
  });

  grid.innerHTML = "";
  if (filtered.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    filtered.forEach(p => grid.appendChild(renderCard(p)));
  }

  grid.querySelectorAll("[data-ask]").forEach(link => {
    link.addEventListener("click", () => {
      document.getElementById("propertyInput").value = link.dataset.ask;
      document.getElementById("messageInput").focus();
    });
  });
}

/* =========================================================
   事件绑定
========================================================= */
document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  applyFilters();
  document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", applyFilters);
regionSelect.addEventListener("change", applyFilters);
typeSelect.addEventListener("change", applyFilters);

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeCategory = chip.dataset.category;
    applyFilters();
  });
});

document.getElementById("chatForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("nameInput").value.trim();
  const property = document.getElementById("propertyInput").value.trim();
  const message = document.getElementById("messageInput").value.trim();

  let text = `Hi, I'm ${name}.`;
  if (property) text += ` I'm interested in: ${property}.`;
  text += ` ${message}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
});

document.getElementById("year").textContent = new Date().getFullYear();

/* =========================================================
   初始化
========================================================= */
(async function init() {
  await Promise.all([loadProperties(), loadProfile()]);
  populateRegions();
  applyFilters();
})();
