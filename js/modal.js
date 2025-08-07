function addToOrder(name, price, event) {
    let modal = document.createElement('div');
    modal.classList.add('modal');
    
   
    let imageSrc = '';
    
    if (event && event.currentTarget) {
        const menuItem = event.currentTarget;
        const img = menuItem.querySelector('img');
        if (img && img.src) {
            imageSrc = img.src;
        }
    }
    
    // Modal content
    modal.innerHTML = `
  <div class="modal-content" style="width: 80%; max-width: 1200px; height: 80vh; display: flex; flex-direction: column; position: relative; padding: 20px; background-image: url('images/background/back.png'); background-size: cover; background-position: center; border-radius: 15px;">
  
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;  border-radius: 15px;"></div>
    
   
    <h2 style="text-align: center;color:#4c5b29; margin-bottom: 20px; position: relative; z-index: 2;">YOU'VE SELECTED:</h2>
    
    <!--main content e2 -->
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; margin-bottom: 80px; position: relative; z-index: 2;">
      <div class="added-item" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <img src="${imageSrc}" alt="${name}" class="modal-image" style="width: 600px; height:100%; object-fit: contain;">
        <p style="font-size: 25px; text-align: center; margin-top: 15px;">${name} <br> <strong>₱${price.toFixed(2)}</strong></p>
      </div>

      <!-- "+ -" selector -->
      <div class="quantity-selector" style="display: flex; align-items: center; justify-content: center; margin: 20px 0;">
        <button class="decrease-qty" style="width: 60px; height: 60px; font-size: 28px; border-radius: 10px; background: #502314; color: white; border: none; cursor: pointer;">-</button>
        <input type="text" value="1" id="quantity" style="width: 60px; height: 60px; text-align: center;background:transparent; font-size: 28px; margin: 0 15px; border: 1px solid #4c5b29; border-radius: 5px;">
        <button class="increase-qty" style="width: 60px; height: 60px; font-size: 28px; border-radius: 10px; background: #4c5b29; color: white; border: none; cursor: pointer;">+</button>
      </div>
    </div>
    
    <!-- button sa bottom -->
    <div class="bottom-actions" style="display: flex; gap: 20px; width: 100%; position: absolute; bottom: 20px; left: 0; right: 0; padding: 0 40px; z-index: 2;">
      <button class="cancel-order btn secondary" style="width: 45%; font-size: 24px; padding: 18px; border-radius: 10px; cursor: pointer; background: #502314; color: white; border: none;">Cancel</button>
      <button class="add-to-order btn success" style="width: 45%; font-size: 24px; padding: 18px; border-radius: 10px; cursor: pointer; background: #4c5b29; color: white; border: none;">Add to Order</button>
    </div>
  </div>
`;
    
    document.body.appendChild(modal);
    
    const quantityInput = modal.querySelector("#quantity");
    modal.querySelector(".decrease-qty").addEventListener("click", function() {
        let qty = parseInt(quantityInput.value);
        if (qty > 1) {
            quantityInput.value = qty - 1;
        }
    });
    modal.querySelector(".increase-qty").addEventListener("click", function() {
        let qty = parseInt(quantityInput.value);
        quantityInput.value = qty + 1;
    });
    
    modal.querySelector('.add-to-order').addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        
        // Get current order from localStorage jsom only? if may database disregard logic here
        let currentOrder = JSON.parse(localStorage.getItem('currentOrder') || '[]');
        
     
        const existingItemIndex = currentOrder.findIndex(item => 
            item.name === name && item.price === price);
            
        if (existingItemIndex !== -1) {
            // Update existing item quantity and total price
            currentOrder[existingItemIndex].quantity += quantity;
            currentOrder[existingItemIndex].totalPrice = 
                currentOrder[existingItemIndex].price * currentOrder[existingItemIndex].quantity;
        } else {
      
            currentOrder.push({
                name: name,
                price: price,
                quantity: quantity,
                imageSrc: imageSrc,
                totalPrice: price * quantity
            });
        }
        

        localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
        
    
        let totalQuantity = 0;
        let totalPrice = 0;
        currentOrder.forEach(item => {
            totalQuantity += item.quantity;
            totalPrice += item.totalPrice;
        });
        
        const quantityElement = document.querySelector('.view-cart-btn span');
        const priceElement = document.querySelector('.cart-price');
        
        if (quantityElement) {
            quantityElement.textContent = totalQuantity;
        }
        
        if (priceElement) {
            priceElement.textContent = `₱${totalPrice.toFixed(2)}`;
        }
        
        modal.remove();
        
        let successModal = document.createElement('div');
        successModal.classList.add('modal', 'success-modal');
        
        successModal.innerHTML = `
            <div class="modal-content success-content" style="width: 60%; max-width: 500px; padding: 30px; text-align: center; background-color: white; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                <div class="success-icon" style="color: #4CAF50; font-size: 60px; margin-bottom: 20px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <h2 style="color: #333; margin-bottom: 10px;">Added to Order!</h2>
                <p style="font-size: 18px; color: #666; margin-bottom: 20px;">
                    ${quantity} × ${name} has been added to your order
                </p>
               
            </div>
        `;
        //timer of modal //scucess 1
        document.body.appendChild(successModal);
        
        const autoHideTimeout = setTimeout(() => {
            successModal.remove();
        }, 1000);
                                          
        successModal.querySelector('.continue-shopping').addEventListener('click', function() {
            clearTimeout(autoHideTimeout);
            successModal.remove();
        });
    });
    
    modal.querySelector('.cancel-order').addEventListener('click', function() {
        modal.remove();
    });
}

// Function to show the order review modal

function showOrderModal() {
    const orderSummaryModal = document.getElementById('orderSummaryModal');
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder') || '[]');
    
    if (currentOrder.length === 0) {
        alert('Your order is empty');
        return;
    }
    
    const orderItemsContainer = orderSummaryModal.querySelector('.modal-content > div:nth-child(2) > div');
    
    orderItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    currentOrder.forEach((item, index) => {
        subtotal += item.totalPrice;
        
        const orderItemDiv = document.createElement('div');
orderItemDiv.className = 'order-item';

orderItemDiv.innerHTML = `
    <div class="order-item-image">
        <img src="${item.imageSrc || 'images/placeholder.png'}" alt="${item.name}" class="item-image" />
        <button class="remove-item-btn">×</button>
    </div>
    <div class="order-item-content">
        <h3 class="item-name">${item.name}</h3>
        <div class="price-per-item">₱${item.price.toFixed(2)} each</div>
    </div>
    <div class="order-item-controls">
        <div class="quantity-control">
            <button class="quantity-btn minus" data-index="${index}">
                <span class="minus-symbol">−</span>
            </button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn plus" data-index="${index}">
                <span class="plus-symbol">+</span>
            </button>
        </div>
        <p class="item-total">₱${item.totalPrice.toFixed(2)}</p>
    </div>
`;
        
        orderItemsContainer.appendChild(orderItemDiv);
        
        // Add event listeners for quantity buttons
        const minusBtn = orderItemDiv.querySelector('.quantity-btn.minus');
        const plusBtn = orderItemDiv.querySelector('.quantity-btn.plus');
        const removeBtn = orderItemDiv.querySelector('.remove-item-btn');
        
        minusBtn.addEventListener('click', function() {
            updateItemQuantity(index, -1);
        });
        
        plusBtn.addEventListener('click', function() {
            updateItemQuantity(index, 1);
        });
        
        removeBtn.addEventListener('click', function() {
            removeOrderItem(index);
        });
    });
    
    // Calculate service charge and VAT
    const serviceCharge = subtotal * 0.10;
    const vat = subtotal * 0.12;
    const total = subtotal + serviceCharge + vat;
    
    // Update totals in the UI
    const summarySection = orderSummaryModal.querySelector('.modal-content > div:last-child');
    
    // Update subtotal, service charge, VAT
    const amountFields = summarySection.querySelectorAll('div:first-child + div p');
    amountFields[0].textContent = `₱${subtotal.toFixed(2)}`;
    amountFields[1].textContent = `₱${serviceCharge.toFixed(2)}`;
    amountFields[2].textContent = `₱${vat.toFixed(2)}`;
    
    const totalAmount = summarySection.querySelector('h3 + h3');
    totalAmount.textContent = `₱${total.toFixed(2)}`;

    orderSummaryModal.style.display = 'flex';
}

function updateItemQuantity(index, change) {
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder') || '[]');
    
    if (currentOrder[index]) {
        if (change < 0 && currentOrder[index].quantity <= 1) {
            // If reducing and quantity is 1, remove the item
            removeOrderItem(index);
            return;
        }
        
        // Update quantity
        currentOrder[index].quantity += change;
        
        // Update total price for this item
        currentOrder[index].totalPrice = currentOrder[index].price * currentOrder[index].quantity;
        
        // Save updated order
        localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
        
        // Update UI
        updateOrderFooter();
        
        // Refresh the modal to show updated values
        showOrderModal();
    }
}

function removeOrderItem(index) {
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder') || '[]');
    
    if (index >= 0 && index < currentOrder.length) {
        // Remove the item
        currentOrder.splice(index, 1);
        
        // Save updated order
        localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
        
        // Update UI
        updateOrderFooter();
        
        // If order is now empty, close modal
        if (currentOrder.length === 0) {
            closeOrderModal();
            return;
        }
        
        // Refresh the modal to show updated values
        showOrderModal();
    }
}

function closeOrderModal() {
    const orderSummaryModal = document.getElementById('orderSummaryModal');
    orderSummaryModal.style.display = 'none';
}

function updateOrderFooter() {
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder') || '[]');
    let totalQuantity = 0;
    let totalPrice = 0;
    
    currentOrder.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.totalPrice;
    });
    
    const quantityElement = document.querySelector('.view-cart-btn span');
    const priceElement = document.querySelector('.cart-price');
    
    if (quantityElement) {
        quantityElement.textContent = totalQuantity;
    }
    
    if (priceElement) {
        priceElement.textContent = `₱${totalPrice.toFixed(2)}`;
    }
}



document.addEventListener('DOMContentLoaded', function() {

    updateOrderFooter();
    
    const viewCartBtn = document.querySelector('.view-cart-btn');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', showOrderModal);
    }
    
    const orderMoreBtn = document.querySelector('#orderSummaryModal button:nth-last-child(2)');
    if (orderMoreBtn) {
        orderMoreBtn.addEventListener('click', closeOrderModal);
    }
    
   
});


document.addEventListener('DOMContentLoaded', function() {
   
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder') || '[]');
    let totalQuantity = 0;
    let totalPrice = 0;
    
    currentOrder.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.totalPrice;
    });
    
    const quantityElement = document.querySelector('.view-cart-btn span');
    const priceElement = document.querySelector('.cart-price');
    
    if (quantityElement) {
        quantityElement.textContent = totalQuantity;
    }
    
    if (priceElement) {
        priceElement.textContent = `₱${totalPrice.toFixed(2)}`;
    }
});