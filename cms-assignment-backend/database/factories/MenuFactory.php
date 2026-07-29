<?php

namespace Database\Factories;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MenuFactory extends Factory
{
    protected $model = Menu::class;

    public function definition(): array
    {
        $title = fake()->unique()->words(2, true);

        return [
            'parent_id' => null,
            'title' => ucfirst($title),
            'slug' => Str::slug($title),
            'sort_order' => fake()->numberBetween(0, 20),
            'is_active' => true,
        ];
    }
}