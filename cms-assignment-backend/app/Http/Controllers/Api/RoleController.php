<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Models\Role;

class RoleController extends Controller implements HasMiddleware
{
    /**
     * GET /roles
     */
    public function index()
    {
        $roles = Role::with('permissions')
            ->latest()
            ->paginate(10);

        return RoleResource::collection($roles);
    }

    /**
     * POST /roles
     */
    public function store(StoreRoleRequest $request)
    {
        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($request->permissions);

        return (new RoleResource(
            $role->load('permissions')
        ))
        ->response()
        ->setStatusCode(201);
    }

    /**
     * GET /roles/{role}
     */
    public function show(Role $role)
    {
        return new RoleResource(
            $role->load('permissions')
        );
    }

    /**
     * PUT /roles/{role}
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $role->update([
            'name' => $request->name,
        ]);

        $role->syncPermissions($request->permissions);

        return new RoleResource(
            $role->fresh()->load('permissions')
        );
    }

    /**
     * DELETE /roles/{role}
     */
    public function destroy(Role $role)
    {
        $role->delete();

        return response()->json([
            'message' => 'Role deleted successfully.',
        ]);
    }

    public static function middleware(): array
    {
        return [

            new Middleware(
                'permission:role.view',
                only: ['index', 'show']
            ),

            new Middleware(
                'permission:role.create',
                only: ['store']
            ),

            new Middleware(
                'permission:role.edit',
                only: ['update']
            ),

            new Middleware(
                'permission:role.delete',
                only: ['destroy']
            ),

        ];
    }
}