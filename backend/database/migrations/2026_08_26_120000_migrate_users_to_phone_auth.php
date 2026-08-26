<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Switches account identity from email to phone. Existing rows without a
     * phone (seed/dummy accounts) get a deterministic placeholder first so
     * the column can become NOT NULL + UNIQUE.
     */
    public function up(): void
    {
        DB::table('users')->whereNull('phone')->orderBy('id')->pluck('id')->each(function (int $id) {
            DB::table('users')->where('id', $id)->update([
                'phone' => '500'.str_pad((string) $id, 7, '0', STR_PAD_LEFT),
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 32)->nullable(false)->change();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->unique('phone');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['email']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['email', 'email_verified_at']);
        });

        Schema::dropIfExists('password_reset_tokens');

        Schema::create('phone_otps', function (Blueprint $table) {
            $table->id();
            $table->string('phone', 32)->index();
            $table->string('code'); // hashed
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('expires_at');
            $table->timestamp('consumed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phone_otps');

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable()->after('name');
            $table->timestamp('email_verified_at')->nullable()->after('phone');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['phone']);
            $table->string('phone', 32)->nullable()->change();
        });
    }
};
