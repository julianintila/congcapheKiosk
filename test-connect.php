<?php
// debug_register.php - Check what's happening with register numbers
header('Content-Type: text/html');

echo "<h2>Register Number Debug</h2>";

// 1. Check config file
echo "<h3>1. Config File Check</h3>";
try {
    $config = require __DIR__ . '/config.php';
    echo "<strong>Config register_no:</strong> " . $config['register_no'] . "<br>";
    echo "<strong>Config file path:</strong> " . __DIR__ . '/config.php' . "<br>";
    echo "<strong>Config file exists:</strong> " . (file_exists(__DIR__ . '/config.php') ? 'Yes' : 'No') . "<br>";
    echo "<pre>";
    print_r($config);
    echo "</pre>";
} catch (Exception $e) {
    echo "<span style='color: red;'>Error loading config: " . $e->getMessage() . "</span><br>";
}

echo "<hr>";

// 2. Check session
echo "<h3>2. Session Check</h3>";
session_start();
echo "<strong>Session register_no:</strong> " . ($_SESSION['register_no'] ?? 'Not set') . "<br>";
echo "<strong>All session data:</strong><br>";
echo "<pre>";
print_r($_SESSION);
echo "</pre>";

echo "<hr>";

// 3. Check database records
echo "<h3>3. Database Records Check</h3>";
try {
    $serverName = $config['db_server'];
    $connectionOptions = array(
        "Database" => $config['db_name'],
        "Uid" => $config['db_user'],
        "PWD" => $config['db_pass']
    );
    
    $conn = sqlsrv_connect($serverName, $connectionOptions);
    if ($conn === false) {
        throw new Exception('Database connection failed: ' . print_r(sqlsrv_errors(), true));
    }
    
    // Check recent transactions
    $sql = "SELECT TOP 10 ReferenceNo, RegisterNo, DateTime FROM [dbo].[KIOSK_TransactionHeader] ORDER BY DateTime DESC";
    $stmt = sqlsrv_query($conn, $sql);
    
    if ($stmt !== false) {
        echo "<strong>Recent Transactions:</strong><br>";
        echo "<table border='1' style='border-collapse: collapse;'>";
        echo "<tr><th>Reference No</th><th>Register No</th><th>Date Time</th></tr>";
        
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $style = ($row['RegisterNo'] != $config['register_no']) ? "style='background-color: #ffcccc;'" : "";
            echo "<tr $style>";
            echo "<td>" . htmlspecialchars($row['ReferenceNo']) . "</td>";
            echo "<td>" . htmlspecialchars($row['RegisterNo']) . "</td>";
            echo "<td>" . $row['DateTime']->format('Y-m-d H:i:s') . "</td>";
            echo "</tr>";
        }
        echo "</table>";
        echo "<br><em>Red rows indicate register number mismatch with config</em><br>";
    }
    
    sqlsrv_close($conn);
    
} catch (Exception $e) {
    echo "<span style='color: red;'>Database error: " . $e->getMessage() . "</span><br>";
}

echo "<hr>";

// 4. Server info
echo "<h3>4. Server Information</h3>";
echo "<strong>Server Name:</strong> " . ($_SERVER['SERVER_NAME'] ?? 'Unknown') . "<br>";
echo "<strong>Server IP:</strong> " . ($_SERVER['SERVER_ADDR'] ?? 'Unknown') . "<br>";
echo "<strong>Document Root:</strong> " . ($_SERVER['DOCUMENT_ROOT'] ?? 'Unknown') . "<br>";
echo "<strong>Script Path:</strong> " . __FILE__ . "<br>";
echo "<strong>Current Directory:</strong> " . __DIR__ . "<br>";

// 5. Quick fix buttons
echo "<hr>";
echo "<h3>5. Quick Actions</h3>";
echo "<button onclick=\"location.reload()\">Refresh Debug</button> ";
echo "<button onclick=\"clearSession()\">Clear Session</button>";

echo "<script>
function clearSession() {
    fetch('clear_session.php')
    .then(() => {
        alert('Session cleared');
        location.reload();
    });
}
</script>";
?>

<?php
// clear_session.php content (create this as separate file)
if (basename($_SERVER['PHP_SELF']) == 'clear_session.php') {
    session_start();
    session_destroy();
    echo "Session cleared";
    exit;
}
?>