<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        Log::info('CheckRole middleware called', ['role' => $role]);

        if (!auth()->user() || auth()->user()->role !== $role) {
            return redirect('/'); // Redirect to home or unauthorized page
        }

        return $next($request);
    }
}

