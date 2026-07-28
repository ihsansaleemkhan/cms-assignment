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

            'slug' => $this->slug,

            'sort_order' => $this->sort_order,

            'is_active' => $this->is_active,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

            'children' => MenuResource::collection(
                $this->whenLoaded('children')
            ),
        ];
    }
}