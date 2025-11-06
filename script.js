// 🛍️ Product data (all images visible from Unsplash / Pexels)
const products = [
  { id: 1, name: "Wireless Headphones", price: 1500, category: "electronics", image: "headphone.jpeg" },
  { id: 2, name: "Smart Watch", price: 2500, category: "electronics", image: "images/smartwatch.jpeg" },
  { id: 3, name: "Bluetooth Speaker", price: 1300, category: "gadgets", image: "images/speaker.jpeg" },
  { id: 4, name: "Gaming Mouse", price: 900, category: "gadgets", image: "images/mouse.jpeg" },
  { id: 5, name: "Laptop Bag", price: 1200, category: "accessories", image: "images/laptopbag.jpeg" },
  { id: 6, name: "Leather Wallet", price: 1000, category: "accessories", image: "https://images.unsplash.com/photo-1603782939793-8a8d2fce94aa?w=600" },
  { id: 7, name: "Home Lamp", price: 1500, category: "home", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600" },
  { id: 8, name: "Sofa Cushion", price: 800, category: "home", image: "https://images.unsplash.com/photo-1616628188335-28ac9d5c8813?w=600" },
  { id: 9, name: "Denim Jacket", price: 2000, category: "fashion", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600" },
  { id: 10, name: "Sunglasses", price: 750, category: "fashion", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600" },
  { id: 11, name: "Running Shoes", price: 1800, category: "fashion", image: "https://images.unsplash.com/photo-1528701800489-20be0f6b3f33?w=600" },
  { id: 12, name: "Desk Organizer", price: 700, category: "home", image: "https://images.unsplash.com/photo-1589984662646-1f41e5d29e6d?w=600" },
  { id: 13, name: "Wireless Keyboard", price: 1400, category: "electronics", image: "https://images.unsplash.com/photo-1555617981-bb4b9a8a8855?w=600" },
  { id: 14, name: "Air Purifier", price: 3000, category: "home", image: "https://images.unsplash.com/photo-1623039405147-2f88f9961828?w=600" },
  { id: 15, name: "Bluetooth Earbuds", price: 1600, category: "gadgets", image: "https://images.unsplash.com/photo-1611432579699-47a3e3d6f2b0?w=600" },
];

const productList = document.getElementById("product-list");
const navItems = document.querySelectorAll(".nav-item");
const searchInput = document.getElementById("search-input");
const cartModal = document.getElementById("cart-modal");
const cartBtn = document.getElementById("cart-btn");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");
const themeToggle = document.getElementById("theme-toggle");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🌙 Theme setup
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// 🧩 Display products
function displayProducts(filter = "all", searchTerm = "") {
  productList.innerHTML = "";
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
  const searched = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  searched.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button class="add-btn" data-id="${p.id}">Add to Cart</button>
    `;
    productList.appendChild(div);
  });

  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id)));
  });
}

displayProducts();
updateCart();

// 🧭 Navigation & Search
navItems.forEach(item => {
  item.addEventListener("click", () => {
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    displayProducts(item.dataset.category, searchInput.value);
  });
});

searchInput.addEventListener("input", () => {
  const activeCategory = document.querySelector(".nav-item.active").dataset.category;
  displayProducts(activeCategory, searchInput.value);
});

// 🛒 Cart Functions
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  existing ? existing.qty++ : cart.push({ ...product, qty: 1 });
  saveCart();
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  saveCart();
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name}</span>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">➖</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">➕</button>
      </div>
      <span>₹${item.price * item.qty}</span>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">✖</button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = total;
  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 🪟 Cart Modal
cartBtn.onclick = () => (cartModal.style.display = "block");
closeCart.onclick = () => (cartModal.style.display = "none");
window.onclick = e => { if (e.target === cartModal) cartModal.style.display = "none"; };

// 💳 Checkout
checkoutBtn.onclick = () => {
  if (!cart.length) return alert("Your cart is empty!");
  alert("🎉 Order placed successfully!");
  cart = [];
  saveCart();
  updateCart();
  cartModal.style.display = "none";
};

