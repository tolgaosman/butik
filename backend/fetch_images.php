<?php

$url = "https://unsplash.com/napi/search/photos?query=fashion+model&per_page=60&page=1";
$context = stream_context_create([
    "http" => [
        "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n"
    ]
]);
$data = file_get_contents($url, false, $context);
$json = json_decode($data, true);

$images = [];
foreach ($json['results'] as $result) {
    $images[] = "https://images.unsplash.com/photo-" . $result['id'] . "?q=80&w=800&auto=format&fit=crop";
}

file_put_contents('images.json', json_encode($images, JSON_PRETTY_PRINT));
echo "Saved " . count($images) . " images to images.json\n";
