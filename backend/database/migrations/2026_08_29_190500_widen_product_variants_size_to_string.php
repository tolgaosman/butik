<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * enum('XS','S','M','L','XL') only fit adult clothing. Admin already lets
     * staff pick "Yaş Grubu" / "Sayı" size types and type free text ("36",
     * "4-5 Yaş"), but every one of those inserts failed at the DB layer —
     * this migration is what actually makes those size types sellable.
     */
    public function up(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->string('size', 32)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->enum('size', ['XS', 'S', 'M', 'L', 'XL'])->nullable()->change();
        });
    }
};
