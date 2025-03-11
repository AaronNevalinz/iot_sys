<?php

namespace App\Http\Controllers;

use App\Models\Device;

use Illuminate\Http\Request;

class DeviceAnalyticsController extends Controller
{
    public function show($id)
    {
        // Fetch device analytics based on the ID
        $device = Device::findOrFail($id); // Assuming you have a Device model

        return inertia('User/DeviceAnalytics', [
            'device' => [
                'name' => $device->name
            ]
        ]);
    }
}
