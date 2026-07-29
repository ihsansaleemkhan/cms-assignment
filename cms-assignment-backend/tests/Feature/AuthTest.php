<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Login with valid credentials.
     */
    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@cms.com',
            'password' => bcrypt('Password@123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@cms.com',
            'password' => 'Password@123',
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user'
            ]);
    }

    /**
     * Login fails with wrong password.
     */
    public function test_invalid_login_returns_401(): void
    {
        User::factory()->create([
            'email' => 'admin@cms.com',
            'password' => bcrypt('Password@123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@cms.com',
            'password' => 'wrong-password',
        ]);

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Invalid credentials.'
            ]);
    }

    /**
     * /me requires authentication.
     */
    public function test_me_requires_authentication(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401);
    }

    /**
     * Authenticated user can access /me.
     */
    public function test_authenticated_user_can_access_me(): void
    {
        $user = User::factory()->create();

        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/me');

        $response
        ->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'email',
                'roles',
                'permissions',
            ]
        ]);
    }
}