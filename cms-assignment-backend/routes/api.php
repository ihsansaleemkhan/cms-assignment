<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('menus/all', [MenuController::class, 'all'])
    ->middleware('permission:menu.view');

    Route::put('/menus/reorder', [MenuController::class, 'reorder']);


    Route::apiResource('menus', MenuController::class);
    Route::apiResource('pages', PageController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class);
    
    Route::get(
    '/permissions',
    [PermissionController::class, 'index']
);
});