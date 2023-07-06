<?php

namespace App\Providers;

use App\Services\OpenAI;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->bind(OpenAI::class, function () {
            return new OpenAI(config('openai.token'));
        });
    }
}
