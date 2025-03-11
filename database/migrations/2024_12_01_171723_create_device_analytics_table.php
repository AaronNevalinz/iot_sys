<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('device_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->onDelete('cascade');
            $table->timestamp('recorded_at')->useCurrent();
            $table->float('voltage')->nullable();
            $table->float('max_voltage')->nullable();
            $table->float('min_voltage')->nullable();
            $table->float('current')->nullable();
            $table->float('rpm')->nullable();
            $table->float('efficiency')->nullable();
            $table->float('power_output')->nullable();
            $table->float('phase_voltage_l1')->nullable();
            $table->float('phase_voltage_l2')->nullable();
            $table->float('phase_voltage_l3')->nullable();
            $table->float('panel_voltage')->nullable();
            $table->float('solar_power_input')->nullable();
            $table->float('ambient_temperature')->nullable();
            $table->float('temperature')->nullable();
            $table->string('error_code')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_analytics');
    }
};
