<?php
ini_set('display_errors',true); 
error_reporting(-1);

//header('Content-Type: image/png');

include "phpqrcode/qrlib.php";

$url = urldecode($_GET["url"]);
QRcode::png($url, false, 'L', 2, 1);
?>