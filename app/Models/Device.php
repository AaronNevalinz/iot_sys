<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'serial_number', 'user_id', 'is_on'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function analytics()
    {
        return $this->hasMany(DeviceAnalytics::class);
    }
}
