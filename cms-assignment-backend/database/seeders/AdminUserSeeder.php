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
        $admin = User::updateOrCreate(
            [
                'email' => 'admin@cms.com'
            ],
            [
                'name' => 'System Admin',
                'password' => Hash::make('Password@123')
            ]
        );

        $admin->assignRole('Admin');
    }
}
