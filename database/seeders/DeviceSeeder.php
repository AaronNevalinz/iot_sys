<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Device;
use App\Models\User;
use Faker\Factory as Faker;

class DeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Fetch all users
        $users = User::all();

        foreach ($users as $user) {
            // Create at least one device for each user
            Device::create([
                'name' => $faker->word,
                'serial_number' => $faker->unique()->numerify('SN-#####'),
                'user_id' => $user->id,
                'is_on' => $faker->boolean,
            ]);
        }

        // Optionally create additional devices
        for ($i = 0; $i < 50; $i++) {
            Device::create([
                'name' => $faker->word,
                'serial_number' => $faker->unique()->numerify('SN-#####'),
                'user_id' => $faker->randomElement($users)->id,
                'is_on' => $faker->boolean,
            ]);
        }
    }
}
