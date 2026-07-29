<?php

namespace Tests\Feature;

use App\Models\Menu;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PageTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Menu $menu;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->user = User::where('email', 'admin@cms.com')->first();

        Sanctum::actingAs($this->user);

        $this->menu = Menu::factory()->create();
    }

    /** @test */
    public function can_list_pages()
    {
        Page::factory()->count(3)->create([
            'menu_id' => $this->menu->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson('/api/pages');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'links',
                'meta'
            ]);
    }

    /** @test */
    public function can_create_page()
    {
        Storage::fake('public');

        $image = UploadedFile::fake()->image('cover.jpg');

        $response = $this->postJson('/api/pages', [
            'menu_id' => $this->menu->id,
            'title' => 'Home Page',
            'slug' => 'home-page',
            'body' => 'Page Content',
            'status' => 'published',
            'publish_date' => now()->toDateTimeString(),
            'cover_image' => $image,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('pages', [
            'title' => 'Home Page',
            'slug' => 'home-page'
        ]);

        Storage::disk('public')->assertExists(
            Page::first()->cover_image
        );
    }

    /** @test */
    public function can_show_page()
    {
        $page = Page::factory()->create([
            'menu_id' => $this->menu->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson("/api/pages/{$page->id}");

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'id' => $page->id
            ]);
    }

    /** @test */
    public function can_update_page()
    {
        $page = Page::factory()->create([
            'menu_id' => $this->menu->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->putJson("/api/pages/{$page->id}", [
            'menu_id' => $this->menu->id,
            'title' => 'Updated Page',
            'slug' => 'updated-page',
            'body' => 'Updated Content',
            'status' => 'draft',
            'publish_date' => now()->toDateTimeString(),
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('pages', [
            'id' => $page->id,
            'title' => 'Updated Page',
        ]);
    }

    /** @test */
    public function can_delete_page()
    {
        $page = Page::factory()->create([
            'menu_id' => $this->menu->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->deleteJson("/api/pages/{$page->id}");

        $response->assertStatus(200);

        $this->assertSoftDeleted('pages', [
            'id' => $page->id,
        ]);
    }
}