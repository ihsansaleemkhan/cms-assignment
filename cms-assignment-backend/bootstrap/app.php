<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Spatie\Permission\Exceptions\UnauthorizedException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware) {

            $middleware->redirectGuestsTo(function (Request $request) {

                if ($request->is('api/*')) {
                    return null;
                }

                return route('login');
            });

            $middleware->alias([
                'permission' => PermissionMiddleware::class,
                'role' => RoleMiddleware::class,
                'role_or_permission' => RoleOrPermissionMiddleware::class,
            ]);

        })

    ->withExceptions(function (Exceptions $exceptions) {

        // 401
        $exceptions->render(function (AuthenticationException $e, Request $request) {

            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                ], 401);
            }

        });

        // 403
        $exceptions->render(function (AuthorizationException $e, Request $request) {

            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Forbidden.',
                ], 403);
            }

        });

        $exceptions->render(function (UnauthorizedException $e, Request $request) {

            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to perform this action.',
                ], 403);
            }

        });

        // 404
        $exceptions->render(function (
            ModelNotFoundException|NotFoundHttpException $e,
            Request $request
        ) {

            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resource not found.',
                ], 404);
            }

        });

        // 422
        $exceptions->render(function (ValidationException $e, Request $request) {

            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors' => $e->errors(),
                ], 422);
            }

        });

        // 500
        $exceptions->render(function (Throwable $e, Request $request) {

            if ($request->is('api/*')) {

                report($e);

                return response()->json([
                    'success' => false,
                    'message' => 'Internal server error.',
                ], 500);
            }

        });

    })

    ->create();