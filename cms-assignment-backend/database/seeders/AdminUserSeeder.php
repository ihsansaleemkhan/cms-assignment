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
        | Admin
        |--------------------------------------------------------------------------
        */
        $admin = User::updateOrCreate(
            [
                'email' => 'admin@cms.com',
            ],
            [
                'name' => 'System Admin',
                'password' => Hash::make('Password@123'),
            ]
        );

        $admin->syncRoles(['Admin']);

        /*
        |--------------------------------------------------------------------------
        | Moderator
        |--------------------------------------------------------------------------
        */
        $moderator = User::updateOrCreate(
            [
                'email' => 'moderator@cms.com',
            ],
            [
                'name' => 'Moderator User',
                'password' => Hash::make('Password@123'),
            ]
        );

        $moderator->syncRoles(['Moderator']);

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
                'name' => 'Viewer User',
                'password' => Hash::make('Password@123'),
            ]
        );

        $viewer->syncRoles(['Viewer']);
    }
}