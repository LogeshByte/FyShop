// Product data
const products = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 19.99,
    image:
      "https://m.media-amazon.com/images/I/71EcAtglToL._AC_UL640_FMwebp_QL65_.jpg",
    description: "Soft cotton t-shirt perfect for daily wear.",
    category: "clothing",
  },
  {
    id: 2,
    name: "Wireless Earbuds",
    price: 49.99,
    image: "https://m.media-amazon.com/images/I/61OhaIzbpML._SL1500_.jpg",
    description: "High quality sound and long battery life.",
    category: "electronics",
  },
  {
    id: 3,
    name: "Stylish Jacket",
    price: 129.99,
    image:
      "https://m.media-amazon.com/images/I/41W5iFLJ0rL._AC_UL640_FMwebp_QL65_.jpg",
    description: "Stay warm and stylish with this premium jacket.",
    category: "clothing",
  },
  {
    id: 4,
    name: "Smartphone Stand",
    price: 14.99,
    image:
      "https://m.media-amazon.com/images/I/51u2MqPaQwL._AC_UY436_FMwebp_QL65_.jpg",
    description: "Adjustable stand for your smartphone or tablet.",
    category: "accessories",
  },
];

const cartCount = document.getElementById("cartCount"); // Cart count badge
const cartItems = []; // Array to hold cart items

// Function to render products dynamically
function renderProducts(productList) {
  const productContainer = document.getElementById("productList");
  productContainer.innerHTML = ""; // Clear existing products

  productList.forEach((product) => {
    const productCard = `
    <div class="col-md-3 mb-4">
  <div class="card h-100 shadow-lg border-0 rounded-3 overflow-hidden" style="transition: transform 0.3s ease, box-shadow 0.3s ease;">
    <div class="position-relative">
      <img src="${product.image}" alt="${product.name}" class="card-img-top" style="height: 200px; object-fit: cover; border-top-left-radius: 15px; border-top-right-radius: 15px;">
      <div class="position-absolute top-0 end-0 p-2">
        <span class="badge bg-success rounded-pill">In Stock</span>
      </div>
      <div class="position-absolute bottom-0 start-0 end-0 bg-gradient-to-t from-dark to-transparent p-2 text-white opacity-0 hover-opacity-100 transition-opacity duration-300">
        <small>Quick Preview</small>
      </div>
    </div>
    <div class="card-body d-flex flex-column p-4">
      <h5 class="card-title mb-2 text-dark" style="font-size: 1.2rem; font-weight: 600;">${product.name}</h5>
      <p class="card-text text-muted mb-3" style="font-size: 0.9rem; line-height: 1.4;">${product.description}</p>
      <div class="d-flex align-items-center mb-3">
        <span class="text-primary fw-bold me-2" style="font-size: 1.1rem;">$${product.price.toFixed(2)}</span>
        <span class="text-muted text-decoration-line-through fs-6">${product.originalPrice ? '$' + product.originalPrice.toFixed(2) : ''}</span>
      </div>
      <div class="d-flex align-items-center mb-3">
        <span class="text-warning me-1">★★★★☆</span>
        <small class="text-muted">(${product.reviews || 0} reviews)</small>
      </div>
      <button class="btn btn-primary mt-auto rounded-pill btnProduct" data-id="${product.id}" style="padding: 8px 16px; font-weight: 500;">
        <i class="bi bi-cart3 me-1"></i> Add to Cart
      </button>
    </div>
  </div>
</div>

    `;
    productContainer.innerHTML += productCard;
  });

  // Add event listeners to product buttons
  const productBtns = document.querySelectorAll(".btnProduct");
  productBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = parseInt(this.dataset.id); // Get product ID from button
      addToCart(productId, this); // Pass the button to disable it
    });
  });
}

// Function to add items to the cart
function addToCart(productId, button) {
  const product = products.find((p) => p.id === productId); // Find the product in the array

  if (!product) {
    console.error("Product not found!");
    return;
  }

  const existingItem = cartItems.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1; // Increment quantity if the product is already in the cart
    existingItem.total = existingItem.quantity * existingItem.price; // Update total
  } else {
    cartItems.push({
      ...product,
      quantity: 1,
      total: product.price,
    });
    button.disabled = true; // Disable the button after adding to the cart
    button.textContent = "Added";
  }

  updateCartCount(); // Update the cart count
  updateCartModal(); // Update the cart modal
}

// Function to update the cart count
function updateCartCount() {
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  cartCount.textContent = totalQuantity; // Update the cart count badge
}

// Function to update the cart modal
function updateCartModal() {
  const cartItemsContainer = document.getElementById("cartItems");
  cartItemsContainer.innerHTML = ""; // Clear the modal body

  let totalPrice = 0;

  cartItems.forEach((item, index) => {
    totalPrice += item.total;

    const cartRow = `
      <tr>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-secondary decrease-btn" data-index="${index}">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-sm btn-secondary increase-btn" data-index="${index}">+</button>
        </td>
        <td>$${item.total.toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-danger remove-btn" data-index="${index}">Remove</button>
        </td>
      </tr>
    `;
    cartItemsContainer.innerHTML += cartRow;
  });

  // Update the total price in the modal footer
  const totalFooter = document.getElementById("cartTotal");
  totalFooter.textContent = `$${totalPrice.toFixed(2)}`;
}

// Event delegation for cart actions
document
  .getElementById("cartItems")
  .addEventListener("click", function (event) {
    const index = parseInt(event.target.dataset.index); // Get the index of the item

    if (event.target.classList.contains("remove-btn")) {
      removeFromCart(index);
    } else if (event.target.classList.contains("increase-btn")) {
      increaseQuantity(index);
    } else if (event.target.classList.contains("decrease-btn")) {
      decreaseQuantity(index);
    }
  });

// Function to remove items from the cart
function removeFromCart(index) {
  const removedItem = cartItems.splice(index, 1)[0]; // Remove the item from the cart
  updateCartCount(); // Update the cart count
  updateCartModal(); // Update the cart modal

  // Re-enable the "Add to Cart" button for the removed item
  const productButton = document.querySelector(
    `.btnProduct[data-id="${removedItem.id}"]`
  );
  if (productButton) {
    productButton.disabled = false;
    productButton.textContent = "Add to Cart";
  }
}

// Function to increase the quantity of an item
function increaseQuantity(index) {
  const item = cartItems[index];
  item.quantity += 1;
  item.total = item.quantity * item.price;
  updateCartCount();
  updateCartModal();
}

// Function to decrease the quantity of an item
function decreaseQuantity(index) {
  const item = cartItems[index];
  if (item.quantity > 1) {
    item.quantity -= 1;
    item.total = item.quantity * item.price;
  } else {
    removeFromCart(index); // Remove the item if quantity reaches 0
  }
  updateCartCount();
  updateCartModal();
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  renderProducts(products); // Render the products

  // Initialize the cart modal
  const btnCart = document.getElementById("btnCart");
  const myModal = new bootstrap.Modal(document.getElementById("myModal"));

  btnCart.addEventListener("click", function () {
    myModal.show(); // Show the modal
  });
});

// Event listener for the Checkout button
document
  .getElementById("checkoutButton")
  .addEventListener("click", function () {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed to checkout.");
      return;
    }

    // Save the cart items to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Redirect to the checkout page
    window.location.href = "checkout.html";
  });
