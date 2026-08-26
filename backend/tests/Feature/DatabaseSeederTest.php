<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * The seeder chain is what puts the admin account in a fresh database, so a
 * dangling seeder reference (a deleted TagSeeder, say) silently means "nobody
 * can log into the panel". Cheap to guard, expensive to debug.
 */
class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeding_creates_the_admin_account_and_catalog(): void
    {
        $this->seed();

        $admin = User::firstWhere('email', 'karabasaksevgi4@gmail.com');

        $this->assertNotNull($admin);
        $this->assertTrue($admin->is_admin);
        $this->assertTrue(Category::query()->exists());
        $this->assertTrue(Product::query()->exists());
    }
}
