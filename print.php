<?php

require __DIR__ . '/vendor/autoload.php';

use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;

$printerName = "POS80"; // Replace with your actual printer name
$connector = new WindowsPrintConnector($printerName);
$printer = new Printer($connector);

$printer->text("----------------Restaurant Name-----------------\n");
$printer->text("123 Main Street, City, Country\n");
$printer->text("Tel: 696-958-3497 x553\n");
$printer->text("Date: May 6, 2025 4:02 PM \n");
$printer->text("------------------------------------------------\n");
$printer->text("ITEM                      QTY           PRICE   \n");
$printer->text("ITEM                      QTY           PRICE   \n");





$printer->cut();
$printer->close();
