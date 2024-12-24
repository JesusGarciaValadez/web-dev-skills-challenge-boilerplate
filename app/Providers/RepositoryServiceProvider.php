<?php

namespace App\Providers;

use App\Http\Repositories\PlaceRepository;
use App\Http\Repositories\PlaceRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(PlaceRepositoryInterface::class, PlaceRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
