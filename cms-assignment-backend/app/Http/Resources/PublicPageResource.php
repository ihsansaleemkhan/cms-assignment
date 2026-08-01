<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicPageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * This resource is used for a public page-detail screen.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'title' => $this->title,

            'slug' => $this->slug,

            'body' => $this->body,

            'cover_image' => $this->cover_image
                ? asset('storage/' . $this->cover_image)
                : null,

            'publish_date' => $this->publish_date,

            'menu' => $this->whenLoaded(
                'menu',
                fn () => $this->menu
                    ? [
                        'id' => $this->menu->id,
                        'title' => $this->menu->title,
                        'slug' => $this->menu->slug,
                    ]
                    : null
            ),
        ];
    }
}