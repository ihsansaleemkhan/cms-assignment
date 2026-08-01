<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicMenuResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * This resource returns the nested public navigation tree.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'parent_id' => $this->parent_id,

            'title' => $this->title,

            'slug' => $this->slug,

            'sort_order' => $this->sort_order,

            'pages' => PublicPageListResource::collection(
                $this->whenLoaded('pages')
            ),

            'children' => PublicMenuResource::collection(
                $this->whenLoaded('children')
            ),
        ];
    }
}