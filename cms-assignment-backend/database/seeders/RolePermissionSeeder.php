<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [

            // Dashboard
            'dashboard.view',

            // Menu
            'menu.view',
            'menu.create',
            'menu.edit',
            'menu.delete',

            // Page
            'page.view',
            'page.create',
            'page.edit',
            'page.delete',

            // User
            'user.view',
            'user.create',
            'user.edit',
            'user.delete',

            // Role
            'role.view',
            'role.create',
            'role.edit',
            'role.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // Roles
        $admin = Role::firstOrCreate([
            'name' => 'Admin',
            'guard_name' => 'web',
        ]);

        $moderator = Role::firstOrCreate([
            'name' => 'Moderator',
            'guard_name' => 'web',
        ]);

        $viewer = Role::firstOrCreate([
            'name' => 'Viewer',
            'guard_name' => 'web',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */
        $admin->syncPermissions(Permission::all());

        /*
        |--------------------------------------------------------------------------
        | Moderator
        |--------------------------------------------------------------------------
        */
        $moderator->syncPermissions([
            'dashboard.view',

            'menu.view',
            'menu.create',
            'menu.edit',

            'page.view',
            'page.create',
            'page.edit',

            'user.view',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Viewer
        |--------------------------------------------------------------------------
        */
        $viewer->syncPermissions([
            'dashboard.view',

            'menu.view',

            'page.view',
        ]);
    }
}