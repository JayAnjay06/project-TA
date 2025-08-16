<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\Api\AuthController;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'show']); 
Route::middleware('auth:sanctum')->put('/user', [AuthController::class, 'update']); 
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']); 

use App\Http\Controllers\Api\LokasiController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('lokasi', [LokasiController::class, 'index']);
    Route::post('lokasi', [LokasiController::class, 'store']);
    Route::get('lokasi/{id}', [LokasiController::class, 'show']);
    Route::put('lokasi/{id}', [LokasiController::class, 'update']);
    Route::delete('lokasi/{id}', [LokasiController::class, 'destroy']);
});

use App\Http\Controllers\Api\JenisMangroveController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('jenis-mangrove', [JenisMangroveController::class, 'index']);
    Route::post('jenis-mangrove', [JenisMangroveController::class, 'store']);
    Route::get('jenis-mangrove/{id}', [JenisMangroveController::class, 'show']);
    Route::put('jenis-mangrove/{id}', [JenisMangroveController::class, 'update']);
    Route::delete('jenis-mangrove/{id}', [JenisMangroveController::class, 'destroy']);
});

use App\Http\Controllers\Api\DataMangroveController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('data-mangrove', [DataMangroveController::class, 'index']);
    Route::get('data-mangrove/{id}', [DataMangroveController::class, 'show']);
    Route::post('data-mangrove', [DataMangroveController::class, 'store']);
    Route::put('data-mangrove/{id}', [DataMangroveController::class, 'update']);
    Route::delete('data-mangrove/{id}', [DataMangroveController::class, 'destroy']);
});

use App\Http\Controllers\Api\MonitoringController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('monitoring', [MonitoringController::class, 'index']);
    Route::get('monitoring/{id}', [MonitoringController::class, 'show']);
    Route::post('monitoring', [MonitoringController::class, 'store']);
    Route::put('monitoring/{id}', [MonitoringController::class, 'update']);
    Route::delete('monitoring/{id}', [MonitoringController::class, 'destroy']);
});

use App\Http\Controllers\Api\PeringatanDiniController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('peringatan-dini', [PeringatanDiniController::class, 'index']);
    Route::get('peringatan-dini/{id}', [PeringatanDiniController::class, 'show']);
    Route::post('peringatan-dini', [PeringatanDiniController::class, 'store']);
    Route::put('peringatan-dini/{id}', [PeringatanDiniController::class, 'update']);
    Route::delete('peringatan-dini/{id}', [PeringatanDiniController::class, 'destroy']);
});

use App\Http\Controllers\Api\EdukasiController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('edukasi', [EdukasiController::class, 'index']);
    Route::get('edukasi/{id}', [EdukasiController::class, 'show']);
    Route::post('edukasi', [EdukasiController::class, 'store']);
    Route::put('edukasi/{id}', [EdukasiController::class, 'update']);
    Route::delete('edukasi/{id}', [EdukasiController::class, 'destroy']);
});

use App\Http\Controllers\Api\LaporanController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('laporan', [LaporanController::class, 'index']);
    Route::get('laporan/{id}', [LaporanController::class, 'show']);
    Route::post('laporan', [LaporanController::class, 'store']);
    Route::put('laporan/{id}', [LaporanController::class, 'update']);
    Route::delete('laporan/{id}', [LaporanController::class, 'destroy']);
});
