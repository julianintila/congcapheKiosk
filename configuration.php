<?php
session_start();

if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

// Admin password (you can change this)
$admin_password = 'admin';

// If not authenticated, show login (this will ALWAYS show if not logged in)
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['admin_password'])) {
        if ($_POST['admin_password'] === $admin_password) {
            $_SESSION['authenticated'] = true;
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        } else {
            $error = "❌ Incorrect password.";
        }
    }

    // Login form
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Admin Login</title>
        <style>
            body {
                font-family: 'Segoe UI', sans-serif;
                background: rgb(0, 0, 0);
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .login-box {
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                width: 450px;
                height: 250px;
                text-align: center;
            }
            input[type="password"] {
                width: 90%;
                padding: 12px;
                margin-top: 10px;
                border-radius: 8px;
                border: 1px solid #ccc;
                font-size: 18px;
            }
            button {
                margin-top: 20px;
                padding: 12px;
                width: 100%;
                background: rgb(250, 250, 250);
                color: black;
                font-weight: bold;
                border: 2px solid black;
                border-radius: 8px;
                font-size: 20px;
                cursor: pointer;
                transition: 0.3s;
            }
            button:hover {
                background: #0056b3;
                color: white;
            }
            .error {
                margin-top: 15px;
                color: red;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h2>Admin Password</h2>
            <form method="POST">
                <input type="password" name="admin_password" placeholder="Enter password" required>
                <button type="submit">Login</button>
            </form>
            <?php if (isset($error)) echo '<div class="error">' . $error . '</div>'; ?>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Continue to configuration form if authenticated
$config_file = 'config.php';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['db_server'])) {
    $new_config = [
        'db_server'          => $_POST['db_server'],
        'db_name'           => $_POST['db_name'],
        'db_user'           => $_POST['db_user'],
        'db_pass'           => $_POST['db_pass'],
        'printer_names'     => array_map('trim', explode(',', $_POST['printer_names'] ?? 'POS80')),
        'register_no'       => (int)$_POST['register_no'],
        'queue_prefix'      => $_POST['queue_prefix'],
        'central_server_url' => $_POST['central_server_url'] // Now this will have a value from the form
    ];
    $config_content = "<?php\n\nreturn " . var_export($new_config, true) . ";\n\n?>";
    file_put_contents($config_file, $config_content);

    // Set session flag for showing success modal
    $_SESSION['config_saved'] = true;
    // Auto-logout for security - destroy session after saving
    $_SESSION['auto_logout'] = true;
}

$config = include $config_file;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Configuration Settings</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', sans-serif;
            margin: 0;
            background: black;
        }
        .center-page {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        .config-wrapper {
            max-width: 750px;
            width: 100%;
            background: #fff;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        .logo-container {
            text-align: center;
            margin-bottom: 25px;
        }
        .logo-container img {
            width: 120px;
            height: auto;
        }
        h2 {
            text-align: center;
            margin-bottom: 25px;
            color: #333;
        }
        label {
            font-weight: bold;
            display: block;
            margin-top: 20px;
            margin-bottom: 5px;
        }
        input {
            width: 100%;
            padding: 10px 12px;
            border-radius: 8px;
            border: 1px solid #ccc;
            transition: all 0.3s ease;
        }
        input:focus {
            border-color: #007bff;
            outline: none; 
            box-shadow: 0 0 5px rgba(0,123,255,0.3);
        }
        button {
            width: 100%;
            background-color: rgb(253, 253, 253);
            color: black;
            font-size: 16px;
            font-weight: bold;
            padding: 12px;
            border: 2px solid black;
            border-radius: 8px;
            margin-top: 30px;
            cursor: pointer;
            transition: 0.3s;
        }
        button:hover {
            background-color: rgb(0, 0, 0);
            color: white;
            border-color: rgb(255, 255, 255);
        }
        
        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(5px);
            animation: fadeIn 0.4s ease-out;
        }
        .modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-content {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            margin: 0;
            padding: 40px 35px;
            border: none;
            width: 450px;
            max-width: 90%;
            text-align: center;
            border-radius: 20px;
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.3),
                0 8px 20px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.8);
            animation: modalBounce 0.5s ease-out;
            position: relative;
            overflow: hidden;
        }
        
        .modal-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg,rgb(10, 11, 10),rgb(10, 11, 11),rgb(0, 0, 0));
            animation: shimmer 2s infinite;
        }
        
        .modal-content .check-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg,rgb(15, 17, 15),rgb(16, 19, 17));
            border-radius: 50%;
            margin: 0 auto 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 
                0 8px 25px rgba(40, 167, 69, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            animation: checkPulse 0.6s ease-out 0.3s both;
        }
        
        .modal-content .check-icon::before {
            content: '✓';
            color: white;
            font-size: 40px;
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            animation: checkDraw 0.4s ease-out 0.5s both;
        }
        
        .modal-content .check-icon::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            animation: ripple 1.5s infinite 0.8s;
        }
        
        .close-modal {
            margin-top: 25px;
            padding: 12px 30px;
            background: linear-gradient(135deg,rgb(254, 254, 254),rgb(244, 244, 244));
            color: black;
            border: 2px solid black;
            border-radius: 12px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 
                0 4px 15px rgba(41, 44, 42, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .close-modal:hover {
            background: linear-gradient(135deg,rgb(13, 15, 13),rgb(6, 7, 6));
            transform: translateY(-2px);
            color:white;
            box-shadow: 
                0 6px 20px rgba(40, 167, 69, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .close-modal:active {
            transform: translateY(0);
        }
        
        .modal-content .message {
            margin-bottom: 15px;
            font-size: 22px;
            font-weight: 700;
            color: #2c3e50;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .modal-content .sub-message {
            font-size: 15px;
            color: #6c757d;
            font-weight: 500;
            line-height: 1.4;
            margin-bottom: 5px;
        }
        
        @keyframes fadeIn {
            from { 
                opacity: 0; 
            }
            to { 
                opacity: 1; 
            }
        }
        
        @keyframes modalBounce {
            0% { 
                opacity: 0;
                transform: scale(0.3) translateY(-50px);
            }
            50% {
                opacity: 1;
                transform: scale(1.05) translateY(0);
            }
            100% { 
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        @keyframes checkPulse {
            0% { 
                transform: scale(0);
                opacity: 0;
            }
            50% {
                transform: scale(1.1);
                opacity: 1;
            }
            100% { 
                transform: scale(1);
                opacity: 1;
            }
        }
        
        @keyframes checkDraw {
            0% { 
                opacity: 0;
                transform: scale(0) rotate(180deg);
            }
            100% { 
                opacity: 1;
                transform: scale(1) rotate(0deg);
            }
        }
        
        @keyframes ripple {
            0% {
                transform: scale(1);
                opacity: 0.6;
            }
            100% {
                transform: scale(1.4);
                opacity: 0;
            }
        }
        
        @keyframes shimmer {
            0% {
                background-position: -200% 0;
            }
            100% {
                background-position: 200% 0;
            }
        }
    </style>
</head>
<body>

<!-- Success Modal -->
<div class="modal" id="successModal">
    <div class="modal-content">
        <div class="check-icon"></div>
        <div class="message">Configuration Saved!</div>
        <div class="sub-message">Your settings have been successfully updated.</div>
        <button class="close-modal" onclick="closeModalAndLogout()">Continue</button>
    </div>
</div>

<div class="center-page">
    <div class="config-wrapper">
        <div class="logo-container">
            <img src="images/logos/logoblack.png" alt="Logo">
        </div>

        <h2>Kiosk System Configuration</h2>
        <form method="POST">
            <label for="db_server">DB Server</label>
            <input type="text" name="db_server" id="db_server" value="<?= htmlspecialchars($config['db_server']) ?>" required>

            <label for="db_name">DB Name</label>
            <input type="text" name="db_name" id="db_name" value="<?= htmlspecialchars($config['db_name']) ?>" required>

            <label for="db_user">DB User</label>
            <input type="text" name="db_user" id="db_user" value="<?= htmlspecialchars($config['db_user']) ?>" required>

            <label for="db_pass">DB Password</label>
            <input type="password" name="db_pass" id="db_pass" value="<?= htmlspecialchars($config['db_pass']) ?>" required>

            <label for="register_no">Register No</label>
            <input type="number" name="register_no" id="register_no" value="<?= htmlspecialchars($config['register_no']) ?>" required>

            <label for="queue_prefix">Queue Prefix</label>
            <input type="text" name="queue_prefix" id="queue_prefix" value="<?= htmlspecialchars($config['queue_prefix']) ?>" required>

            <label for="central_server_url">Central Server URL</label>
            <input type="url" name="central_server_url" id="central_server_url" 
                   value="<?= htmlspecialchars($config['central_server_url'] ?? 'http://your-central-server.com') ?>" 
                   placeholder="http://your-central-server.com" required>

            <button type="submit">Save Configuration</button>
        </form>
    </div>
</div>

<script>

<?php if (isset($_SESSION['config_saved']) && $_SESSION['config_saved']): ?>
    document.getElementById('successModal').classList.add('show');
    <?php unset($_SESSION['config_saved']); ?>
<?php endif; ?>

function closeModalAndLogout() {
    document.getElementById('successModal').classList.remove('show');
    
    setTimeout(function() {
        window.location.href = '?logout=1';
    }, 500);
}

function closeModal() {
    document.getElementById('successModal').classList.remove('show');
}

window.onclick = function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        <?php if (isset($_SESSION['auto_logout']) && $_SESSION['auto_logout']): ?>
            closeModalAndLogout();
        <?php else: ?>
            closeModal();
        <?php endif; ?>
    }
}

// Close modal with Escape key (but still logout after save)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        <?php if (isset($_SESSION['auto_logout']) && $_SESSION['auto_logout']): ?>
            closeModalAndLogout();
        <?php else: ?>
            closeModal();
        <?php endif; ?>
    }
});
</script>

</body>
</html>