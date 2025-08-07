function addToOrder(name, price) {
    // Create the modal container
    let modal = document.createElement('div');
    modal.classList.add('modal');
    
    // Modal content
    modal.innerHTML = `
        <div class="modal-content" style="width: 80%; max-width: 1200px; height: 80vh; position: relative;">
            <h2>YOU'VE SELECTED:</h2>
            <div class="added-item" style="display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 300px; margin: 0 auto;">
                <img src="images/menus/11.png" alt="${name}" class="modal-image" style="width: 300px; height: 300px; ">
                <p style="font-size: 16px; text-align: center;">${name} <br> <strong>₱${price.toFixed(2)}</strong></p>
            </div>
            
            <!-- Quantity Selector -->
            <div class="quantity-selector" style="display: flex; align-items: center; justify-content: center; margin: 20px 0;">
                <button class="decrease-qty" style="width: 50px; height: 50px; font-size: 24px; border-radius: 10px; background: gray; color: white; border: none;">-</button>
                <input type="text" value="1" id="quantity" style="width: 50px; height: 50px; text-align: center; font-size: 24px; margin: 0 10px; border: none;">
                <button class="increase-qty" style="width: 50px; height: 50px; font-size: 24px; border-radius: 10px; background: gray; color: white; border: none;">+</button>
            </div>
            
            <div class="bottom-actions" style="display: flex; justify-content: space-between; gap: 20px; position: absolute; bottom: 20px; left: 0; right: 0; padding: 20px;">
                <button class="cancel-order btn secondary" style="width: 45%; font-size: 22px; padding: 20px; border-radius: 10px;">Cancel</button>
                <button class="add-to-order btn success" style="width: 45%; font-size: 22px; padding: 20px; border-radius: 10px;">Add to Order</button>
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
        alert("Item added to order");
        modal.remove();
    });
    modal.querySelector('.cancel-order').addEventListener('click', function() {
        modal.remove();
    });
}

//arrow on mobile//

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const leftArrow = document.querySelector('.sidebar-arrow-left');
    const rightArrow = document.querySelector('.sidebar-arrow-right');
    
    // Amount to scroll on each arrow click (in pixels)
    const scrollAmount = 200;
    
    // Scroll left when left arrow is clicked
    leftArrow.addEventListener('click', function() {
        sidebar.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Scroll right when right arrow is clicked
    rightArrow.addEventListener('click', function() {
        sidebar.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
});