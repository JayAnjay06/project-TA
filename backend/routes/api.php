<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\Api\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/profile', [AuthController::class, 'profile']);

use App\Http\Controllers\Api\LokasiController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/lokasis', [LokasiController::class, 'index']);
    Route::post('/lokasis', [LokasiController::class, 'store']);
    Route::get('/lokasis/{id}', [LokasiController::class, 'show']);
    Route::put('/lokasis/{id}', [LokasiController::class, 'update']);
    Route::delete('/lokasis/{id}', [LokasiController::class, 'destroy']);
});

use App\Http\Controllers\Api\JenisMangroveController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/jenis', [JenisMangroveController::class, 'index']);
    Route::post('/jenis', [JenisMangroveController::class, 'store']);
    Route::get('/jenis/{id}', [JenisMangroveController::class, 'show']);
    Route::put('/jenis/{id}', [JenisMangroveController::class, 'update']);
    Route::delete('/jenis/{id}', [JenisMangroveController::class, 'destroy']);
});

use App\Http\Controllers\Api\DataMangroveController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/data', [DataMangroveController::class, 'index']);
    Route::post('/data', [DataMangroveController::class, 'store']);
    Route::get('/data/{id}', [DataMangroveController::class, 'show']);
    Route::put('/data/{id}', [DataMangroveController::class, 'update']);
    Route::delete('/data/{id}', [DataMangroveController::class, 'destroy']);
});

use App\Http\Controllers\Api\MonitoringController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/monitoring', [MonitoringController::class, 'index']);
    Route::post('/monitoring', [MonitoringController::class, 'store']);
    Route::get('/monitoring/{id}', [MonitoringController::class, 'show']);
    Route::put('/monitoring/{id}', [MonitoringController::class, 'update']);
    Route::delete('/monitoring/{id}', [MonitoringController::class, 'destroy']);
});

use App\Http\Controllers\Api\EdukasiController;

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/edukasi', [EdukasiController::class, 'index']);
    Route::post('/edukasi', [EdukasiController::class, 'store']);
    Route::get('/edukasi/{id}', [EdukasiController::class, 'show']);
    Route::put('/edukasi/{id}', [EdukasiController::class, 'update']);
    Route::delete('/edukasi/{id}', [EdukasiController::class, 'destroy']);
});

use App\Http\Controllers\Api\PeringatanController;

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/peringatan', [PeringatanController::class,'index']);
    Route::post('/peringatan', [PeringatanController::class,'store']);
    Route::get('/peringatan/{id}', [PeringatanController::class,'show']);
    Route::put('/peringatan/{id}', [PeringatanController::class,'update']);
    Route::delete('/peringatan/{id}', [PeringatanController::class,'destroy']);
});

use App\Http\Controllers\Api\LaporanController;

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/laporan', [LaporanController::class,'index']);
    Route::post('/laporan', [LaporanController::class,'store']);
    Route::get('/laporan/{id}', [LaporanController::class,'show']);
    Route::put('/laporan/{id}', [LaporanController::class,'update']);
    Route::delete('/laporan/{id}', [LaporanController::class,'destroy']);
});
