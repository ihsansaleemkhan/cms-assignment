<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use App\Models\Menu;

class PageController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:page.view', only: ['index', 'show']),
            new Middleware('permission:page.create', only: ['store']),
            new Middleware('permission:page.edit', only: ['update']),
            new Middleware('permission:page.delete', only: ['destroy']),
            new Middleware('permission:page.trash.view',only: ['trash']),
            new Middleware('permission:page.restore',only: ['restore']),
            new Middleware('permission:page.force_delete',only: ['forceDelete']),
        ];
    }
    
    /**
     * GET /pages
     */
    #[OA\Get(
        path: "/pages",
        summary: "List Pages",
        tags: ["Pages"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "search",
        in: "query",
        required: false,
        description: "Search pages by title",
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Parameter(
        name: "menu_id",
        in: "query",
        required: false,
        description: "Filter by menu id",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Parameter(
        name: "status",
        in: "query",
        required: false,
        description: "Filter by page status",
        schema: new OA\Schema(type: "string", example: "published")
    )]
    #[OA\Response(
        response: 200,
        description: "Pages retrieved successfully"
    )]

    public function index(Request $request)
    {
        $query = Page::with([
            'menu',
            'creator:id,name,email',
            'updater:id,name,email',
            'deleter:id,name,email',
        ]);

        // Search by title
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Filter by menu
        if ($request->filled('menu_id')) {
            $query->where('menu_id', $request->menu_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $pages = $query
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return PageResource::collection($pages);
    }

    /**
     * POST /pages
     */
    #[OA\Post(
        path: "/pages",
        summary: "Create Page",
        tags: ["Pages"],
        security: [["sanctum" => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\MediaType(
            mediaType: "multipart/form-data",
            schema: new OA\Schema(
                required: ["menu_id","title","body","status"],
                properties: [
                    new OA\Property(property: "menu_id", type: "integer", example: 1),
                    new OA\Property(property: "title", type: "string", example: "About Us"),
                    new OA\Property(property: "slug", type: "string", example: "about-us"),
                    new OA\Property(property: "body", type: "string", example: "This is page content."),
                    new OA\Property(property: "status", type: "string", example: "published"),
                    new OA\Property(property: "publish_date", type: "string", format: "date-time"),
                    new OA\Property(
                        property: "cover_image",
                        type: "string",
                        format: "binary"
                    )
                ]
            )
        )
    )]
    #[OA\Response(
        response: 201,
        description: "Page created successfully"
    )]
    #[OA\Response(
        response: 422,
        description: "Validation failed"
    )]

    public function store(StorePageRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request
                ->file('cover_image')
                ->store('pages', 'public');
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $page = Page::create($data);

        return (new PageResource(
            $page->fresh()->load([
                'menu',
                'creator:id,name,email',
                'updater:id,name,email',
                'deleter:id,name,email',
            ])
        ))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * GET /pages/{page}
     */
    #[OA\Get(
        path: "/pages/{page}",
        summary: "Show Page",
        tags: ["Pages"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "page",
        in: "path",
        required: true,
        description: "Page ID",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Page retrieved successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "Page not found"
    )]

    public function show(Page $page)
    {
        return new PageResource(
            $page->load([
                'menu',
                'creator:id,name,email',
                'updater:id,name,email',
                'deleter:id,name,email',
            ])
        );
    }

    /**
     * PUT /pages/{page}
     */
    #[OA\Put(
        path: "/pages/{page}",
        summary: "Update Page",
        tags: ["Pages"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "page",
        in: "path",
        required: true,
        description: "Page ID",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\MediaType(
            mediaType: "multipart/form-data",
            schema: new OA\Schema(
                required: ["menu_id","title","body","status"],
                properties: [
                    new OA\Property(property: "menu_id", type: "integer", example: 1),
                    new OA\Property(property: "title", type: "string", example: "Updated Page"),
                    new OA\Property(property: "slug", type: "string", example: "updated-page"),
                    new OA\Property(property: "body", type: "string", example: "Updated page content."),
                    new OA\Property(property: "status", type: "string", example: "draft"),
                    new OA\Property(property: "publish_date", type: "string", format: "date-time"),
                    new OA\Property(
                        property: "cover_image",
                        type: "string",
                        format: "binary"
                    )
                ]
            )
        )
    )]
    #[OA\Response(
        response: 200,
        description: "Page updated successfully"
    )]
    #[OA\Response(
        response: 422,
        description: "Validation failed"
    )]

    public function update(
        UpdatePageRequest $request,
        Page $page
    ) {
        $data = $request->validated();

        if ($request->hasFile('cover_image')) {

            if ($page->cover_image) {
                Storage::disk('public')
                    ->delete($page->cover_image);
            }

            $data['cover_image'] = $request
                ->file('cover_image')
                ->store('pages', 'public');
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $page->update($data);

        return new PageResource(
            $page->fresh()->load([
                'menu',
                'creator:id,name,email',
                'updater:id,name,email',
                'deleter:id,name,email',
            ])
        );
    }

    /**
     * DELETE /pages/{page}
     */
    #[OA\Delete(
        path: "/pages/{page}",
        summary: "Delete Page",
        tags: ["Pages"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "page",
        in: "path",
        required: true,
        description: "Page ID",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Page moved to trash successfully."
    )]
    #[OA\Response(
        response: 404,
        description: "Page not found"
    )]
    public function destroy(Page $page)
    {
        $page->delete();

        return response()->json([
            'success' => true,
            'message' => 'Page moved to trash successfully.',
        ]);
    }


    // GET /pages/trash
    #[OA\Get(
        path: "/pages/trash",
        summary: "List deleted pages",
        description: "Returns paginated soft-deleted pages.",
        operationId: "listDeletedPages",
        tags: ["Page Trash"],
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
        description: "Deleted pages retrieved successfully"
    )]
    #[OA\Response(
        response: 403,
        description: "Forbidden"
    )]
    public function trash(Request $request)
    {
        $query = Page::onlyTrashed()->with([
            'menu',
            'creator:id,name,email',
            'updater:id,name,email',
            'deleter:id,name,email',
        ]);

        if ($request->filled('search')) {
            $query->where(
                'title',
                'like',
                '%' . $request->search . '%'
            );
        }

        if ($request->filled('menu_id')) {
            $query->where('menu_id', $request->menu_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $pages = $query
            ->latest('deleted_at')
            ->paginate(10)
            ->withQueryString();

        return PageResource::collection($pages);
    }


    // POST /pages/{id}/restore
    #[OA\Post(
    path: "/pages/{id}/restore",
    summary: "Restore deleted page",
    description: "Restores a soft-deleted page.",
    operationId: "restoreDeletedPage",
    tags: ["Page Trash"],
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
        description: "Page restored successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "Deleted page not found"
    )]
    #[OA\Response(
        response: 422,
        description: "Related menu must be restored first"
    )]
    public function restore(int $id)
    {
        $page = Page::onlyTrashed()->findOrFail($id);

        $menu = Menu::withTrashed()->find($page->menu_id);

        if (!$menu || $menu->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Restore the related menu before restoring this page.',
            ], 422);
        }

        $page->restore();

        return response()->json([
            'success' => true,
            'message' => 'Page restored successfully.',
            'data' => new PageResource(
                $page->fresh()->load([
                    'menu',
                    'creator:id,name,email',
                    'updater:id,name,email',
                    'deleter:id,name,email',
                ])
            ),
        ]);
    }

    // DELETE /pages/{id}/force-delete
    #[OA\Delete(
        path: "/pages/{id}/force-delete",
        summary: "Permanently delete page",
        description: "Permanently deletes a soft-deleted page and its cover image.",
        operationId: "forceDeletePage",
        tags: ["Page Trash"],
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
        description: "Page permanently deleted successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "Deleted page not found"
    )]
    public function forceDelete(int $id)
    {
        $page = Page::onlyTrashed()->findOrFail($id);

        if (
            $page->cover_image &&
            Storage::disk('public')->exists($page->cover_image)
        ) {
            Storage::disk('public')->delete($page->cover_image);
        }

        $page->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Page permanently deleted successfully.',
        ]);
    }
}