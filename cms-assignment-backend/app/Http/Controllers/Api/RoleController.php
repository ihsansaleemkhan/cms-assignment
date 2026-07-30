<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Models\Role;
use OpenApi\Attributes as OA;

class RoleController extends Controller implements HasMiddleware
{
    /**
     * GET /roles
     */
    #[OA\Get(
        path: "/roles",
        summary: "List Roles",
        description: "Returns a paginated list of roles with their permissions.",
        operationId: "listRoles",
        tags: ["Roles"],
        security: [["sanctum" => []]]
    )]
    #[OA\Response(
        response: 200,
        description: "Roles retrieved successfully"
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthenticated"
    )]

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
    #[OA\Post(
    path: "/roles",
    summary: "Create Role",
    description: "Creates a new role and assigns permissions.",
    operationId: "createRole",
    tags: ["Roles"],
    security: [["sanctum" => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["name", "permissions"],
            properties: [
                new OA\Property(
                    property: "name",
                    type: "string",
                    example: "Moderator"
                ),
                new OA\Property(
                    property: "permissions",
                    type: "array",
                    items: new OA\Items(type: "string"),
                    example: [
                        "page.view",
                        "page.create",
                        "page.edit"
                    ]
                )
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: "Role created successfully"
    )]
    #[OA\Response(
        response: 422,
        description: "Validation failed"
    )]

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
    #[OA\Get(
        path: "/roles/{role}",
        summary: "Get Role",
        description: "Returns a role with its permissions.",
        operationId: "showRole",
        tags: ["Roles"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "role",
        description: "Role ID",
        required: true,
        in: "path",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Role retrieved successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "Role not found"
    )]

    public function show(Role $role)
    {
        return new RoleResource(
            $role->load('permissions')
        );
    }

    /**
     * PUT /roles/{role}
     */
    #[OA\Put(
        path: "/roles/{role}",
        summary: "Update Role",
        description: "Updates a role and its permissions.",
        operationId: "updateRole",
        tags: ["Roles"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "role",
        in: "path",
        required: true,
        description: "Role ID",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["name", "permissions"],
            properties: [
                new OA\Property(
                    property: "name",
                    type: "string",
                    example: "Manager"
                ),
                new OA\Property(
                    property: "permissions",
                    type: "array",
                    items: new OA\Items(type: "string"),
                    example: [
                        "page.view",
                        "page.create",
                        "page.edit",
                        "page.delete"
                    ]
                )
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: "Role updated successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "Role not found"
    )]
    #[OA\Response(
        response: 422,
        description: "Validation failed"
    )]
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
    #[OA\Delete(
        path: "/roles/{role}",
        summary: "Delete Role",
        description: "Deletes a role.",
        operationId: "deleteRole",
        tags: ["Roles"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "role",
        in: "path",
        required: true,
        description: "Role ID",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "Role deleted successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "Role not found"
    )]
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