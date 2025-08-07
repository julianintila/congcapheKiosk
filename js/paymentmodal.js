// Function to format the date and time
function getFormattedDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const time = now.toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return { date, time };
}

// Function to safely format currency numbers
function formatCurrency(value) {
    // Ensure the value is a number or convert it to 0
    const numValue = typeof value === 'number' ? value : 0;
    return `₱${numValue.toFixed(2)}`;
}

// Function to get order details from localStorage
function getOrderDetails() {
    console.log("Fetching order details from localStorage");
    const orderData = localStorage.getItem('currentOrder');
    console.log("Raw localStorage data:", orderData);
    
    if (!orderData) {
        console.log("No order data found in localStorage");
        return {
            items: [],
            total: 0.00
        };
    }
    
    try {
        // Parse the order data
        const parsedData = JSON.parse(orderData);
        console.log("Parsed order data:", parsedData);
        
        // If the structure is different than expected, try to adapt
        let items = [];
        let total = 0.00;
        
        // Handle different possible structures
        if (Array.isArray(parsedData)) {
            // If it's an array, assume it's directly an array of items
            items = parsedData;
            // Calculate total from items
            total = items.reduce((sum, item) => {
                const price = typeof item.price === 'number' ? item.price : 
                             (typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : 0);
                const quantity = typeof item.quantity === 'number' ? item.quantity : 
                             (typeof item.quantity === 'string' ? parseInt(item.quantity) : 1);
                return sum + (price * quantity);
            }, 0);
        } else if (typeof parsedData === 'object') {
            // If it's an object, check for items property
            if (Array.isArray(parsedData.items)) {
                items = parsedData.items;
            } else if (parsedData.cart && Array.isArray(parsedData.cart)) {
                items = parsedData.cart;
            } else {
                // Try to convert object properties to items if no items array
                items = Object.keys(parsedData)
                    .filter(key => typeof parsedData[key] === 'object')
                    .map(key => parsedData[key]);
            }
            
            // Check for total property or calculate it
            if (typeof parsedData.total === 'number') {
                total = parsedData.total;
            } else if (typeof parsedData.total === 'string') {
                total = parseFloat(parsedData.total.replace(/[^0-9.-]+/g, ''));
            } else if (typeof parsedData.totalAmount === 'number') {
                total = parsedData.totalAmount;
            } else if (typeof parsedData.totalAmount === 'string') {
                total = parseFloat(parsedData.totalAmount.replace(/[^0-9.-]+/g, ''));
            } else {
                // Calculate total from items if not provided
                total = items.reduce((sum, item) => {
                    const price = typeof item.price === 'number' ? item.price : 
                                 (typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : 0);
                    const quantity = typeof item.quantity === 'number' ? item.quantity : 
                                 (typeof item.quantity === 'string' ? parseInt(item.quantity) : 1);
                    return sum + (price * quantity);
                }, 0);
            }
        }
        
        console.log("Processed items:", items);
        console.log("Calculated total:", total);
        
        return {
            items: items,
            total: isNaN(total) ? 0.00 : total
        };
    } catch (e) {
        console.error('Error parsing order data:', e);
        return {
            items: [],
            total: 0.00
        };
    }
}

// Modified function to print receipt directly without popup window
function printReceipt(orderNumber) {
    // Show printing modal
    let printingModal = document.createElement('div');
    printingModal.style.position = 'fixed';
    printingModal.style.top = '0';
    printingModal.style.left = '0';
    printingModal.style.width = '100%';
    printingModal.style.height = '100vh';
    printingModal.style.background = 'rgba(0, 0, 0, 0.8)';
    printingModal.style.zIndex = '10001';
    printingModal.style.display = 'flex';
    printingModal.style.alignItems = 'center';
    printingModal.style.justifyContent = 'center';
    printingModal.style.fontFamily = "'Montserrat', sans-serif";
    
    printingModal.innerHTML = `
        <div style="background: white; padding: 30px 50px; border-radius: 20px; text-align: center;">
            <div style="margin-bottom: 20px; font-size: 30px;">🖨️</div>
            <h3 style="margin: 0; font-size: 24px; color: #333; margin-bottom: 10px;">Printing Receipt...</h3>
            <p style="margin: 0; color: #666; font-size: 16px;">Please wait a moment...</p>
        </div>
    `;
    
    document.body.appendChild(printingModal);
    
    // Get order details with safety checks
    const orderDetails = getOrderDetails();
    const { date, time } = getFormattedDateTime();
    
    // Use a slight delay to allow the modal to show
    setTimeout(() => {
        try {
            // Create a hidden iframe for printing
            const printFrame = document.createElement('iframe');
            printFrame.style.position = 'fixed';
            printFrame.style.right = '0';
            printFrame.style.bottom = '0';
            printFrame.style.width = '0';
            printFrame.style.height = '0';
            printFrame.style.border = '0';
            document.body.appendChild(printFrame);
            
            // Set the content for the print frame
            const frameDoc = printFrame.contentWindow.document;
            frameDoc.open();
            frameDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Receipt #${orderNumber}</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        @media print {
                            @page {
                                size: 80mm auto;  /* Receipt paper size */
                                margin: 0mm;      /* No margins */
                            }
                            
                            body {
                                width: 80mm;      /* Thermal receipt width */
                            font-family: "Times New Roman", Times, serif;
                            font-weight:bold;
                                font-size: 12px;
                                line-height: 1.2;
                                margin: 0;
                                padding: 10px 5px;
                                -webkit-print-color-adjust: exact;
                                color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            
                            .receipt {
                                width: 100%;
                            }
                            
                            .header, .footer {
                                text-align: center;
                                margin-bottom: 5px;
                            }
                            
                            .divider {
                                border-top: 1px dashed #000;
                                margin: 5px 0;
                            }
                            
                            .item-row {
                                display: flex;
                                justify-content: space-between;
                                margin: 3px 0;
                                font-weight:bold;
                            }
                            
                            .item-name {
                                flex: 1;
                                text-align: left;
                                font-weight:bold;
                                font-size: 12px;
                            }
                            
                            .item-qty {
                                width: 30px;
                                text-align: right;
                                padding-right: 10px;
                                font-size: 12px;
                            }
                            
                            .item-price {
                                width: 70px;
                                text-align: right;
                                font-size: 12px;
                            }
                            
                            .total-row {
                                display: flex;
                                justify-content: space-between;
                                margin-top: 5px;
                                font-size: 12px;
                            }
                            
                            .total-label {
                                text-align: right;
                                font-size: 12px;
                            }
                            
                            .total-value {
                                width: 70px;
                                text-align: right;
                                font-weight: bold;
                                font-size: 12px;
                            }

                            h1, h2, h3, p {
                                color: #000 !important;
                                font-size: 12px;
                            }

                            h1 {
                                font-size: 16px;
                            }

                            h2 {
                                font-size: 14px;
                            }
                        }
                        
                        /* Styles for testing/debugging */
                        body {
                           font-family: "Times New Roman", Times, serif;
                            font-size: 12px;
                            line-height: 1.2;
                            margin: 0;
                            padding: 10px;
                            width: 80mm;
                        }
                        
                        .receipt {
                            width: 100%;
                            background: white;
                            padding: 10px;
                        }
                        
                        .header, .footer {
                            text-align: center;
                            margin-bottom: 5px;
                        }
                        
                        .divider {
                            border-top: 1px dashed #000;
                            margin: 5px 0;
                        }
                        
                        .item-row {
                            display: flex;
                            justify-content: space-between;
                            margin: 3px 0;
                        }
                        
                        .item-name {
                            flex: 1;
                            text-align: left;
                            font-weight: normal;
                            font-size: 12px;
                        }
                        
                        .item-qty {
                            width: 30px;
                            text-align: right;
                            padding-right: 10px;
                            font-size: 12px;
                        }
                        
                        .item-price {
                            width: 70px;
                            text-align: right;
                            font-size: 12px;
                        }
                        
                        .total-row {
                            display: flex;
                            justify-content: space-between;
                            margin-top: 5px;
                        }
                        
                        .total-label {
                            text-align: right;
                            font-size: 12px;
                        }
                        
                        .total-value {
                            width: 70px;
                            text-align: right;
                            font-weight: bold;
                            font-size: 12px;
                        }

                        h1 {
                            font-size: 16px;
                            margin: 0;
                        }

                        h2 {
                            font-size: 14px;
                            margin: 0;
                        }

                        p {
                            margin: 2px 0;
                            font-size: 14px;
                            font-weight:bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                 
                        <div class="header">
                            <h1 style="font-size:20px;">Order #: ${orderNumber}</h1>
                            <h2>RESTAURANT NAME</h2>
                            <p>123 Main Street, City, Country</p>
                            <p>Tel: +123-456-7890</p>
                            <p>Date: ${date} ${time}</p>
                        </div>
                        
                        <div class="divider"></div>
                        
                        <div class="items">
                            <div class="item-row" style="font-weight: bold;">
                                <div class="item-name">ITEM</div>
                                <div class="item-qty">QTY</div>
                                <div class="item-price">PRICE</div>
                            </div>
                            <div class="divider"></div>
            `);
            
            // Add items to the receipt
            if (orderDetails.items && orderDetails.items.length > 0) {
                orderDetails.items.forEach(item => {
                    // Safety checks for each property
                    const name = item.name || 'Unknown Item';
                    const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
                    const price = typeof item.price === 'number' ? item.price : 0;
                    const itemTotal = price * quantity;
                    
                    frameDoc.write(`
                        <div class="item-row">
                            <div class="item-name">${name}</div>
                            <div class="item-qty">${quantity}</div>
                            <div class="item-price">${formatCurrency(itemTotal)}</div>
                        </div>
                    `);
                });
            }
            
            // Calculate totals
            const subtotal = orderDetails.total || 0;
            const vat = subtotal * 0.12;
            
            // Add footer with totals
            frameDoc.write(`
                        </div>
                        
                        <div class="divider"></div>
                        
                        <div class="totals">
                            <div class="total-row">
                                <div class="total-label">SUBTOTAL:</div>
                                <div class="total-value">${formatCurrency(subtotal)}</div>
                            </div>
                            <div class="total-row">
                                <div class="total-label">VAT (12%):</div>
                                <div class="total-value">${formatCurrency(vat)}</div>
                            </div>
                            <div class="total-row" style="font-weight: bold;">
                                <div class="total-label">TOTAL:</div>
                                <div class="total-value">${formatCurrency(subtotal)}</div>
                            </div>
                        </div>
                        
                        <div class="divider"></div>
                        
                        <div class="footer">
                            <p>Thank you for your order!</p>
                            <p>Please come again</p>
                        </div>
                    </div>
                    
                    <script>
                        // Auto print immediately and close without user interaction
                        window.onload = function() {
                            // Trigger print automatically
                            window.print();
                            
                            // Close the iframe after printing
                            setTimeout(function() {
                                try {
                                    window.frameElement.parentNode.removeChild(window.frameElement);
                                } catch(e) {
                                    console.log("Frame removal error:", e);
                                }
                            }, 1000);
                        };
                    </script>
                </body>
                </html>
            `);
            
            // Close the document writing
            frameDoc.close();
            
            // Remove the printing modal
            setTimeout(() => {
                try {
                    document.body.removeChild(printingModal);
                } catch(e) {
                    console.error("Error removing print modal:", e);
                }
                
                // Show success message
                let successModal = document.createElement('div');
                successModal.style.position = 'fixed';
                successModal.style.top = '20px';
                successModal.style.right = '20px';
                successModal.style.background = '#4CAF50';
                successModal.style.color = 'white';
                successModal.style.padding = '15px 20px';
                successModal.style.borderRadius = '8px';
                successModal.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                successModal.style.zIndex = '10002';
                successModal.style.fontFamily = "'Montserrat', sans-serif";
                
                successModal.innerHTML = `
                    <div style="display: flex; align-items: center;">
                        <span style="font-size: 18px; margin-right: 10px;">✓</span>
                        <span style="font-size: 16px;">Receipt sent to printer!</span>
                    </div>
                `;
                
                document.body.appendChild(successModal);
                
            
                setTimeout(() => {
                    try {
                        document.body.removeChild(successModal);
                    } catch(e) {
                        console.error("Error removing success modal:", e);
                    }
                }, 3000);
            }, 2000);
            
        } catch (error) {
            console.error('Print Error:', error);
            
            // Remove printing modal
            try {
                document.body.removeChild(printingModal);
            } catch(e) {
                console.error("Error removing print modal after error:", e);
            }
            
            // Show error message
            let errorModal = document.createElement('div');
            errorModal.style.position = 'fixed';
            errorModal.style.top = '20px';
            errorModal.style.right = '20px';
            errorModal.style.background = '#F44336';
            errorModal.style.color = 'white';
            errorModal.style.padding = '15px 20px';
            errorModal.style.borderRadius = '8px';
            errorModal.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            errorModal.style.zIndex = '10002';
            errorModal.style.fontFamily = "'Montserrat', sans-serif";
            
            errorModal.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span style="font-size: 18px; margin-right: 10px;">✗</span>
                    <span style="font-size: 16px;">Error printing receipt: ${error.message}</span>
                </div>
            `;
            
            document.body.appendChild(errorModal);
            
            // Remove error message after 5 seconds
            setTimeout(() => {
                try {
                    document.body.removeChild(errorModal);
                } catch(e) {
                    console.error("Error removing error modal:", e);
                }
            }, 5000);
        }
    }, 300);
}

// Modified function to show order confirmation
function showOrderConfirmation() {
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    let confirmationModal = document.createElement('div');
    confirmationModal.style.position = 'fixed';
    confirmationModal.style.top = '0';
    confirmationModal.style.left = '0';
    confirmationModal.style.width = '100%';
    confirmationModal.style.height = '100vh';
    confirmationModal.style.background = 'rgba(0, 0, 0, 0.8)';
    confirmationModal.style.zIndex = '10000';
    confirmationModal.style.display = 'flex';
    confirmationModal.style.alignItems = 'center';
    confirmationModal.style.justifyContent = 'center';
    confirmationModal.style.fontFamily = "'Montserrat', sans-serif";
    
    confirmationModal.innerHTML = `
        <div style="background: white; width: 90%; max-width: 800px; border-radius: 24px; padding: 40px; text-align: center; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);">
            <div style="width: 100px; height: 100px; background: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px;">
                <span style="color: white; font-size: 50px;">✓</span>
            </div>
            <h2 style="margin: 0 0 15px; font-size: 36px; color: #333;">Order Confirmed!</h2>
            <p style="margin: 0 0 30px; font-size: 20px; color: #666; max-width: 600px; margin-left: auto; margin-right: auto;">Your order has been successfully placed. You will receive a confirmation shortly.</p>
            <p style="margin: 0 0 40px; font-size: 24px; font-weight: 600; color: #333;">Order #${orderNumber}</p>
            <button style="background: #2e7d32; color: white; padding: 18px 40px; font-size: 20px; font-weight: 600; border: none; border-radius: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);" onclick="finishOrder()">DONE</button>
        </div>
    `;
    
    document.body.appendChild(confirmationModal);
    
    // Store order number for receipt printing
    localStorage.setItem('lastOrderNumber', orderNumber);
    
    // Automatically print receipt
    printReceipt(orderNumber);
}

function finishOrder() {
    localStorage.removeItem('currentOrder');
    
    // Close any open modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Remove any confirmation modals
    const confirmations = document.body.querySelectorAll('div[style*="z-index: 10000"]');
    confirmations.forEach(modal => {
        try {
            document.body.removeChild(modal);
        } catch(e) {
            console.error("Error removing confirmation modal:", e);
        }
    });
    
    // Reset cart indicators
    const quantityElement = document.querySelector('.view-cart-btn span');
    const priceElement = document.querySelector('.cart-price');
    
    if (quantityElement) {
        quantityElement.textContent = "0";
    }
    
    if (priceElement) {
        priceElement.textContent = "₱0.00";
    }
    
    // Redirect to home page
    window.location.href = 'index.php';
}

// Functions for the payment modal
function openPaymentModal() {
    document.getElementById('paymentOptionsModal').style.display = 'flex';
}

function closePaymentModal() {
    document.getElementById('paymentOptionsModal').style.display = 'none';
}

function processPayment(method) {
    closePaymentModal();
    
    let processingModal = document.createElement('div');
    processingModal.style.position = 'fixed';
    processingModal.style.top = '0';
    processingModal.style.left = '0';
    processingModal.style.width = '100%';
    processingModal.style.height = '100vh';
    processingModal.style.background = 'rgba(0, 0, 0, 0.8)';
    processingModal.style.zIndex = '10000';
    processingModal.style.display = 'flex';
    processingModal.style.alignItems = 'center';
    processingModal.style.justifyContent = 'center';
    processingModal.style.fontFamily = "'Montserrat', sans-serif";
    
    let content = '';
    
    switch(method) {
        case 'debit-credit':
            content = 'Processing card payment...';
            break;
        case 'gcash':
            content = 'Connecting to GCash...';
            break;
        case 'counter':
            content = 'Confirming counter payment...';
            break;
        default:
            content = 'Processing payment...';
    }
    
    processingModal.innerHTML = `
        <div style="background: white; padding: 30px 50px; border-radius: 20px; text-align: center;">
            <div style="margin-bottom: 20px; font-size: 30px;">⏳</div>
            <h3 style="margin: 0; font-size: 24px; color: #333; margin-bottom: 10px;">${content}</h3>
            <p style="margin: 0; color: #666; font-size: 16px;">Please wait a moment...</p>
        </div>
    `;
    
    document.body.appendChild(processingModal);
    
    setTimeout(() => {
        try {
            document.body.removeChild(processingModal);
        } catch(e) {
            console.error("Error removing processing modal:", e);
        }
        showOrderConfirmation();
    }, 2000);
}

function closeOrderModal() {
    // This function depends on your specific implementation
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        orderModal.style.display = 'none';
    }
}

function proceedToPayment() {
    closeOrderModal();
    openPaymentModal();
}