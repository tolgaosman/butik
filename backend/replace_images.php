<?php
$file = 'd:\Documents\GitHub\butik\backend\database\seeders\ProductSeeder.php';
$content = file_get_contents($file);

$counter = 1;
$content = preg_replace_callback('/\'image\'\s*=>\s*\'https:\/\/images\.unsplash\.com\/photo-[^\']+\'/', function($matches) use (&$counter) {
    $url = "'image' => 'https://loremflickr.com/800/1200/fashion?random=" . $counter . "'";
    $counter++;
    return $url;
}, $content);

file_put_contents($file, $content);
echo "Replaced " . ($counter - 1) . " images in ProductSeeder.php\n";
