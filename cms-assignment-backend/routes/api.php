<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PublicContentController;

/*
|--------------------------------------------------------------------------
|login
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
|Admin API routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get(
        '/dashboard',
        [DashboardController::class, 'index']
    );

    /*
    |--------------------------------------------------------------------------
    | Page custom routes
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/pages/trash',
        [PageController::class, 'trash']
    );

    Route::post(
        '/pages/{id}/restore',
        [PageController::class, 'restore']
    )->whereNumber('id');

    Route::delete(
        '/pages/{id}/force-delete',
        [PageController::class, 'forceDelete']
    )->whereNumber('id');

    /*
    |--------------------------------------------------------------------------
    | Menu custom routes
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/menus/all',
        [MenuController::class, 'all']
    );

    Route::put(
        '/menus/reorder',
        [MenuController::class, 'reorder']
    );

    Route::get(
        '/menus/trash',
        [MenuController::class, 'trash']
    );

    Route::post(
        '/menus/{id}/restore',
        [MenuController::class, 'restore']
    )->whereNumber('id');

    Route::delete(
        '/menus/{id}/force-delete',
        [MenuController::class, 'forceDelete']
    )->whereNumber('id');

    /*
    |--------------------------------------------------------------------------
    | API resources
    |--------------------------------------------------------------------------
    */

    Route::apiResource('menus', MenuController::class);
    Route::apiResource('pages', PageController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class);

    Route::get(
        '/permissions',
        [PermissionController::class, 'index']
    );
});


/*
|--------------------------------------------------------------------------
| Public content
|--------------------------------------------------------------------------
*/

Route::prefix('public')->group(function () {

    Route::get(
        '/menus',
        [PublicContentController::class, 'menus']
    );

    Route::get(
        '/pages',
        [PublicContentController::class, 'pages']
    );

    Route::get(
        '/pages/{slug}',
        [PublicContentController::class, 'show']
    );

});