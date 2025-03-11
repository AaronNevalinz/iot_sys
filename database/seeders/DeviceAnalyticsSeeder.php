<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Device;
use App\Models\DeviceAnalytics;
use Faker\Factory as Faker;

class DeviceAnalyticsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Fetch all devices
        $devices = Device::all();

        foreach ($devices as $device) {
            // Create multiple analytics records for each device
            for ($i = 0; $i < 100; $i++) {
                DeviceAnalytics::create([
                    'device_id' => $device->id,
                    'recorded_at' => $faker->dateTimeBetween('-1 year', 'now'),
                    'voltage' => $faker->randomFloat(2, 220, 250),
                    'current' => $faker->randomFloat(2, 0, 20),
                    'rpm' => $faker->randomFloat(2, 0, 5000),
                    'efficiency' => $faker->randomFloat(2, 0, 100),
                    'power_output' => $faker->randomFloat(2, 0, 500),
                    'phase_voltage_l1' => $faker->randomFloat(2, 220, 250),
                    'phase_voltage_l2' => $faker->randomFloat(2, 220, 250),
                    'phase_voltage_l3' => $faker->randomFloat(2, 220, 250),
                    'panel_voltage' => $faker->randomFloat(2, 220, 250),
                    'solar_power_input' => $faker->randomFloat(2, 0, 500),
                    'temperature' => $faker->randomFloat(2, 15, 30),
                    'ambient_temperature' => $faker->randomFloat(2, 15, 30),
                    'max_voltage' => $faker->randomFloat(2, 220, 250),
                    'min_voltage' => $faker->randomFloat(2, 220, 250),
                    'error_code' => $faker->optional()->regexify('[A-Z]{3}[0-9]{3}'),
                ]);
            }
        }
    }
}
