<?php
$total_amount = "100";
$transaction_uuid = "TX" . time();
$product_code = "EPAYTEST";
$secret_key = "8gBm/:&EnhH.1/q";

$raw_string = "total_amount=$total_amount,transaction_uuid=$transaction_uuid,product_code=$product_code";
$signature = base64_encode(hash_hmac('sha256', $raw_string, $secret_key, true));

echo "Raw string: " . $raw_string . "\n";
echo "Signature: " . $signature . "\n";
?>