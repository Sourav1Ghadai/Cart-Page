const apiURL = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";

let cartData = [];

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.querySelector(".cart-items");
  const subtotalElement = document.querySelector("#subtotal");
  const totalElement = document.querySelector("#total");

  // Fetch cart data
  async function fetchCartData() {
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      cartData = data.items; // Save the fetched cart data
      renderCartItems(cartData);
      updateTotals(cartData);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }

  // Render cart items
  function renderCartItems(items) {
    cartItemsContainer.innerHTML = ""; // Clear the container before rendering

    items.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-info">
          <h4>${item.title}</h4>
          <p>₹${(item.price / 100).toFixed(2)}</p>
        </div>
        <div class="cart-item-controls">
          <input type="number" min="1" value="${item.quantity}" data-id="${item.id}">
          <button data-id="${item.id}">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    addEventListeners();
  }

  // Update subtotal and total
  function updateTotals(items) {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0) / 100;
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    totalElement.textContent = `₹${subtotal.toFixed(2)}`;
  }

  // Add event listeners for quantity change and remove button
  function addEventListeners() {
    document.querySelectorAll(".cart-item-controls input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        const id = e.target.dataset.id;
        console.log(`Update item ${id} to quantity ${newQuantity}`);
        updateItemQuantity(id, newQuantity);
      });
    });

    document.querySelectorAll(".cart-item-controls button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        console.log(`Remove item with id ${id}`);
        removeItem(id);
      });
    });
  }

  // Update item quantity in the cart
  function updateItemQuantity(id, newQuantity) {
    const item = cartData.find((item) => item.id == id);
    if (item) {
      item.quantity = newQuantity;
      renderCartItems(cartData);
      updateTotals(cartData);
    }
  }

  // Remove item from the cart
  function removeItem(id) {
    cartData = cartData.filter((item) => item.id != id);
    renderCartItems(cartData);
    updateTotals(cartData);
  }

  // Initialize
  fetchCartData();
});
