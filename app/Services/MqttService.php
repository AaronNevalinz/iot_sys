<?php

namespace App\Services;

use Mosquitto\Client;

class MqttService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->setCredentials(env('MQTT_USERNAME'), env('MQTT_PASSWORD'));
        $this->client->connect(env('MQTT_BROKER'), env('MQTT_PORT'));
    }

    public function publish($topic, $message)
    {
        $this->client->publish($topic, json_encode($message), 0);
    }

    public function subscribe($topic, $callback)
    {
        $this->client->onMessage($callback);
        $this->client->subscribe($topic, 0);
        $this->client->loopForever();
    }
}
