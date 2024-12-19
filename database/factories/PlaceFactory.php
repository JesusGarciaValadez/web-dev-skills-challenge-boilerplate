<?php

namespace Database\Factories;

use App\Models\Place;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlaceFactory extends Factory
{
    protected $model = Place::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'location_name' => $this->faker->name(),
            'category' => $this->faker->name(),
            'point' => [
                'type' => 'Point',
                'coordinates' => [
                    'lat' => $this->faker->latitude(),
                    'lon' => $this->faker->longitude(),
                ],
                'place_id' => $this->faker->uuid(),
            ],
        ];
    }
}
