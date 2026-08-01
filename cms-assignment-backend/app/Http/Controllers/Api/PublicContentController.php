<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicMenuResource;
use App\Http\Resources\PublicPageListResource;
use App\Http\Resources\PublicPageResource;
use App\Models\Menu;
use App\Models\Page;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class PublicContentController extends Controller
{
    /**
     * Return the public nested menu tree.
     */
    #[OA\Get(
        path: "/public/menus",
        summary: "Get public menus",
        description: "Returns active nested menus with published pages whose publish date is due.",
        operationId: "getPublicMenus",
        tags: ["Public Content"]
    )]
    #[OA\Response(
        response: 200,
        description: "Public menus retrieved successfully"
    )]
    public function menus()
    {
        $menus = Menu::query()
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->with([
                'pages' => function ($query) {

                    $this->applyPublicPageScope(
                        $query
                    )
                        ->select([
                            'id',
                            'menu_id',
                            'title',
                            'title_ar',
                            'slug',
                            'cover_image',
                            'publish_date',
                        ])
                        ->orderBy('publish_date')
                        ->orderBy('id');
                },

                'children' => function ($query) {

                    $query
                        ->where('is_active', true)
                        ->orderBy('sort_order');
                },

                'children.pages' => function ($query) {

                    $this->applyPublicPageScope(
                        $query
                    )
                        ->select([
                            'id',
                            'menu_id',
                            'title',
                            'title_ar',
                            'slug',
                            'cover_image',
                            'publish_date',
                        ])
                        ->orderBy('publish_date')
                        ->orderBy('id');
                },
            ])
            ->orderBy('sort_order')
            ->get();

        return PublicMenuResource::collection(
            $menus
        );
    }

    /**
     * Return a paginated public page list.
     */
    #[OA\Get(
        path: "/public/pages",
        summary: "List public pages",
        description: "Returns published pages that are due and belong to active menus.",
        operationId: "listPublicPages",
        tags: ["Public Content"]
    )]
    #[OA\Parameter(
        name: "search",
        in: "query",
        required: false,
        description: "Search public pages by English title, Arabic title or slug",
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Parameter(
        name: "menu_id",
        in: "query",
        required: false,
        description: "Filter public pages by menu ID",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Public pages retrieved successfully"
    )]
    public function pages(Request $request)
    {
        $query = Page::query()
            ->with([
                'menu:id,title,title_ar,slug,is_active',
            ])
            ->whereHas('menu', function ($menuQuery) {
                $menuQuery->where('is_active', true);
            });

        $this->applyPublicPageScope($query);

       if ($request->filled('search')) {

            $search = $request->search;

            $query->where(function ($builder) use ($search) {

                $builder
                    ->where(
                        'title',
                        'like',
                        '%' . $search . '%'
                    )
                    ->orWhere(
                        'title_ar',
                        'like',
                        '%' . $search . '%'
                    )
                    ->orWhere(
                        'slug',
                        'like',
                        '%' . $search . '%'
                    );
            });
        }

        if ($request->filled('menu_id')) {
            $query->where(
                'menu_id',
                $request->integer('menu_id')
            );
        }

        $pages = $query
            ->latest('publish_date')
            ->latest('id')
            ->paginate(12)
            ->withQueryString();

        return PublicPageListResource::collection($pages);
    }

    /**
     * Return one public page by slug.
     */
    #[OA\Get(
        path: "/public/pages/{slug}",
        summary: "Get public page by slug",
        description: "Returns one published and due page by slug.",
        operationId: "getPublicPage",
        tags: ["Public Content"]
    )]
    #[OA\Parameter(
        name: "slug",
        in: "path",
        required: true,
        description: "Public page slug",
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Response(
        response: 200,
        description: "Public page retrieved successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "Public page not found"
    )]
    public function show(string $slug)
    {
        $query = Page::query()
            ->with([
                'menu:id,title,title_ar,slug,is_active',
            ])
            ->where('slug', $slug)
            ->whereHas('menu', function ($menuQuery) {
                $menuQuery->where('is_active', true);
            });

        $this->applyPublicPageScope($query);

        $page = $query->firstOrFail();

        return new PublicPageResource($page);
    }

    /**
     * Apply the common public-visibility rules.
     */
    private function applyPublicPageScope($query)
    {
        return $query
            ->where('status', 'published')
            ->where(function ($publishQuery) {
                $publishQuery
                    ->whereNull('publish_date')
                    ->orWhere(
                        'publish_date',
                        '<=',
                        now()
                    );
            });
    }
}