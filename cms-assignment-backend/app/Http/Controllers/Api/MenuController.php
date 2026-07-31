<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use App\Http\Resources\MenuResource;
use App\Models\Menu;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use OpenApi\Attributes as OA;

class MenuController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(
                'permission:menu.view',
                only: ['index', 'show', 'all']
            ),
            new Middleware('permission:menu.create', only: ['store']),
            new Middleware('permission:menu.edit', only: ['update']),
            new Middleware('permission:menu.delete', only: ['destroy']),
        ];
    }

    /**
     * GET /menus
     */
    #[OA\Get(
        path: "/menus",
        summary: "List Menus",
        tags: ["Menus"],
        security: [["sanctum" => []]]
    )]
    #[OA\Response(
        response: 200,
        description: "Menus retrieved successfully"
    )]

    public function index()
    {
        $menus = Menu::with('children')
            ->orderBy('sort_order')
            ->paginate(10);

        return MenuResource::collection($menus);
    }

    /**
     * POST /menus
     */
    #[OA\Post(
        path: "/menus",
        summary: "Create Menu",
        tags: ["Menus"],
        security: [["sanctum" => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["title"],
            properties: [
                new OA\Property(property: "parent_id", type: "integer", nullable: true, example: 1),
                new OA\Property(property: "title", type: "string", example: "About Us"),
                new OA\Property(property: "slug", type: "string", example: "about-us"),
                new OA\Property(property: "is_active", type: "boolean", example: true),
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: "Menu created successfully"
    )]
    #[OA\Response(
        response: 422,
        description: "Validation failed"
    )]

    public function store(StoreMenuRequest $request)
    {
        $sortOrder = Menu::where('parent_id', $request->parent_id)
            ->max('sort_order');

        $sortOrder = $sortOrder ? $sortOrder + 1 : 1;

        $menu = Menu::create([
            'title'      => $request->title,
            'slug'       => $request->slug,
            'parent_id'  => $request->parent_id,
            'sort_order' => $sortOrder,
            'is_active'  => $request->boolean('is_active'),
        ]);

        return new MenuResource(
            $menu->fresh()->load('children')
        );
    }

    /**
     * GET /menus/{menu}
     */
    #[OA\Get(
        path: "/menus/{menu}",
        summary: "Show Menu",
        tags: ["Menus"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "menu",
        in: "path",
        required: true,
        description: "Menu ID",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Menu retrieved successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "Menu not found"
    )]

    public function show(Menu $menu)
    {
        $menu->load('children');

        return new MenuResource($menu);
    }

    /**
     * PUT /menus/{menu}
     */
    #[OA\Put(
        path: "/menus/{menu}",
        summary: "Update Menu",
        tags: ["Menus"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "menu",
        in: "path",
        required: true,
        description: "Menu ID",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["title"],
            properties: [
                new OA\Property(property: "parent_id", type: "integer", nullable: true, example: 1),
                new OA\Property(property: "title", type: "string", example: "Updated Menu"),
                new OA\Property(property: "slug", type: "string", example: "updated-menu"),
                new OA\Property(property: "is_active", type: "boolean", example: true),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: "Menu updated successfully"
    )]
    #[OA\Response(
        response: 422,
        description: "Validation failed"
    )]

    public function update(UpdateMenuRequest $request, Menu $menu)
    {
        $menu->update([
            'parent_id' => $request->parent_id,
            'title' => $request->title,
            'slug' => $request->slug,
            'is_active' => $request->boolean('is_active'),
        ]);

        return new MenuResource(
            $menu->fresh()->load('children')
        );
    }

    /**
     * DELETE /menus/{menu}
     */
    #[OA\Delete(
        path: "/menus/{menu}",
        summary: "Delete Menu",
        tags: ["Menus"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "menu",
        in: "path",
        required: true,
        description: "Menu ID",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Menu deleted successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "Menu not found"
    )]
    public function destroy(Menu $menu)
    {
        $menu->delete();

        return response()->json([
            'message' => 'Menu deleted successfully.'
        ], 200);
    }

    /**
     * GET /menus/all
     */
    #[OA\Get(
        path: "/menus/all",
        summary: "Get all menus",
        tags: ["Menus"],
        security: [["sanctum" => []]]
    )]
    #[OA\Response(
        response: 200,
        description: "All menus retrieved successfully"
    )]
    public function all()
    {
        $menus = Menu::with('children')
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();

        return MenuResource::collection($menus);
    }
}