<?php

namespace App\Console\Commands;

use App\Models\DeviceAnalytics;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use Exception;

class MqttSubscriber extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:mqtt-subscriber';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Subscribe to MQTT topic and store data in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // HiveMQ Public Broker (No TLS, No Auth)
        $host = 'broker.hivemq.com';
        $port = 1883;
        $topic = 'iot/device12aaron';

        // Initialize MQTT Client
        $mqtt = new MqttClient($host, $port, 'Laravel_app');
        $connectionSettings = new ConnectionSettings();

        try {
            $mqtt->connect($connectionSettings, true);
            Log::info("Connected to MQTT broker on HiveMQ");

            $mqtt->subscribe($topic, function (string $topic, string $message) {
                Log::info("MQTT Message Received: Topic: $topic, Message: $message");
                
                $data = \json_decode($message, true);

                if (!$data) {
                    Log::error("MQTT Subscriber: Invalid JSON received. Error: " . json_last_error_msg());
                    return;
                }

                Log::info("MQTT Subscriber: Data received: " . json_encode($data));

                


                try{
                    DeviceAnalytics::create([
                        'device_id' => $data['device_id'],
                        'recorded_at' => now(),
                        'voltage' => $data['voltage'],
                        'max_voltage' => $data['max_voltage'],
                        'min_voltage' => $data['min_voltage'],
                        'current' => $data['current'],
                        'rpm' => $data['rpm'],
                        'efficiency' => $data['efficiency'],
                        'power_output' => $data['power_output'],
                        'phase_voltage_l1' => $data['phase_voltage_l1'],
                        'phase_voltage_l2' => $data['phase_voltage_l2'],
                        'phase_voltage_l3' => $data['phase_voltage_l3'],
                        'panel_voltage' => $data['panel_voltage'],
                        'solar_power_input' => $data['solar_power_input'],
                        'ambient_temperature' => $data['ambient_temperature'],
                        'temperature' => $data['temperature'],
                        'error_code' => $data['error_code'],
                    ]);
    
                    Log::info("MQTT Subscriber: Data saved successfully.");
                } catch(Exception $e) {
                    Log::error("MQTT Subscriber: Error saving data to database. Error: " . $e->getMessage());
                }
            }, 0);

            // Handle graceful shutdown
            pcntl_async_signals(true);
            pcntl_signal(SIGTERM, function () use ($mqtt) {
                Log::warning("MQTT process terminated.");
                $mqtt->disconnect();
                exit;
            });

            while ($mqtt->isConnected()) {
                $mqtt->loop(true, true);
                usleep(100000); //avoid high CPU usage
            }
        } catch (Exception $e) {
            Log::error('MQTT Subscriber Error: ' . $e->getMessage());
        } finally {
            $mqtt->disconnect();
        }
    }
}