<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
    path: "/login",
    summary: "Login",
    tags: ["Authentication"]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["email","password"],
            properties: [
                new OA\Property(property: "email", type: "string", example: "admin@cms.com"),
                new OA\Property(property: "password", type: "string", example: "Password@123")
            ]
        )
    )]
    #[OA\Response(response: 200, description: "Login successful")]
    #[OA\Response(response: 401, description: "Invalid credentials")]

    public function login(LoginRequest $request)
    {
        if (! Auth::attempt($request->validated())) {

           return response()->json([
                'message' => 'Invalid credentials.'
            ], 401);
        }

        $user = Auth::user();

        $token = $user->createToken('cms-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    #[OA\Get(
        path: "/me",
        summary: "Get authenticated user",
        description: "Returns the currently authenticated user.",
        operationId: "getAuthenticatedUser",
        tags: ["Authentication"],
        security: [["sanctum" => []]]
    )]
    #[OA\Response(
        response: 200,
        description: "Authenticated user details"
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthenticated"
    )]

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    #[OA\Post(
        path: "/logout",
        summary: "Logout",
        description: "Logs out the authenticated user by revoking the current access token.",
        operationId: "logoutUser",
        tags: ["Authentication"],
        security: [["sanctum" => []]]
    )]
    #[OA\Response(
        response: 200,
        description: "Logout successful"
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthenticated"
    )]
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}