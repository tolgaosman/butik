<?php
$html = file_get_contents('https://unsplash.com/s/photos/fashion-model');
preg_match_all('/"id":"([a-zA-Z0-9_-]{10,12})"/i', $html, $matches);
$ids = array_unique($matches[1]);
echo "Found " . count($ids) . " images\n";
file_put_contents('unsplash_ids.txt', implode("\n", $ids));
