<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(
    name: "Users",
    description: "User Management APIs"
)]
class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:user.view', only: ['index', 'show']),
            new Middleware('permission:user.create', only: ['store']),
            new Middleware('permission:user.edit', only: ['update']),
            new Middleware('permission:user.delete', only: ['destroy']),
        ];
    }
 
    /**
     * GET /users
     */
    #[OA\Get(
        path: "/users",
        summary: "List Users",
        tags: ["Users"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "search",
        in: "query",
        required: false,
        description: "Search users by name or email",
        schema: new OA\Schema(type: "string")
    )]
    #[OA\Response(
        response: 200,
        description: "Users retrieved successfully"
    )]

    public function index(Request $request)
    {
        $query = User::with('roles');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $users = $query
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return UserResource::collection($users);
    }

    /**
     * POST /users
     */
    #[OA\Post(
        path: "/users",
        summary: "Create User",
        tags: ["Users"],
        security: [["sanctum" => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["name", "email", "password", "role"],
            properties: [
                new OA\Property(
                    property: "name",
                    type: "string",
                    example: "John Doe"
                ),
                new OA\Property(
                    property: "email",
                    type: "string",
                    format: "email",
                    example: "john@example.com"
                ),
                new OA\Property(
                    property: "password",
                    type: "string",
                    format: "password",
                    example: "password123"
                ),
               new OA\Property(
                    property: "password_confirmation",
                    type: "string",
                    format: "password",
                    example: "password123"
                ),
                new OA\Property(
                    property: "role",
                    type: "string",
                    example: "Admin"
                )
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: "User created successfully"
    )]
    #[OA\Response(
        response: 422,
        description: "Validation failed"
    )]

    public function store(StoreUserRequest $request)
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->role);

        return (new UserResource(
            $user->load('roles')
        ))
        ->response()
        ->setStatusCode(201);
    }

    /**
     * GET /users/{user}
     */
    #[OA\Get(
        path: "/users/{user}",
        summary: "Show User",
        tags: ["Users"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "user",
        in: "path",
        required: true,
        description: "User ID",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "User retrieved successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "User not found"
    )]
    public function show(User $user)
    {
        return new UserResource(
            $user->load('roles')
        );
    }

    /**
     * PUT /users/{user}
     */
    #[OA\Put(
        path: "/users/{user}",
        summary: "Update User",
        tags: ["Users"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "user",
        in: "path",
        required: true,
        description: "User ID",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["name", "email", "role"],
            properties: [
                new OA\Property(
                    property: "name",
                    type: "string",
                    example: "John Doe"
                ),
                new OA\Property(
                    property: "email",
                    type: "string",
                    format: "email",
                    example: "john@example.com"
                ),
                new OA\Property(
                    property: "password",
                    type: "string",
                    format: "password",
                    nullable: true,
                    example: "newpassword123"
                ),
                new OA\Property(
                    property: "password_confirmation",
                    type: "string",
                    format: "password",
                    nullable: true,
                    example: "newpassword123"
                ),
                new OA\Property(
                    property: "role",
                    type: "string",
                    example: "Moderator"
                )
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: "User updated successfully"
    )]
    #[OA\Response(
        response: 422,
        description: "Validation failed"
    )]

    public function update(UpdateUserRequest $request, User $user)
    {
        $data = [
            'name'  => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        $user->syncRoles([$request->role]);

        return new UserResource(
            $user->fresh()->load('roles')
        );
    }

    /**
     * DELETE /users/{user}
     */
    #[OA\Delete(
        path: "/users/{user}",
        summary: "Delete User",
        tags: ["Users"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(
        name: "user",
        in: "path",
        required: true,
        description: "User ID",
        schema: new OA\Schema(type: "integer")
    )]
    #[OA\Response(
        response: 200,
        description: "User deleted successfully"
    )]
    #[OA\Response(
        response: 404,
        description: "User not found"
    )]

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.'
        ]);
    }
}