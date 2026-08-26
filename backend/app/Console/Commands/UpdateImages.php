<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\ProductImage;

class UpdateImages extends Command
{
    protected $signature = 'images:update';
    protected $description = 'Update product images to loremflickr';

    public function handle()
    {
        $products = Product::orderBy('id')->get();
        $counter = 1;

        foreach ($products as $product) {
            $url = "https://loremflickr.com/800/1200/fashion?random=" . $counter;
            $product->image = $url;
            $product->save();

            $image = ProductImage::where('product_id', $product->id)->first();
            if ($image) {
                $image->url = $url;
                $image->save();
            }

            $counter++;
        }

        $this->info("Updated " . ($counter - 1) . " products.");
    }
}
