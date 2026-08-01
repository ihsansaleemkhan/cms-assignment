<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [

            'statistics' => [

                'menus' => $this['statistics']['menus'],

                'pages' => $this['statistics']['pages'],

                'users' => $this['statistics']['users'],

                'roles' => $this['statistics']['roles'],

            ],

            'page_status' => [

                'published' => $this['page_status']['published'],

                'draft' => $this['page_status']['draft'],

            ],

            'latest_pages' => $this['latest_pages'],

            'latest_users' => $this['latest_users'],

        ];
    }
}