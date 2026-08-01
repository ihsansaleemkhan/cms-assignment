<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'parent_id' => $this->parent_id,

            'title' => $this->title,

            'title_ar' => $this->title_ar,

            'slug' => $this->slug,

            'sort_order' => $this->sort_order,

            'is_active' => $this->is_active,

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

            'children' => MenuResource::collection(
                $this->whenLoaded('children')
            ),
        ];
    }
}