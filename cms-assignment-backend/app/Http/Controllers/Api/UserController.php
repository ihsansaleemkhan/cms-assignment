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
    public function index()
    {
        $users = User::with('roles')
            ->latest()
            ->paginate(10);

        return UserResource::collection($users);
    }

    /**
     * POST /users
     */
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
    public function show(User $user)
    {
        return new UserResource(
            $user->load('roles')
        );
    }

    /**
     * PUT /users/{user}
     */
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
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.'
        ]);
    }
}