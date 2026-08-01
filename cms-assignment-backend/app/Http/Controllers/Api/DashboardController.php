<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardResource;
use App\Models\Menu;
use App\Models\Page;
use App\Models\User;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use OpenApi\Attributes as OA;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller implements HasMiddleware
{
    /**
     * GET /dashboard
     */
    #[OA\Get(
        path: "/dashboard",
        summary: "Dashboard Overview",
        description: "Returns dashboard statistics, page status, latest pages and latest users.",
        operationId: "dashboardOverview",
        tags: ["Dashboard"],
        security: [["sanctum" => []]]
    )]

    #[OA\Response(
        response: 200,
        description: "Dashboard retrieved successfully"
    )]

    #[OA\Response(
        response: 401,
        description: "Unauthenticated"
    )]

    public function index()
    {
        $dashboard = [

            'statistics' => [

                'menus' => Menu::count(),

                'pages' => Page::count(),

                'users' => User::count(),

                'roles' => Role::count(),

            ],

            'page_status' => [

                'published' => Page::where('status', 'published')->count(),

                'draft' => Page::where('status', 'draft')->count(),

            ],

            'latest_pages' =>

                Page::select(
                    'id',
                    'title',
                    'status',
                    'publish_date'
                )
                ->latest()
                ->take(5)
                ->get(),

            'latest_users' =>

                User::select(
                    'id',
                    'name',
                    'email'
                )
                ->latest()
                ->take(5)
                ->get(),

        ];

        return new DashboardResource($dashboard);
    }

    public static function middleware(): array
    {
        return [

            new Middleware(
                'permission:dashboard.view',
                only: ['index']
            ),

        ];
    }
}