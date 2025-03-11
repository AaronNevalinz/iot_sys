<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    $user = auth()->user();

    if ($user->role === 'admin') {
        return redirect()->route('admin.dashboard');
    } elseif ($user->role === 'user') {
        return redirect()->route('user.dashboard');
    }

    return redirect()->route('login'); // Fallback if role is not recognized
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/devices', [AdminController::class, 'devices'])->name('admin.devices');
    Route::resource('devices', DeviceController::class)->only(['index', 'store', 'update']);
    Route::delete('admin/devices/{id}', [DeviceController::class, 'destroy'])->name('devices.destroy');
    Route::delete('/admin/users/{id}', [AdminController::class, 'destroyUser'])->name('admin.users.destroy');
    Route::get('/admin/dashboard/statistics', [AdminController::class, 'getStatistics'])->name('dashboard.statistics');
    Route::get('/admin/users', [AdminController::class, 'users'])->name('admin.users');
});

Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('/user/dashboard', [UserController::class, 'index'])->name('user.dashboard');
    Route::get('/user/metrics', [UserController::class, 'getMetrics'])->name('user.metrics');
    Route::post('/user/pump/toggle', [UserController::class, 'togglePump'])->name('user.pump.toggle');
    Route::get('/user/devices', [UserController::class, 'devices'])->name('user.devices');
});

// Route to toggle device status for both admin and user
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/user/devices/{id}/toggle', [DeviceController::class, 'toggleDeviceStatus'])->name('devices.toggle');
    Route::get('device/{id}/analytics', [DeviceController::class, 'analytics'])->name('device.analytics');
    Route::get('/device/{deviceId}', [DeviceController::class, 'show']);
    Route::get('/api/device/{deviceId}', [DeviceController::class, 'api']);
});

require __DIR__ . '/auth.php';
