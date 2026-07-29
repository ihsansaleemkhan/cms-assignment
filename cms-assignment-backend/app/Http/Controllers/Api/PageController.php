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
    public function index()
    {
        $pages = Page::with('menu')
            ->latest()
            ->paginate(10);

        return PageResource::collection($pages);
    }

    /**
     * POST /pages
     */
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
    public function show(Page $page)
    {
        return new PageResource(
            $page->load('menu')
        );
    }

    /**
     * PUT /pages/{page}
     */
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