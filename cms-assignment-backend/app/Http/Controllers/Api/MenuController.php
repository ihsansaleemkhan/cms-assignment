<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use App\Http\Resources\MenuResource;
use App\Models\Menu;

class MenuController extends Controller
{
    /**
     * GET /menus
     */
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
    public function store(StoreMenuRequest $request)
    {
        $menu = Menu::create($request->validated());

        return (new MenuResource($menu))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * GET /menus/{menu}
     */
    public function show(Menu $menu)
    {
        $menu->load('children');

        return new MenuResource($menu);
    }

    /**
     * PUT /menus/{menu}
     */
    public function update(UpdateMenuRequest $request, Menu $menu)
    {
        $menu->update($request->validated());

        return new MenuResource(
            $menu->fresh()->load('children')
        );
    }

    /**
     * DELETE /menus/{menu}
     */
    public function destroy(Menu $menu)
    {
        $menu->delete();

        return response()->json([
            'message' => 'Menu deleted successfully.'
        ], 200);
    }
}