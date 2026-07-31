<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        /*
        |--------------------------------------------------------------------------
        | Dashboard Permissions
        |--------------------------------------------------------------------------
        */

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

        /*
        |--------------------------------------------------------------------------
        | Roles
        |--------------------------------------------------------------------------
        */

        $systemAdmin = Role::firstOrCreate([
            'name' => 'System Administrator',
            'guard_name' => 'web',
        ]);

        $contentManager = Role::firstOrCreate([
            'name' => 'Content Manager',
            'guard_name' => 'web',
        ]);

        $Moderator = Role::firstOrCreate([
            'name' => 'Moderator',
            'guard_name' => 'web',
        ]);

        $viewer = Role::firstOrCreate([
            'name' => 'Viewer',
            'guard_name' => 'web',
        ]);

        /*
        |--------------------------------------------------------------------------
        | System Administrator
        |--------------------------------------------------------------------------
        */

        $systemAdmin->syncPermissions(
            Permission::all()
        );

        /*
        |--------------------------------------------------------------------------
        | Content Manager
        |--------------------------------------------------------------------------
        */

        $contentManager->syncPermissions([

            'dashboard.view',

            'menu.view',
            'menu.create',
            'menu.edit',
            'menu.delete',

            'page.view',
            'page.create',
            'page.edit',
            'page.delete',

            'user.view',

            'role.view',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Moderator
        |--------------------------------------------------------------------------
        */

        $Moderator->syncPermissions([

            'dashboard.view',

            'menu.view',

            'page.view',
            'page.create',
            'page.edit',

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