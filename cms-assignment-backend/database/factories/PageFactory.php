<?php

namespace Database\Factories;

use App\Models\Menu;
use App\Models\Page;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PageFactory extends Factory
{
    protected $model = Page::class;

    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [

            'menu_id' => Menu::factory(),

            'title' => $title,

            'slug' => Str::slug($title),

            'body' => fake()->paragraphs(3, true),

            'cover_image' => null,

            'status' => 'draft',

            'publish_date' => now(),

            'created_by' => User::factory(),

            'updated_by' => null,
        ];
    }
}