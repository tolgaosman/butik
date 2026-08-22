<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->cascadeOnDelete();
            // restrict: a variant sitting in a live cart must be deactivated, not deleted.
            $table->foreignId('variant_id')->constrained('product_variants')->restrictOnDelete();
            $table->unsignedSmallInteger('quantity'); // 1..10, mirrors ProductOptions cap
            $table->timestamps();

            $table->unique(['cart_id', 'variant_id']); // add-again increments, never duplicates
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
