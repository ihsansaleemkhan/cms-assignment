<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class RoleTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $permissions = [
            'role.view',
            'role.create',
            'role.edit',
            'role.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::create([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $role = Role::create([
            'name' => 'Admin',
            'guard_name' => 'web',
        ]);

        $role->givePermissionTo($permissions);

        $this->admin = User::factory()->create();

        $this->admin->assignRole('Admin');

        Sanctum::actingAs($this->admin);
    }

    /** @test */
    public function can_list_roles()
    {
        Role::create([
            'name' => 'Editor',
            'guard_name' => 'web',
        ]);

        $response = $this->getJson('/api/roles');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data'
            ]);
    }

    /** @test */
    public function can_create_role()
    {
        $response = $this->postJson('/api/roles', [
            'name' => 'Manager',
            'permissions' => [
                'role.view',
                'role.create'
            ]
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('roles', [
            'name' => 'Manager'
        ]);
    }

    /** @test */
    public function can_show_role()
    {
        $role = Role::create([
            'name' => 'Editor',
            'guard_name' => 'web',
        ]);

        $response = $this->getJson("/api/roles/{$role->id}");

        $response
            ->assertStatus(200)
            ->assertJson([
                'data' => [
                    'name' => 'Editor'
                ]
            ]);
    }

    /** @test */
    public function can_update_role()
    {
        $role = Role::create([
            'name' => 'Editor',
            'guard_name' => 'web',
        ]);

        $response = $this->putJson("/api/roles/{$role->id}", [
            'name' => 'Content Editor',
            'permissions' => [
                'role.view'
            ]
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('roles', [
            'name' => 'Content Editor'
        ]);
    }

    /** @test */
    public function can_delete_role()
    {
        $role = Role::create([
            'name' => 'Temp',
            'guard_name' => 'web',
        ]);

        $response = $this->deleteJson("/api/roles/{$role->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('roles', [
            'name' => 'Temp'
        ]);
    }
}