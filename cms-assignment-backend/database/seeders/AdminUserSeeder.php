<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | System Administrator
        |--------------------------------------------------------------------------
        */

        $systemAdministrator = User::updateOrCreate(
            [
                'email' => 'admin@cms.com',
            ],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('Password@123'),
            ]
        );

        $systemAdministrator->syncRoles([
            'System Administrator',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Content Manager
        |--------------------------------------------------------------------------
        */

        $contentManager = User::updateOrCreate(
            [
                'email' => 'manager@cms.com',
            ],
            [
                'name' => 'Content Manager',
                'password' => Hash::make('Password@123'),
            ]
        );

        $contentManager->syncRoles([
            'Content Manager',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Moderator
        |--------------------------------------------------------------------------
        */

        $contentModerator = User::updateOrCreate(
            [
                'email' => 'moderator@cms.com',
            ],
            [
                'name' => 'Moderator',
                'password' => Hash::make('Password@123'),
            ]
        );

        $contentModerator->syncRoles([
            'Moderator',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Viewer
        |--------------------------------------------------------------------------
        */

        $viewer = User::updateOrCreate(
            [
                'email' => 'viewer@cms.com',
            ],
            [
                'name' => 'Viewer',
                'password' => Hash::make('Password@123'),
            ]
        );

        $viewer->syncRoles([
            'Viewer',
        ]);
    }
}