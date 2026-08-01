<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicPageListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * This resource is used for public page cards and lists.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'title' => $this->title,

            'title_ar' => $this->title_ar,

            'slug' => $this->slug,

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
                        'title_ar' => $this->menu->title_ar,
                        'slug' => $this->menu->slug,
                    ]
                    : null
            ),
        ];
    }
}