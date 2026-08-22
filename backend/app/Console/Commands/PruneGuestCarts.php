<?php

namespace App\Console\Commands;

use App\Models\Cart;
use Illuminate\Console\Command;

class PruneGuestCarts extends Command
{
    protected $signature = 'carts:prune';

    protected $description = 'Delete abandoned guest carts past their expiry';

    public function handle(): int
    {
        $count = Cart::whereNull('user_id')
            ->where('expires_at', '<', now())
            ->delete();

        $this->info("{$count} süresi dolmuş misafir sepeti silindi.");

        return self::SUCCESS;
    }
}
