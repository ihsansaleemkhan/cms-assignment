<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->admin = User::where('email', 'admin@cms.com')->first();

        Sanctum::actingAs($this->admin);
    }

    /** @test */
    public function can_list_users()
    {
        User::factory()->count(3)->create();

        $response = $this->getJson('/api/users');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'links',
                'meta'
            ]);
    }

    /** @test */
    public function can_create_user()
    {
        $response = $this->postJson('/api/users', [

            'name' => 'John Doe',

            'email' => 'john@example.com',

            'password' => 'Password@123',

            'password_confirmation' => 'Password@123',

            'role' => 'Viewer',
        ]);

        $response
            ->assertStatus(201)
            ->assertJsonFragment([
                'email' => 'john@example.com'
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com'
        ]);
    }

    /** @test */
    public function can_show_user()
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/users/{$user->id}");

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'id' => $user->id
            ]);
    }

    /** @test */
    public function can_update_user()
    {
        $user = User::factory()->create();

        $response = $this->putJson("/api/users/{$user->id}", [

            'name' => 'Updated User',

            'email' => 'updated@example.com',

            'role' => 'Moderator',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [

            'id' => $user->id,

            'name' => 'Updated User',

            'email' => 'updated@example.com',
        ]);
    }

    /** @test */
    public function can_delete_user()
    {
        $user = User::factory()->create();

        $response = $this->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(200);

        $this->assertSoftDeleted('users', [

            'id' => $user->id

        ]);
    }
}