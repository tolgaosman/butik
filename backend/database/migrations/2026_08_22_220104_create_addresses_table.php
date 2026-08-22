<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('label', 64)->nullable(); // "Ev", "İş"
            $table->string('full_name', 255);
            $table->string('phone', 32);
            $table->string('line1', 255);
            $table->string('line2', 255)->nullable();
            $table->string('district', 128);
            $table->string('city', 128);
            $table->string('postal_code', 16)->nullable(); // largely unused in KKTC
            $table->char('country', 2)->default('CY');
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'is_default']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
