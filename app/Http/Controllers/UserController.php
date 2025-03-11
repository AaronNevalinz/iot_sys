<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\DeviceAnalytics;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $devices = Device::where('user_id', $userId)->get();
        
        $deviceData = DeviceAnalytics::whereIn('device_id', $devices->pluck('id'))->get();
        
        $analyticsGroupedByDevice = [];

        foreach ($deviceData as $data) {
            $deviceId = $data->device_id;
            
            if (!isset($analyticsGroupedByDevice[$deviceId])) {
                $analyticsGroupedByDevice[$deviceId] = [
                    'voltage' => [],
                    'current' => [],
                    'temperature' => [],
                    'timestamp' => [],
                    'solar_power_input' => [],
                    'power_output' => [],
                    'panel_voltage' => [],
                    'rpm' => [],
                    'error_code' => [],
                    'ambient_temperature' => [],
                    'efficiency' => [],
                ];
            }

            $analyticsGroupedByDevice[$deviceId]['voltage'][] = $data->voltage;
            $analyticsGroupedByDevice[$deviceId]['current'][] = $data->current;
            $analyticsGroupedByDevice[$deviceId]['temperature'][] = $data->temperature;
            $analyticsGroupedByDevice[$deviceId]['timestamp'][] = $data->recorded_at;
            $analyticsGroupedByDevice[$deviceId]['solar_power_input'][] = $data->solar_power_input;
            $analyticsGroupedByDevice[$deviceId]['power_output'][] = $data->power_output;
            $analyticsGroupedByDevice[$deviceId]['panel_voltage'][] = $data->panel_voltage;
            $analyticsGroupedByDevice[$deviceId]['rpm'][] = $data->rpm;
            $analyticsGroupedByDevice[$deviceId]['error_code'][] = $data->error_code;
            $analyticsGroupedByDevice[$deviceId]['ambient_temperature'][] = $data->ambient_temperature;
            $analyticsGroupedByDevice[$deviceId]['efficiency'][] = $data->efficiency;
        }

        // Calculate statistics
        $stats = [
            'totalDevices' => $devices->count(),
            'activeDevices' => $devices->where('is_on', true)->count(),
            'offlineDevices' => $devices->where('is_on', false)->count(),
            'maintenanceDue' => $devices->where('maintenance_due', true)->count(),
        ];

        return Inertia::render('User/Dashboard', [
            'devices' => $devices,
            'stats' => $stats,
            'analyticsGroupedByDevice' => $analyticsGroupedByDevice,
        ]);
    }

    public function registerDevice(Request $request)
    {
        $request->validate([
            'serial_number' => 'required|string|unique:devices,serial_number',
            'name' => 'required|string|max:255',
        ]);

        Device::create([
            'serial_number' => $request->serial_number,
            'name' => $request->name,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('user.dashboard')->with('success', 'Device registered successfully.');
    }

    public function getMetrics()
    {
        // Fetch and return metrics and historical data
        $metrics = [
            'rpm' => 1200, // Example data
            'voltageImbalance' => 5,
            'powerInput' => 1500,
            'powerOutput' => 1400,
            'temperature' => 75,
            'current' => 10,
        ];

        $historicalData = [
            'voltageImbalance' => [1, 2, 3, 4, 5], // Example historical data
            'current' => [8, 9, 10, 11, 12],
        ];

        return response()->json(['metrics' => $metrics, 'historicalData' => $historicalData]);
    }


    public function devices()
    {
        // Fetch devices allocated to the authenticated user
        $devices = Device::where('user_id', auth()->id())->get();

        // dd($devices);

        // Return the devices to the User/Devices page
        return Inertia::render('User/Devices', ['devices' => $devices]);
    }
}
