<?php

namespace Tests\Feature;

use App\Models\Menu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MenuTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->user = User::where('email', 'admin@cms.com')->first();

        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function can_list_menus()
    {
        Menu::factory()->count(3)->create();

        $response = $this->getJson('/api/menus');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'links',
                'meta'
            ]);
    }

    /** @test */
    public function can_create_menu()
    {
        $response = $this->postJson('/api/menus', [
            'title' => 'About Us',
            'slug' => 'about-us',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $response
            ->assertStatus(201)
            ->assertJsonFragment([
                'title' => 'About Us',
                'slug' => 'about-us'
            ]);

        $this->assertDatabaseHas('menus', [
            'slug' => 'about-us'
        ]);
    }

    /** @test */
    public function can_show_menu()
    {
        $menu = Menu::factory()->create();

        $response = $this->getJson("/api/menus/{$menu->id}");

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'id' => $menu->id
            ]);
    }

    /** @test */
    public function can_update_menu()
    {
        $menu = Menu::factory()->create();

        $response = $this->putJson("/api/menus/{$menu->id}", [
            'title' => 'Updated Menu',
            'slug' => 'updated-menu',
            'parent_id' => null,
            'sort_order' => 5,
            'is_active' => false,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('menus', [
            'id' => $menu->id,
            'title' => 'Updated Menu'
        ]);
    }

    /** @test */
    public function can_delete_menu()
    {
        $menu = Menu::factory()->create();

        $response = $this->deleteJson("/api/menus/{$menu->id}");

        $response->assertStatus(200);

        $this->assertSoftDeleted('menus', [
            'id' => $menu->id
        ]);
    }
}