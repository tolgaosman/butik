<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 128)->unique(); // the frontend's Product.id
            $table->string('name', 255);
            $table->text('description')->nullable();

            $table->unsignedBigInteger('price_minor');
            $table->unsignedBigInteger('compare_at_price_minor')->nullable();

            $table->string('image', 512); // denormalised hero image, every listing needs it
            $table->boolean('has_sizes')->default(true);

            // Seeded social proof + live aggregate, blended in ProductResource.
            $table->decimal('rating_seed', 2, 1)->nullable();
            $table->unsignedInteger('review_count_seed')->default(0);
            $table->decimal('rating_avg', 3, 2)->nullable();
            $table->unsignedInteger('rating_count')->default(0);

            $table->boolean('is_new')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('position')->default(0); // seed file order; drives related-products order

            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'is_new']);
            $table->index(['is_active', 'position']);
        });

        // SQLite (used for the test suite) has no fulltext index support.
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            Schema::table('products', function (Blueprint $table) {
                $table->fullText('name');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
