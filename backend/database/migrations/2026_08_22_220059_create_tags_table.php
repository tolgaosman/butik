<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            // varchar, never cast to int — "50" is a legitimate slug (see /indirim/50).
            $table->string('slug', 64)->unique();
            $table->string('name', 128);
            $table->enum('type', ['category', 'subcategory', 'collection']);
            $table->unsignedSmallInteger('position')->default(0);
            $table->timestamps();

            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
