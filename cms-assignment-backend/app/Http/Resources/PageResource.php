<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
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

            'status' => $this->status,

            'publish_date' => $this->publish_date,

            'menu' => new MenuResource(
                $this->whenLoaded('menu')
            ),

            'created_by' => $this->whenLoaded(
                'creator',
                fn () => $this->creator
                    ? [
                        'id' => $this->creator->id,
                        'name' => $this->creator->name,
                        'email' => $this->creator->email,
                    ]
                    : null
            ),

            'updated_by' => $this->whenLoaded(
                'updater',
                fn () => $this->updater
                    ? [
                        'id' => $this->updater->id,
                        'name' => $this->updater->name,
                        'email' => $this->updater->email,
                    ]
                    : null
            ),

            'deleted_by' => $this->whenLoaded(
                'deleter',
                fn () => $this->deleter
                    ? [
                        'id' => $this->deleter->id,
                        'name' => $this->deleter->name,
                        'email' => $this->deleter->email,
                    ]
                    : null
            ),

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

            'deleted_at' => $this->deleted_at,
        ];
    }
}