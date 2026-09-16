/* =========================================================
   1. YOUR PROPERTY DATA
   -----------------------------------------------------------
   Edit this list to add / remove / update your listings.
   - image: put your photo in the /images folder and put the
            filename here, e.g. "images/austin-condo-1.jpg"
   - category: must match a chip value in index.html
               (Condo, Terrace, Semi-D, Bungalow, Apartment)
   - purpose: "Sale" or "Rent"
========================================================= */
const PROPERTIES = [
  {
    id: "p1",
    title: "3BR Condo with City View",
    region: "Bukit Indah",
    category: "Condo",
    purpose: "Sale",
    price: "RM 620,000",
    beds: 3,
    baths: 2,
    sqft: "1,150 sqft",
    image: "images/listing-1.jpg"
  },
  {
    id: "p2",
    title: "Renovated Double-Storey Terrace",
    region: "Austin Heights",
    category: "Terrace",
    purpose: "Sale",
    price: "RM 780,000",
    beds: 4,
    baths: 3,
    sqft: "1,800 sqft",
    image: "images/listing-2.jpg"
  },
  {
    id: "p3",
    title: "Fully Furnished Studio",
    region: "Skudai",
    category: "Apartment",
    purpose: "Rent",
    price: "RM 1,300 / mo",
    beds: 1,
    baths: 1,
    sqft: "500 sqft",
    image: "images/listing-3.jpg"
  },
  {
    id: "p4",
    title: "Corner Semi-D, Gated & Guarded",
    region: "Nusajaya",
    category: "Semi-D",
    purpose: "Sale",
    price: "RM 1,450,000",
    beds: 5,
    baths: 4,
    sqft: "2,900 sqft",
    image: "images/listing-4.jpg"
  },
  {
    id: "p5",
    title: "Modern Bungalow with Pool",
    region: "Iskandar Puteri",
    category: "Bungalow",
    purpose: "Sale",
    price: "RM 2,850,000",
    beds: 6,
    baths: 5,
    sqft: "4,200 sqft",
    image: "images/listing-5.jpg"
  },
  {
    id: "p6",
    title: "2BR Serviced Apartment",
    region: "Tebrau",
    category: "Condo",
    purpose: "Rent",
    price: "RM 1,800 / mo",
    beds: 2,
    baths: 2,
    sqft: "850 sqft",
    image: "images/listing-6.jpg"
  }
];

/* =========================================================
   2. CONTACT SETTINGS — edit these
========================================================= */
const WHATSAPP_NUMBER = "60123456789"; // country code + number, no + or spaces

/* =========================================================
   3. RENDERING
========================================================= */
const grid = document.getElementById("listingGrid");
const emptyState = document.getElementById("emptyState");
const regionSelect = document.getElementById("regionSelect");
const searchInput = document.getElementById("searchInput");
const typeSelect = document.getElementById("typeSelect");
const chips = document.querySelectorAll(".chip");

let activeCategory = "all";

function populateRegions() {
  const regions = [...new Set(PROPERTIES.map(p => p.region))].sort();
  regions.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    regionSelect.appendChild(opt);
  });
}

function placeholderImg(title) {
  return `https://placehold.co/600x450/0f3d3e/f4f6f5?text=${encodeURIComponent(title)}`;
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

  // wire up "Ask about this" links to prefill the message box
  grid.querySelectorAll("[data-ask]").forEach(link => {
    link.addEventListener("click", () => {
      document.getElementById("propertyInput").value = link.dataset.ask;
      document.getElementById("messageInput").focus();
    });
  });
}

/* =========================================================
   4. EVENTS
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
   5. INIT
========================================================= */
populateRegions();
applyFilters();
