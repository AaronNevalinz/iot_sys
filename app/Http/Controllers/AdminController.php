<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $devices = Device::all();
        $users = User::all();
        return Inertia::render('Admin/Dashboard', ['devices' => $devices, 'users' => $users]);
    }

    public function users()
    {
        $users = User::all();
        return Inertia::render('Admin/Users', ['users' => $users]);
    }

    public function getStatistics()
    {
        $totalDevices = Device::count();
        $totalUsers = User::count();

        $activeDevices = Device::where('is_on', true)->count();
        $inactiveDevices = Device::where('is_on', false)->count();

        return response()->json([
            'totalDevices' => $totalDevices,
            'activeDevices' => $activeDevices,
            'inactiveDevices' => $inactiveDevices,
            'totalUsers' => $totalUsers,
        ]);
    }

    public function devices()
    {
        $devices = Device::all();
        $users = User::all();
        return Inertia::render('Admin/Devices', ['devices' => $devices, 'users' => $users]);
    }

    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('admin.users')->with('success', 'User deleted successfully');
    }
}
