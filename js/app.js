/**
 * Sai Bazaar - Core State & Database Management
 * Handles localStorage database initialization, shopping cart, and inquiries.
 */

const DEFAULT_VEGETABLES = [
  {
    id: "veg-1",
    name: "Potato",
    hindiName: "Aloo",
    category: "root",
    price: 22,
    marketPrice: 35,
    unit: "1 kg",
    stock: 150,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80",
    description: "Daily essential farm-fresh potatoes. Perfect for curries, fries, and baking.",
    rating: 4.8,
    reviews: [
      { name: "Rajesh Kumar", rating: 5, comment: "Very clean potatoes, uniform size. Great price!", date: "2026-06-15" },
      { name: "Sunita Devi", rating: 4, comment: "Fresh and good, cheaper than local market.", date: "2026-06-16" }
    ],
    isFeatured: true,
    isOffer: false,
    discountText: ""
  },
  {
    id: "veg-2",
    name: "Onion",
    hindiName: "Pyaz",
    category: "root",
    price: 28,
    marketPrice: 45,
    unit: "1 kg",
    stock: 120,
    image: "https://images.unsplash.com/photo-1618519764620-7403abdbfee9?w=500&q=80",
    description: "Premium quality red onions sourced from Nasik. Crisp, pungent, and essential for every Indian dish.",
    rating: 4.7,
    reviews: [
      { name: "Amit Sharma", rating: 5, comment: "Very good quality onions, dry and fresh.", date: "2026-06-14" }
    ],
    isFeatured: true,
    isOffer: true,
    discountText: "37% OFF"
  },
  {
    id: "veg-3",
    name: "Tomato",
    hindiName: "Tamatar",
    category: "seasonal",
    price: 18,
    marketPrice: 32,
    unit: "1 kg",
    stock: 80,
    image: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&q=80",
    description: "Juicy, ripe red tomatoes. Handpicked from local farms for peak freshness and tanginess.",
    rating: 4.6,
    reviews: [
      { name: "Preeti Singh", rating: 5, comment: "Super fresh and red! Made amazing chutney.", date: "2026-06-16" },
      { name: "Ramesh Sen", rating: 4, comment: "Nice size and fresh. Will buy again.", date: "2026-06-17" }
    ],
    isFeatured: true,
    isOffer: true,
    discountText: "43% OFF"
  },
  {
    id: "veg-4",
    name: "Spinach",
    hindiName: "Palak",
    category: "leafy",
    price: 15,
    marketPrice: 25,
    unit: "1 bunch",
    stock: 50,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80",
    description: "Fresh, iron-rich green spinach leaves. Sourced daily, washed, and packed with nutrients.",
    rating: 4.9,
    reviews: [
      { name: "Meena Gupta", rating: 5, comment: "Incredibly fresh! Not a single wilted leaf.", date: "2026-06-17" }
    ],
    isFeatured: true,
    isOffer: false,
    discountText: ""
  },
  {
    id: "veg-5",
    name: "Okra / Ladyfinger",
    hindiName: "Bhindi",
    category: "seasonal",
    price: 32,
    marketPrice: 50,
    unit: "1 kg",
    stock: 60,
    image: "https://images.unsplash.com/photo-1625938146369-adc83368bda7?w=500&q=80",
    description: "Tender, slim, and green ladyfingers. Perfect for making crispy Bhindi Bhujia.",
    rating: 4.5,
    reviews: [
      { name: "Vikas Patil", rating: 4, comment: "Tender and fresh bhindi. Clean packaging.", date: "2026-06-13" }
    ],
    isFeatured: false,
    isOffer: true,
    discountText: "36% OFF"
  },
  {
    id: "veg-6",
    name: "Cauliflower",
    hindiName: "Phool Gobhi",
    category: "seasonal",
    price: 25,
    marketPrice: 40,
    unit: "1 piece",
    stock: 40,
    image: "https://images.unsplash.com/photo-1568584711271-e305748c2125?w=500&q=80",
    description: "Compact, clean, and snow-white cauliflower heads. Sourced directly from local farmers.",
    rating: 4.4,
    reviews: [],
    isFeatured: false,
    isOffer: false,
    discountText: ""
  },
  {
    id: "veg-7",
    name: "Eggplant / Brinjal",
    hindiName: "Baingan",
    category: "seasonal",
    price: 24,
    marketPrice: 38,
    unit: "1 kg",
    stock: 55,
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4bc8ff?w=500&q=80",
    description: "Glossy, deep purple large brinjals. Perfect for making traditional Baingan ka Bhartha.",
    rating: 4.5,
    reviews: [],
    isFeatured: false,
    isOffer: false,
    discountText: ""
  },
  {
    id: "veg-8",
    name: "Carrot",
    hindiName: "Gajar",
    category: "root",
    price: 35,
    marketPrice: 50,
    unit: "1 kg",
    stock: 70,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80",
    description: "Sweet, crunchy, and bright red carrots. Rich in Vitamin A, ideal for salads, juice, or Gajar Halwa.",
    rating: 4.7,
    reviews: [
      { name: "Ananya Roy", rating: 5, comment: "Sweet and very fresh carrots. Recommended!", date: "2026-06-15" }
    ],
    isFeatured: true,
    isOffer: false,
    discountText: ""
  },
  {
    id: "veg-9",
    name: "Ginger",
    hindiName: "Adrak",
    category: "herbs",
    price: 28,
    marketPrice: 45,
    unit: "250 g",
    stock: 35,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80",
    description: "Strongly aromatic and spicy ginger roots. Adds a kick to your morning tea and daily curries.",
    rating: 4.8,
    reviews: [],
    isFeatured: false,
    isOffer: false,
    discountText: ""
  },
  {
    id: "veg-10",
    name: "Garlic",
    hindiName: "Lahsun",
    category: "herbs",
    price: 38,
    marketPrice: 60,
    unit: "250 g",
    stock: 30,
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&q=80",
    description: "Bold-flavored organic garlic bulbs. Essential for rich tempering (Tadka) in Indian food.",
    rating: 4.6,
    reviews: [],
    isFeatured: false,
    isOffer: false,
    discountText: ""
  },
  {
    id: "veg-11",
    name: "Coriander",
    hindiName: "Dhania",
    category: "herbs",
    price: 8,
    marketPrice: 15,
    unit: "1 bunch",
    stock: 90,
    image: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=500&q=80",
    description: "Freshly plucked coriander leaves. Highly aromatic, ideal for garnishing and green chutneys.",
    rating: 4.9,
    reviews: [
      { name: "Kiran Verma", rating: 5, comment: "Super fresh, cheap and smells amazing!", date: "2026-06-16" }
    ],
    isFeatured: true,
    isOffer: true,
    discountText: "47% OFF"
  },
  {
    id: "veg-12",
    name: "Green Chillies",
    hindiName: "Hari Mirch",
    category: "herbs",
    price: 12,
    marketPrice: 20,
    unit: "200 g",
    stock: 45,
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&q=80",
    description: "Hot and spicy green chillies. Sourced fresh to add authentic Indian spice to your cooking.",
    rating: 4.7,
    reviews: [],
    isFeatured: false,
    isOffer: false,
    discountText: ""
  },
  {
    id: "veg-13",
    name: "Bottle Gourd",
    hindiName: "Lauki",
    category: "seasonal",
    price: 20,
    marketPrice: 35,
    unit: "1 piece",
    stock: 50,
    image: "https://images.unsplash.com/photo-1625938146369-adc83368bda7?w=500&q=80",
    description: "Fresh, tender bottle gourd. Highly hydrating, perfect for soups, curries, and Lauki Halwa.",
    rating: 4.3,
    reviews: [],
    isFeatured: false,
    isOffer: true,
    discountText: "42% OFF"
  },
  {
    id: "veg-14",
    name: "Green Peas",
    hindiName: "Matar",
    category: "seasonal",
    price: 45,
    marketPrice: 80,
    unit: "1 kg",
    stock: 40,
    image: "https://images.unsplash.com/photo-1587570220977-172af0a3d43b?w=500&q=80",
    description: "Sweet and tender green peas. Freshly harvested, ideal for Matar Paneer or Pulao.",
    rating: 4.8,
    reviews: [
      { name: "Divya Kapoor", rating: 5, comment: "Sweet peas, shells were full. Very fresh.", date: "2026-06-14" }
    ],
    isFeatured: true,
    isOffer: true,
    discountText: "43% OFF"
  },
  {
    id: "veg-15",
    name: "Lemon",
    hindiName: "Nimbu",
    category: "herbs",
    price: 15,
    marketPrice: 30,
    unit: "250 g",
    stock: 60,
    image: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=500&q=80",
    description: "Juicy, seedless yellow lemons. Perfect for refreshing lemonade or squeezing over salads.",
    rating: 4.7,
    reviews: [],
    isFeatured: false,
    isOffer: true,
    discountText: "50% OFF"
  },
  {
    id: "veg-16",
    name: "Cabbage",
    hindiName: "Patta Gobhi",
    category: "leafy",
    price: 20,
    marketPrice: 35,
    unit: "1 piece",
    stock: 50,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&q=80",
    description: "Crisp and tightly packed green cabbages. High in fiber and vitamins.",
    rating: 4.4,
    reviews: [],
    isFeatured: false,
    isOffer: false,
    discountText: ""
  }
];

// Initialize database
function initDatabase() {
  if (!localStorage.getItem("sb_products")) {
    localStorage.setItem("sb_products", JSON.stringify(DEFAULT_VEGETABLES));
  }
  if (!localStorage.getItem("sb_cart")) {
    localStorage.setItem("sb_cart", JSON.stringify([]));
  }
  if (!localStorage.getItem("sb_inquiries")) {
    localStorage.setItem("sb_inquiries", JSON.stringify([]));
  }
  if (!localStorage.getItem("sb_orders")) {
    localStorage.setItem("sb_orders", JSON.stringify([]));
  }
}

initDatabase();

// Product CRUD functions
function getProducts() {
  initDatabase();
  return JSON.parse(localStorage.getItem("sb_products"));
}

function saveProducts(products) {
  localStorage.setItem("sb_products", JSON.stringify(products));
}

function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === id) || null;
}

function updateProduct(id, updatedFields) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedFields };
    saveProducts(products);
    return true;
  }
  return false;
}

function addProduct(product) {
  const products = getProducts();
  const newId = "veg-" + (Math.max(...products.map(p => parseInt(p.id.split("-")[1]) || 0), 0) + 1);
  const newProduct = {
    id: newId,
    rating: 5.0,
    reviews: [],
    isFeatured: false,
    isOffer: false,
    discountText: "",
    ...product
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

function deleteProduct(id) {
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
}

function resetDatabase() {
  localStorage.setItem("sb_products", JSON.stringify(DEFAULT_VEGETABLES));
  return DEFAULT_VEGETABLES;
}

// Cart Management
function getCart() {
  initDatabase();
  return JSON.parse(localStorage.getItem("sb_cart"));
}

function saveCart(cart) {
  localStorage.setItem("sb_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const product = getProductById(id);
  if (!product || product.stock <= 0) return false;

  const existingItemIndex = cart.findIndex(item => item.id === id);
  if (existingItemIndex !== -1) {
    const newQty = cart[existingItemIndex].quantity + qty;
    if (newQty > product.stock) {
      cart[existingItemIndex].quantity = product.stock;
    } else {
      cart[existingItemIndex].quantity = newQty;
    }
  } else {
    cart.push({ id, quantity: Math.min(qty, product.stock) });
  }
  saveCart(cart);
  showToast(`${product.name} (${product.hindiName}) added to cart!`);
  return true;
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
}

function updateCartQty(id, qty) {
  const cart = getCart();
  const product = getProductById(id);
  if (!product) return;

  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex !== -1) {
    if (qty <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = Math.min(qty, product.stock);
    }
    saveCart(cart);
  }
}

function clearCart() {
  saveCart([]);
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll(".cart-count-badge");
  badges.forEach(badge => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "flex" : "none";
  });
}

// Inquiries / Reviews / Orders
function getInquiries() {
  return JSON.parse(localStorage.getItem("sb_inquiries")) || [];
}

function addInquiry(inquiry) {
  const inquiries = getInquiries();
  inquiry.id = Date.now();
  inquiry.date = new Date().toISOString().split("T")[0];
  inquiries.push(inquiry);
  localStorage.setItem("sb_inquiries", JSON.stringify(inquiries));
  return true;
}

function addProductReview(productId, review) {
  const product = getProductById(productId);
  if (product) {
    review.date = new Date().toISOString().split("T")[0];
    product.reviews = product.reviews || [];
    product.reviews.push(review);
    
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = parseFloat((totalRating / product.reviews.length).toFixed(1));
    
    updateProduct(productId, { reviews: product.reviews, rating: product.rating });
    return true;
  }
  return false;
}

function placeOrder(orderData) {
  const orders = JSON.parse(localStorage.getItem("sb_orders")) || [];
  orderData.id = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  orderData.date = new Date().toISOString().split("T")[0];
  orderData.status = "Pending";
  orders.push(orderData);
  localStorage.setItem("sb_orders", JSON.stringify(orders));
  
  const products = getProducts();
  orderData.items.forEach(orderItem => {
    const p = products.find(prod => prod.id === orderItem.id);
    if (p) {
      p.stock = Math.max(0, p.stock - orderItem.quantity);
    }
  });
  saveProducts(products);
  
  clearCart();
  return orderData.id;
}

// Global UI Toast Helper
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    background: ${type === 'success' ? '#1E3F20' : '#d32f2f'};
    color: white;
    padding: 14px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    font-family: 'Outfit', sans-serif;
    font-weight: 500;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateY(50px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    pointer-events: auto;
  `;
  
  const icon = type === 'success' ? '🌱' : '⚠️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    toast.style.transform = "translateY(-20px)";
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}

// Auto update badge and handle owner authentication features on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  // Render Admin Link if already authenticated
  const adminNavLink = document.getElementById("adminNavLink");
  if (adminNavLink && sessionStorage.getItem("sb_admin_logged_in") === "true") {
    adminNavLink.style.display = "block";
  }

  // Hook double-click on owner circle logo to jump to admin page
  const logoOwner = document.querySelector(".logo-owner-frame");
  if (logoOwner) {
    logoOwner.title = "Double click to manage website";
    logoOwner.addEventListener("dblclick", () => {
      window.location.href = "admin.html";
    });
  }

  // Register Service Worker for PWA offline caching
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js")
        .then((reg) => console.log("[PWA] Service Worker registered successfully:", reg.scope))
        .catch((err) => console.error("[PWA] Service Worker registration failed:", err));
    });
  }
});
