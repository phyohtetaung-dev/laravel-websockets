<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes();

Route::middleware('auth')->controller(ChatController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/messages', 'getMessages');
    Route::post('/messages', 'sendMessage');
});
