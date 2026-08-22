<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            // Nullable: sizeless accessories get exactly one variant with size = null,
            // enforced by the model/Filament, not the DB (MySQL allows many NULLs in a
            // unique index, so it wouldn't stop duplicates on its own).
            $table->enum('size', ['XS', 'S', 'M', 'L', 'XL'])->nullable();
            $table->string('sku', 64)->nullable()->unique();
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedBigInteger('price_minor')->nullable(); // null = inherit product price
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['product_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
