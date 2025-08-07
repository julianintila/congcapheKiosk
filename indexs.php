<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Kiosk Menu</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <style>
        .category-item {
            cursor: pointer;
            padding: 10px;
            transition: background-color 0.3s;
        }
        .category-item:hover {
            background-color: #502314;
        }
        .category-item.active {
            background-color: #502314;
            color: #f5ebdc;
        }
    </style>
     <link rel="stylesheet" href="css/orderSummary.css">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Raleway:ital,wght@0,100..900;1,100..900&family=Rammetto+One&display=swap" rel="stylesheet">
    <script src="js/modal.js" defer></script>
    <script src="js/behaviors.js"></script>
<script src="js/paymentmodal.js"></script>
<script src="js/sampledata.js"></script>
<script src="js/script.js"></script>
<script src="https://cdn.jsdelivr.net/npm/qz-tray/qz-tray.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qz-tray/2.2.0/qz-tray.min.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/8.0.20/jsrsasign-all-min.js"></script>

</head>
<body>

    <!-- order here modal -->
    <div id="orderTypeModal" class="modal" style="align-items: center; justify-content: center; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-image: url('images/background/exo.png'); background-size: cover; background-position: center; z-index: 9999; display: flex; flex-direction: column;">
    <img src="images/logos/conglogo.png" alt="Logo" class="logo">
    
    <h1 class="modal-title">Where would you like to enjoy your coffee?"</h1>
    
    <div class="buttons-container">
        <button class="order-type-btn" onclick="selectOrderType('dine-in')">
            <img src="images/icons/DINE.png" alt="Dine In" class="dinein-gif">
            DINE IN
        </button>
        
        <button class="order-type-btn" onclick="selectOrderType('take-out')">
            <img src="images/icons/out.png" alt="Take Out" class="dinein-gif">
            TAKE OUT
        </button>
    </div>
</div>





    <div class="header">
  
    </div>
    <div class="container">
        <div class="sidebar-container">
            <button class="sidebar-arrow sidebar-arrow-left"><</button>
            <div class="sidebar">
                <ul>
                    <li class="category-item" data-category="all" onclick="filterItems('all')">
                        <img src="images/menucategory/cong.png" class="sidebar-icon"> Home
                    </li>
                    <?php
                    require_once 'connection.php';
                    $query = "SELECT TOP 1000 [ID], [Name], [OrderNo] FROM [dbo].[Category] WHERE [Inactive] = 0 ORDER BY [OrderNo]";
                    $stmt = sqlsrv_query($conn, $query);

                    function getCategoryIcon($categoryName) {
                        $iconMap = [
                            'Chicken' => 'ch.png',
                            'Pasta and Salads' => 'pasra.png',
                            'Burgers' => 'burger.png',
                            'Drinks' => 'drinks.png',
                            'Pizza' => 'p2.png',
                            'Desserts' => '5.png',
                            'Appetizers' => 'potato.png',
                            'Tornado Omelette Curry Sets' => '7.png',
                            'Katsu Curry Sets' => '9.png',
                        ];
                        
                        return isset($iconMap[$categoryName]) ? 
                               "images/menus/" . $iconMap[$categoryName] : 
                               "images/menucategory/cong.png";
                    }

                    if ($stmt) {
                        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                            $iconPath = getCategoryIcon($row['Name']);
                            echo '<li class="category-item" data-category="' . $row['ID'] . '" onclick="filterItems(' . $row['ID'] . ')">';
                            echo '<img src="' . htmlspecialchars($iconPath) . '" class="sidebar-icon"> ' . 
                                 htmlspecialchars($row['Name']) . '</li>';
                        }
                    } else {
                        echo '<li>Error loading categories</li>';
                    }
                    ?>
                </ul>
            </div>
            <button class="sidebar-arrow sidebar-arrow-right">></button>
        </div>
        
        <div class="menu-content">
            <div class="menu-grid">
                <?php
                $query = "SELECT [ID], [Description], [Price], [PictureName], [CategoryID] 
                         FROM [dbo].[Item] 
                         WHERE [Inactive] = 0 
                         ORDER BY [OrderNo]";
                $stmt = sqlsrv_query($conn, $query);

                if ($stmt) {
                    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                        $itemName = htmlspecialchars($row['Description']);
                        $price = number_format($row['Price'], 2);
                        $image = !empty($row['PictureName']) ? "images/menus/" . $row['PictureName'] : "images/menucategory/cong.png";
                        $categoryId = $row['CategoryID'];
                        
                        echo '<div class="menu-item" data-category="' . $categoryId . '" onclick="addToOrder(\'' . $itemName . '\', ' . $price . ', event)">';
                        echo '    <img src="' . htmlspecialchars($image) . '" alt="' . $itemName . '" class="menu-image">';
                        echo '    <h3>' . $itemName . '</h3>';
                        echo '    <p>₱' . $price . '</p>';
                        echo '</div>';
                    }
                } else {
                    echo '<div class="error-message">Error loading menu items</div>';
                }
                ?>
                
                <script>
                function filterItems(categoryId) {
                    const menuItems = document.querySelectorAll('.menu-item');
                    const categoryItems = document.querySelectorAll('.category-item');
                    
                    // Remove active class from all category items
                    categoryItems.forEach(item => item.classList.remove('active'));
                    // Add active class to clicked category
                    document.querySelector(`[data-category="${categoryId}"]`).classList.add('active');
                    
                    menuItems.forEach(item => {
                        if (categoryId === 'all' || item.dataset.category === categoryId.toString()) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                }

                // Show all items by default
                filterItems('all');
                </script>
                
                
				
            </div>
        </div>
        
    </div>
  
   <div class="footer">
        <div class="footer-container" style="display: flex; justify-content: space-between; align-items: center;">
            <button class="footer-btn return-btn" onclick="finishOrder()" style="background: #4c5b29; color: #f5ebdc; padding: 12px 22px; font-size: 20px; font-weight: bold; border: none; cursor: pointer; border-radius: 8px;">CANCEL ORDER</button>
            <div class="cart-info" style="display: flex; align-items: center; gap: 15px;">
            <button class="footer-btn view-cart-btn" onclick="showOrderModal()" style="background: #4c5b29; color: #f5ebdc; padding: 10px 20px; font-size: 20px; border: none;height:50px; cursor: pointer; border-radius: 8px;">CHECK OUT (<span>0</span>)</button>
            <span class="cart-price">₱0.00</span>
            </div>
        </div>
    </div>

    <!-- Order Summary Modal -->
 
    <div id="orderSummaryModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0, 0, 0, 0.8); z-index: 9999; align-items: center; justify-content: center; font-family: 'Montserrat', sans-serif; overflow-y: auto;">
    <div class="modal-content" style="background: url(images/background/back.png); width: 100%; height: 100%; max-width: 1200px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); overflow: hidden; display: flex; flex-direction: column; max-height: 100vh;">
        <div style="padding: 30px 40px 20px; border-bottom: 1px solid #eee; position: relative;">
            <h2 style="margin: 0; font-size: 32px; font-weight: 700; color: #4c5b29; text-align: center;">Your Order Summary</h2>
        </div>
        
        <div class="orderbox" style="padding: 30px 40px; overflow: auto; overflow:auto; ">
            <div id="orderItemsContainer" style="display: flex; flex-direction: column;">
              
            </div>
        </div>
        
        <div  class="checkout-container" style="background: #502314; padding: 30px 40px; border-top: 1px solid #eee; border-radius:20px;">
            <div class="price-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <div class="price-labels">
                    <p style="margin: 0 0 5px; font-size: 16px; color: #f1ebd4; font-weight:bold;">Subtotal</p>
                       <p style="margin: 0 0 5px; font-size: 16px; color: #f1ebd4; font-weight: bold;">Service Charge (10%)</p>
                    
                    <p style="margin: 0; font-size: 16px; color: #f1ebd4; font-weight: bold;">VAT (12%)</p>
                </div>
                <div  class="price-values" style="text-align: right;">
                    <p id="subtotal" style="margin: 0 0 5px; font-size: 16px; color: #f1ebd4;">₱0.00</p>
                    <p id="serviceCharge" style="margin: 0 0 5px; font-size: 16px; color: #f1ebd4;">₱0.00</p>
                    <p id="vat" style="margin: 0; font-size: 16px; color: #f1ebd4;">₱0.00</p>
                </div>
            </div>
            
            <div class="total-section" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-top: 15px; border-top: 2px dotted #eee;">
                <h3 style="margin: 0; font-size: 24px; font-weight: 700; color: #f1ebd4;">Total</h3>
                <h3 id="total" style="margin: 0; font-size: 28px; font-weight: 700; color: #f1ebd4;">₱0.00</h3>
            </div>
            
            <div  class="button-container" style="display: flex; justify-content: flex-end; gap: 15px;">
                <button class="btn btn-order-more" onclick="closeOrderModal()"    style="background: #502314; color: #f1ebd4; padding: 15px 30px; font-size: 16px; font-weight: 600; border: 2px solid #f1ebd4; cursor: pointer; border-radius: 8px; transition: all 0.2s ease;">ORDER MORE</button>
                <button class="btn btn-payment" onclick="proceedToPayment()" class="payment"  style="background: #4c5b29; color: #f1ebd4; padding: 15px 40px; font-size: 16px; font-weight: 600; border: none; cursor: pointer; border-radius: 8px; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);">PROCEED TO PAYMENT</button>
            </div>
        </div>
    </div>
</div>


<div class="view-cart-btn" style="cursor: pointer;">
    <span>0</span> items in cart
</div>
<div class="cart-price">₱0.00</div>

<script>
   
    function closeOrderModal() {
        document.getElementById('orderSummaryModal').style.display = 'none';
    }
    
   
    function openOrderModal() {
        document.getElementById('orderSummaryModal').style.display = 'flex';
    }
    
    
    function proceedToPayment() {
        alert('Proceeding to payment...');

    }
    
   
    window.onload = function() {
        document.getElementById('orderSummaryModal').style.display = 'none';
    }
</script>


  
    <div id="paymentOptionsModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0, 0, 0, 0.8); z-index: 9999; align-items: center; justify-content: center; font-family: 'Montserrat', sans-serif;">
    <div class="modal-content" style="background: white; width: 90%; max-width: 800px; border-radius: 24px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4); overflow: hidden; text-align: center;">

        <div style="padding: 40px 50px 30px; position: relative; border-bottom: 1px solid #f0f0f0;">
            <h2 style="margin: 0; font-size: 36px; font-weight: 700; color: #333;">Select Payment Method</h2>
            <p style="margin: 15px 0 0; color: #666; font-size: 20px;">Choose how you'd like to pay for your order</p>

        </div>
        
        <!-- Payment Options -->
        <div style="padding: 50px; ">
            <div style="display: flex; flex-direction: column; gap: 24px;">
               
                <button onclick="processPayment('debit-credit')" style="display: flex; align-items: center; width: 100%; height: 100px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; padding: 0 30px; cursor: pointer; transition: all 0.2s ease; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <div style="width: 60px; height: 60px; border-radius: 12px; background: #1a73e8; display: flex; align-items: center; justify-content: center; margin-right: 24px;">
                        <span style="color: white; font-size: 28px;">💳</span>
                    </div>
                    <div style="flex-grow: 1;">
                        <h3 style="margin: 0; font-size: 24px; font-weight: 600; color: #333;">Credit / Debit Card</h3>
                        <p style="margin: 6px 0 0; font-size: 18px; color: #666;">Pay securely with your card</p>
                    </div>
                    <span style="color: #1a73e8; font-size: 28px; margin-left: 20px;">›</span>
                </button>
                
                <!-- GCash  -->
                <button onclick="processPayment('gcash')" style="display: flex; align-items: center; width: 100%; height: 100px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; padding: 0 30px; cursor: pointer; transition: all 0.2s ease; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <div style="width: 60px; height: 60px; border-radius: 12px; background: #007dfe; display: flex; align-items: center; justify-content: center; margin-right: 24px;">
                        <span style="color: white; font-size: 28px;">G</span>
                    </div>
                    <div style="flex-grow: 1;">
                        <h3 style="margin: 0; font-size: 24px; font-weight: 600; color: #333;">GCash</h3>
                        <p style="margin: 6px 0 0; font-size: 18px; color: #666;">Pay with your GCash account</p>
                    </div>
                    <span style="color: #007dfe; font-size: 28px; margin-left: 20px;">›</span>
                </button>
                
                <!-- Paynow -->
                <button onclick="processPayment('counter')" style="display: flex; align-items: center; width: 100%; height: 100px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; padding: 0 30px; cursor: pointer; transition: all 0.2s ease; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <div style="width: 60px; height: 60px; border-radius: 12px; background: #e67e22; display: flex; align-items: center; justify-content: center; margin-right: 24px;">
                        <span style="color: white; font-size: 28px;">🏪</span>
                    </div>
                    <div style="flex-grow: 1;">
                        <h3 style="margin: 0; font-size: 24px; font-weight: 600; color: #333;">Pay at Counter</h3>
                        <p style="margin: 6px 0 0; font-size: 18px; color: #666;">Pay when you pick up your order</p>
                    </div>
                    <span style="color: #e67e22; font-size: 28px; margin-left: 20px;">›</span>
                </button>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 30px 50px 40px; background: #f9f9f9; border-top: 1px solid #f0f0f0;">
            <button onclick="closePaymentModal()" style="width: 100%; height: 70px; background: #0a5714ff; color: white; font-size: 20px; font-weight: 600; border: none; border-radius: 14px; cursor: pointer; transition: all 0.2s ease;">
                CANCEL
            </button>
        </div>
    </div>
</div>

    <script>
        function closePaymentModal() {
        document.getElementById('paymentOptionsModal').style.display = 'none';
    }
    
   
    
    // Function to open the payment modal
    function openPaymentModal() {
        document.getElementById('paymentOptionsModal').style.display = 'flex';
    }
        function selectOrderType(type) {
            document.getElementById('orderTypeModal').style.display = 'none';
        }
        function showOrderModal() {
            document.getElementById('orderSummaryModal').style.display = 'flex';
        }
        function closeOrderModal() {
            document.getElementById('orderSummaryModal').style.display = 'none';
        }
        function proceedToPayment() {
            document.getElementById('paymentOptionsModal').style.display = 'flex';
        }
        function closePaymentModal() {
            document.getElementById('paymentOptionsModal').style.display = 'none';
        }
       
        function refreshPage() {
            location.reload();
        }



    
    </script>
    
</body>
</html>