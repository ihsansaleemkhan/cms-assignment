<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class PageController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:page.view', only: ['index', 'show']),
            new Middleware('permission:page.create', only: ['store']),
            new Middleware('permission:page.edit', only: ['update']),
            new Middleware('permission:page.delete', only: ['destroy']),
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
        $query = Page::with('menu');

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

        $data['created_by'] = Auth::id();

        $page = Page::create($data);

        return (new PageResource(
            $page->load('menu')
        ))->response()->setStatusCode(201);
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
            $page->load('menu')
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

    public function update(UpdatePageRequest $request, Page $page)
    {
        $data = $request->validated();

        if ($request->hasFile('cover_image')) {

            if ($page->cover_image) {
                Storage::disk('public')->delete($page->cover_image);
            }

            $data['cover_image'] = $request
                ->file('cover_image')
                ->store('pages', 'public');
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $data['updated_by'] = Auth::id();

        $page->update($data);

        return new PageResource(
            $page->fresh()->load('menu')
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
        description: "Page deleted successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "Page not found"
    )]
    public function destroy(Page $page)
    {
        if ($page->cover_image) {
            Storage::disk('public')->delete($page->cover_image);
        }

        $page->delete();

        return response()->json([
            'message' => 'Page deleted successfully.'
        ]);
    }
}