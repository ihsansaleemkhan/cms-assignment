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
use App\Http\Requests\ReorderMenuRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class MenuController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(
                'permission:menu.view',
                only: ['index', 'show', 'all']
            ),

            new Middleware(
                'permission:menu.create',
                only: ['store']
            ),

            new Middleware(
                'permission:menu.edit',
                only: ['update', 'reorder']
            ),

            new Middleware(
                'permission:menu.delete',
                only: ['destroy']
            ),

            new Middleware(
                'permission:menu.trash.view',
                only: ['trash']
            ),

            new Middleware(
                'permission:menu.restore',
                only: ['restore']
            ),

            new Middleware(
                'permission:menu.force_delete',
                only: ['forceDelete']
            ),
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
        $query = Menu::with([
            'creator:id,name,email',
            'updater:id,name,email',
            'deleter:id,name,email',
            'children.creator:id,name,email',
            'children.updater:id,name,email',
            'children.deleter:id,name,email',
        ])->whereNull('parent_id');

        if (request()->filled('search')) {

            $search = request('search');

            $query->where(function ($q) use ($search) {

                $q->where('title','like',"%$search%")
                ->orWhere('slug','like',"%$search%")
                ->orWhereHas('children', function ($child) use ($search){

                        $child->where('title','like',"%$search%")
                            ->orWhere('slug','like',"%$search%");

                });

            });
        }

        $menus = $query
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
            $menu->fresh()->load([
                'children',
                'creator:id,name,email',
                'updater:id,name,email',
                'deleter:id,name,email',
            ])
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
        $menu->load([
            'creator:id,name,email',
            'updater:id,name,email',
            'deleter:id,name,email',
            'children.creator:id,name,email',
            'children.updater:id,name,email',
            'children.deleter:id,name,email',
        ]);

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
            $menu->fresh()->load([
                'children',
                'creator:id,name,email',
                'updater:id,name,email',
                'deleter:id,name,email',
            ])
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
        description: "Menu moved to trash successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "Menu not found"
    )]
    public function destroy(Menu $menu)
    {
        $menu->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu moved to trash successfully.',
        ]);
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
        $menus = Menu::with([
                'creator:id,name,email',
                'updater:id,name,email',
                'deleter:id,name,email',
                'children.creator:id,name,email',
                'children.updater:id,name,email',
                'children.deleter:id,name,email',
            ])
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();

        return MenuResource::collection($menus);
    }


    /**
     * PUT /menus/reorder
     */
    #[OA\Put(
        path: "/menus/reorder",
        summary: "Reorder menus",
        tags: ["Menus"],
        security: [["sanctum" => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["items"],
            properties: [
                new OA\Property(
                    property: "items",
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(
                                property: "id",
                                type: "integer"
                            ),
                            new OA\Property(
                                property: "parent_id",
                                type: "integer",
                                nullable: true
                            ),
                            new OA\Property(
                                property: "sort_order",
                                type: "integer"
                            ),
                        ]
                    )
                ),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: "Menu order updated successfully"
    )]
   public function reorder(ReorderMenuRequest $request)
    {
        DB::beginTransaction();

        try {

            foreach ($request->input('menus') as $menu) {

                Menu::findOrFail($menu['id'])->update([
                    'parent_id'  => $menu['parent_id'],
                    'sort_order' => $menu['sort_order'],
                ]);

            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Menus reordered successfully.',
            ]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'line'    => $e->getLine(),
                'file'    => $e->getFile(),
            ], 500);

        }
    }

    //GET /menus/trash
    #[OA\Get(
    path: "/menus/trash",
    summary: "List deleted menus",
    description: "Returns paginated soft-deleted menus.",
    operationId: "listDeletedMenus",
    tags: ["Menu Trash"],
    security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "search",
        in: "query",
        required: false,
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Response(
        response: 200,
        description: "Deleted menus retrieved successfully"
    )]
    public function trash(Request $request)
    {
        $query = Menu::onlyTrashed()->with([
            'creator:id,name,email',
            'updater:id,name,email',
            'deleter:id,name,email',
        ]);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'like', '%' . $search . '%')
                    ->orWhere('slug', 'like', '%' . $search . '%');
            });
        }

        $menus = $query
            ->latest('deleted_at')
            ->paginate(10)
            ->withQueryString();

        return MenuResource::collection($menus);
    }

    //POST /menus/{id}/restore
    #[OA\Post(
    path: "/menus/{id}/restore",
    summary: "Restore deleted menu",
    description: "Restores a soft-deleted menu.",
    operationId: "restoreDeletedMenu",
    tags: ["Menu Trash"],
    security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Menu restored successfully"
    )]
    #[OA\Response(
        response: 422,
        description: "Parent menu must be restored first"
    )]
    public function restore(int $id)
    {
        $menu = Menu::onlyTrashed()->findOrFail($id);

        if ($menu->parent_id) {
            $parent = Menu::withTrashed()->find($menu->parent_id);

            if (!$parent || $parent->trashed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Restore the parent menu before restoring this menu.',
                ], 422);
            }
        }

        $menu->restore();

        return response()->json([
            'success' => true,
            'message' => 'Menu restored successfully.',
            'data' => new MenuResource(
                $menu->fresh()->load([
                    'children',
                    'creator:id,name,email',
                    'updater:id,name,email',
                    'deleter:id,name,email',
                ])
            ),
        ]);
    }

    //Delete /menus/{id}/force-delete
    #[OA\Delete(
    path: "/menus/{id}/force-delete",
    summary: "Permanently delete menu",
    description: "Permanently deletes an empty soft-deleted menu.",
    operationId: "forceDeleteMenu",
    tags: ["Menu Trash"],
    security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "id",
        in: "path",
        required: true,
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Menu permanently deleted successfully"
    )]
    #[OA\Response(
        response: 422,
        description: "Menu still has related pages or child menus"
    )]
    public function forceDelete(int $id)
    {
        $menu = Menu::onlyTrashed()->findOrFail($id);

        $hasPages = $menu
            ->pages()
            ->withTrashed()
            ->exists();

        $hasChildren = $menu
            ->children()
            ->withTrashed()
            ->exists();

        if ($hasPages || $hasChildren) {
            return response()->json([
                'success' => false,
                'message' => 'Permanently delete or move all related pages and child menus first.',
            ], 422);
        }

        $menu->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Menu permanently deleted successfully.',
        ]);
    }
}


