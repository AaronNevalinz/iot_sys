<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeviceAnalytics extends Model
{
    use HasFactory;

    protected $fillable = ['device_id', 'recorded_at', 'current', 'rpm', 'efficiency', 'power_output', 'phase_voltage_l1', 'phase_voltage_l2', 'phase_voltage_l3', 'panel_voltage', 'solar_power_input', 'ambient_temperature', 'temperature', 'max_voltage', 'min_voltage', 'error_code'];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}
