<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;

/**
 * Throwaway verification for Phase 3 of the backend build — checked against
 * the counts documented in the implementation plan. Safe to delete once the
 * catalog API (Phase 4) has its own tests.
 */
class VerifySeed extends Command
{
    protected $signature = 'verify:seed';

    protected $description = 'Verify seeded data matches frontend/src/lib/products.ts exactly';

    public function handle(): int
    {
        $total = Product::count();
        $isNew = Product::where('is_new', true)->count();
        $yeniGelenler = Product::whereHas('tags', fn ($q) => $q->where('slug', 'yeni-gelenler'))->count();
        $midiDresses = Product::whereHas('tags', fn ($q) => $q->where('slug', 'elbise'))
            ->whereHas('tags', fn ($q) => $q->where('slug', 'midi'))
            ->count();

        $this->line("Total products: {$total} (expect 40)");
        $this->line("isNew=true: {$isNew} (expect 7)");
        $this->line("tagged yeni-gelenler: {$yeniGelenler} (expect 5)");
        $this->line("elbise ∩ midi: {$midiDresses} (expect 2)");

        $kediGoz = Product::where('slug', 'kedi-goz-gunes-gozlugu')->first();
        $inciKupe = Product::where('slug', 'inci-kupe')->first();

        $this->line('kedi-goz-gunes-gozlugu: price='.($kediGoz->price_minor / 100).
            ' compare='.($kediGoz->compare_at_price_minor / 100).
            ' discount%='.round((1 - $kediGoz->price_minor / $kediGoz->compare_at_price_minor) * 100));
        $this->line('inci-kupe compare_at_price_minor: '.var_export($inciKupe->compare_at_price_minor, true).' (expect NULL)');

        $ok = $total === 40 && $isNew === 7 && $yeniGelenler === 5 && $midiDresses === 2;
        $this->line($ok ? 'ALL CHECKS PASSED' : 'MISMATCH FOUND');

        return $ok ? self::SUCCESS : self::FAILURE;
    }
}
