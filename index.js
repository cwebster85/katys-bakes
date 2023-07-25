import { menuArray } from "./data.js";

const products = document.getElementById("products");
const basketContainer = document.getElementById("basket");

const basketArr = []; // Array to store selected items and their details
let itemIdCounter = 0; // Counter for assigning unique identifiers

products.innerHTML = "";

menuArray.forEach((item) => {
  products.innerHTML += `
    <div class="products">
        <div class="product-info">
            <img class="cakes" src="${item.img}" />
            <div class="products-info">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-info">${item.info}</p>
                <h3 class="item-price">&pound;${item.price}</h3>
            </div>
            <button class="buy-btn" data-id="${itemIdCounter}">+</button>
        </div>
        <div class="border"></div>
    </div>
  `;
  itemIdCounter++;
});

const buyBtns = document.getElementsByClassName("buy-btn");

Array.from(buyBtns).forEach((btn) => {
  btn.addEventListener("click", function () {
    const itemId = parseInt(btn.dataset.id);

    // Find the item in the menuArray using the unique identifier
    const selectedItem = menuArray.find((item) => item.id === itemId);

    if (selectedItem) {
      // Check if the item is already in the basket
      const existingItem = basketArr.find((basketItem) => basketItem.id === itemId);

      if (existingItem) {
        // If the item exists, increase the count and update the price
        existingItem.count++;
        existingItem.subtotal = existingItem.count * existingItem.price;
      } else {
        // If the item is not in the basket, add it with count and price details
        basketArr.push({
          id: itemId,
          name: selectedItem.name,
          price: Number(selectedItem.price),
          count: 1,
          subtotal: Number(selectedItem.price),
        });
      }

      // Update the basket HTML
      updateBasket();
    }
  });
});

function updateBasket() {
  let basketHTML = "";
  let totalPrice = 0;

  if (basketArr.length === 0) {
    basketContainer.innerHTML = ""; // Empty the basketContainer if basketArr is empty
    return;
  }

  

  basketHTML += `
    <div class="basket-inner">
      <h3 class="basket-title">Your order</h3>
  `;

  basketArr.forEach((basketItem) => {
    const { id, name, count, price, subtotal } = basketItem;
    const formattedPrice = typeof price === "number" ? price.toFixed(2) : price;
    const formattedSubtotal = typeof subtotal === "number" ? subtotal.toFixed(2) : subtotal;

    basketHTML += `
      <div class="basket-item">
        <button class="remove-btn" data-id="${id}"> - </button>
        <p>${name} x ${count}</p>
      </div>
      <p class="subtotal">Subtotal: £${formattedSubtotal}</p>
    `;

    totalPrice += subtotal; // Accumulate the totalPrice correctly
  });

  const formattedTotalPrice = typeof totalPrice === "number" ? totalPrice.toFixed(2) : totalPrice;

  let totalHTML = `
    <div class="total">
      <h2 class="total-title">Total Price:</h2>
      <h2 class"total-price">£${formattedTotalPrice}</h2>
      <div id="payment-modal" class="modal"></div>
    </div>
    <button id="checkout">Complete Order</button>
  `;

  basketContainer.innerHTML = basketHTML + totalHTML;

  // Add event listeners to remove buttons
  const removeBtns = document.getElementsByClassName("remove-btn");
  Array.from(removeBtns).forEach((btn) => {
    btn.addEventListener("click", function () {
      const itemId = parseInt(btn.dataset.id);

      // Find the item in the basketArr using the unique identifier
      const existingItem = basketArr.find((item) => item.id === itemId);

      if (existingItem) {
        // Decrement the count by one
        existingItem.count--;

        if (existingItem.count === 0) {
          // If the count becomes zero, remove the item from the basketArr
          const index = basketArr.indexOf(existingItem);
          basketArr.splice(index, 1);
        } else {
          // Update the subtotal
          existingItem.subtotal = existingItem.count * existingItem.price;
        }

        // Update the basket HTML
        updateBasket();
      }
    });
  });

  //CHECKOUT BTN

  const checkout = document.getElementById("checkout");
  const modal = document.getElementById("payment-modal"); // Add this line
  let modalVisible = false;

  checkout.addEventListener("click", function () {
    if (!modalVisible) {
      modalVisible = true;
      container.classList.add("modal-open"); 
      modal.style.display = "flex";
      modal.innerHTML += `
        <div class="modal-container">
          <div class="modal-content">
            <span class="close">X</span>
            <span class="modal-title">Enter card details</span>
            <form id="form">
              <div id="error-container">
                <span id="name-error" class="error-message"></span>
                <span id="card-num-error" class="error-message"></span>
                <span id="cvv-error" class="error-message"></span>
              </div>
              <input type="text" placeholder="Enter your name" id="modal-name">
              <br>
              <input type="text" placeholder="Enter your card number" id="modal-card_num">
              <br>
              <input type="text" placeholder="Enter CVV" id="modal-cvv">
            </form>
            <button id="pay" class="pay">Pay</button>
          </div>
        </div>
      `;
  
      const span = document.getElementsByClassName("close")[0];
      const form = document.getElementById("form");
  
      span.onclick = function () {
        modal.style.display = "none";
        container.classList.remove("modal-open"); 
      };
  

      pay.addEventListener("click", function (event) {
        event.preventDefault();
      
        const form = document.getElementById("form");
        let isValid = true; // Flag to track form validity
      
        // Name validation
        const nameField = form.elements["modal-name"];
        const nameError = document.getElementById("name-error");
        if (!/^[A-Za-z]+$/.test(nameField.value)) {
          const errorMessage = createErrorMessage(
            "Please enter a valid name with alphabetical characters only."
          );
          displayErrorMessage(errorMessage, nameField);
          isValid = false; // Set form validity to false
        } else {
          nameField.classList.remove("invalid");
        }
      
        // Card number validation
        const cardNumField = form.elements["modal-card_num"];
        const cardNumError = document.getElementById("card-num-error");
        if (!/^\d+$/.test(cardNumField.value)) {
          const errorMessage = createErrorMessage(
            "Please enter a valid card number with numbers only."
          );
          displayErrorMessage(errorMessage, cardNumField);
          isValid = false; // Set form validity to false
        } else {
          cardNumField.classList.remove("invalid");
        }
      
        // CVV validation
        const cvvField = form.elements["modal-cvv"];
        const cvvError = document.getElementById("cvv-error");
        if (!/^\d{3}$/.test(cvvField.value)) {
          const errorMessage = createErrorMessage(
            "Please enter a valid CVV with three numeric characters."
          );
          displayErrorMessage(errorMessage, cvvField);
          isValid = false; // Set form validity to false
        } else {
          cvvField.classList.remove("invalid");
        }
      
        if (isValid) {
          // Form is valid, perform form submission actions here
          container.classList.remove("modal-open"); 
          const modalName = document.getElementById("modal-name").value;
          let successMessage = `
            <div class="success-message">
              <h2>Thank you for your order, ${modalName}!</h2>
            </div>
          `;
          updateBasket();
          basketContainer.innerHTML = successMessage;
          modal.style.display = "none";
          modalVisible = false;
        } else {
          console.log("Form is invalid");
        }
      });
    }
  });
  
      function createErrorMessage(message) {
        const errorMessage = document.createElement("span");
        errorMessage.classList.add("error-message");
        errorMessage.textContent = message;
        return errorMessage;
      }
  
      function displayErrorMessage(errorMessage, field) {
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
      
        // Remove existing error messages
        const existingErrorMessages = field.parentElement.querySelectorAll(".tooltip");
        existingErrorMessages.forEach((message) => {
          message.remove();
        });
      
        // Create a speech bubble element
        const speechBubble = document.createElement("div");
        speechBubble.classList.add("speech-bubble");
        speechBubble.appendChild(errorMessage);
      
        tooltip.appendChild(speechBubble);
      
        const parent = field.parentElement;
        parent.insertBefore(tooltip, field.nextElementSibling);
      
        field.classList.add("invalid");
      }
    }
 
    
