<?php

// Step 1: Raw Data (Invalid JSON format)
$rawData = '{
    id:1234567891234567,
    v:241.66,
    v_max:220.71,
    v_min:222.13,
    i:8.46,
    rpm:1462.71,
    eff:6.59,
    p_out:159.53,
    v_l1:246.38,
    v_l2:229.67,
    v_l3:242.03,
    v_p:229.89,
    p_s:192.69,
    t_amb:20.89,
    t:28.68,
    err:WOU484
}';

// Step 2: Fix JSON formatting manually
$fixedJson = preg_replace([
    '/(\w+):/', // Add double quotes around keys
    '/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/', // Wrap datetime values in quotes
    '/:(\w+)(?=[,\s}])/' // Wrap non-numeric values (like "WOU484") in quotes
], ['"$1":', ':"$1"', ':"$1"'], $rawData);

// Step 3: Decode JSON
$data = json_decode($fixedJson, true);

// Step 4: Check for errors and print results
if (json_last_error() === JSON_ERROR_NONE) {
    echo "Successfully Decoded JSON:\n";
    print_r($data);
} else {
    echo "JSON Decode Error: " . json_last_error_msg() . "\n";
    echo "Fixed JSON:\n$fixedJson\n"; // Debugging output
}

?>
