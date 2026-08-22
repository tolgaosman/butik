<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_tag', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            // Seed-file tag order — getRelatedProducts() keys off tags[0].
            $table->unsignedSmallInteger('position')->default(0);

            $table->primary(['product_id', 'tag_id']);
            $table->index(['tag_id', 'product_id']); // drives category/subcategory listing
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_tag');
    }
};
