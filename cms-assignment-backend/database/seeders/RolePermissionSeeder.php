<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         app()[\Spatie\Permission\PermissionRegistrar::class]
            ->forgetCachedPermissions();

        $permissions = [

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
            'user.create',
            'user.edit',
            'user.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }

        $admin = Role::firstOrCreate([
            'name' => 'Admin',
            'guard_name' => 'web'
        ]);

        $editor = Role::firstOrCreate([
            'name' => 'Editor',
            'guard_name' => 'web'
        ]);

          $viewer = Role::firstOrCreate([
            'name' => 'Viewer',
            'guard_name' => 'web'
        ]);

        $admin->syncPermissions(Permission::all());

        $editor->syncPermissions([
            'dashboard.view',
            'menu.view',
            'menu.create',
            'menu.edit',
            'page.view',
            'page.create',
            'page.edit'
        ]);

        $viewer->syncPermissions([
            'dashboard.view',
            'menu.view',
            'page.view'
        ]); 
        
        }
}
