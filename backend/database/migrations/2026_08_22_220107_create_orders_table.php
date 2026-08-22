<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 16)->unique(); // "SB-10234", derived from id post-insert
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('email', 255); // guest tracking key
            $table->string('phone', 32);

            $table->enum('status', [
                'pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded',
            ])->default('pending');
            $table->enum('payment_method', ['cash_on_delivery', 'bank_transfer'])->default('cash_on_delivery');
            $table->enum('payment_status', ['unpaid', 'paid', 'refunded'])->default('unpaid');

            $table->unsignedBigInteger('subtotal_minor');
            $table->unsignedBigInteger('shipping_minor')->default(0);
            $table->unsignedBigInteger('discount_minor')->default(0);
            $table->unsignedBigInteger('total_minor');
            $table->char('currency', 3)->default('TRY');

            // Flattened snapshot, NOT an FK to addresses — editing a saved address later
            // must not silently re-address historical orders.
            $table->string('shipping_name', 255);
            $table->string('shipping_phone', 32);
            $table->string('shipping_line1', 255);
            $table->string('shipping_line2', 255)->nullable();
            $table->string('shipping_district', 128);
            $table->string('shipping_city', 128);
            $table->string('shipping_postal', 16)->nullable();
            $table->char('shipping_country', 2)->default('CY');

            $table->text('customer_note')->nullable();
            $table->text('admin_note')->nullable();
            $table->string('tracking_number', 64)->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->index(['email', 'order_number']); // guest tracking lookup
            $table->index(['user_id', 'created_at']);
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
