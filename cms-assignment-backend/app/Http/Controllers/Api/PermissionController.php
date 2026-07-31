<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PermissionResource;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use OpenApi\Attributes as OA;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller implements HasMiddleware
{
    /**
     * GET /permissions
     */
    #[OA\Get(
        path: "/permissions",
        summary: "List Permissions",
        description: "Returns all available permissions. Used when creating or editing roles.",
        operationId: "listPermissions",
        tags: ["Roles"],
        security: [["sanctum" => []]]
    )]
    #[OA\Response(
        response: 200,
        description: "Permissions retrieved successfully"
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthenticated"
    )]
    public function index()
    {
        $permissions = Permission::orderBy('name')->get();

        return PermissionResource::collection($permissions);
    }

    public static function middleware(): array
    {
        return [

            new Middleware(
                'permission:role.view',
                only: ['index']
            ),

        ];
    }
}