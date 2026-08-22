<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            // Nullable, used only for "reorder" links — never for rendering order history.
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();

            // Every display field is snapshotted so an old order renders identically
            // even if the product was renamed, repriced, or deleted.
            $table->string('product_name', 255);
            $table->string('product_slug', 128);
            $table->string('product_image', 512);
            $table->string('size', 8)->nullable();
            $table->unsignedBigInteger('unit_price_minor');
            $table->unsignedSmallInteger('quantity');
            $table->unsignedBigInteger('line_total_minor');
            $table->timestamps();

            $table->index('order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
