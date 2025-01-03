<?php

namespace Tests\Unit\Database\Migrations;

use App\Models\Place;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use JsonException;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PlacesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @throws JsonException
     */
    #[Test]
    public function it_can_save_all_the_attributes(): void
    {
        Place::factory()->create([
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'points' => [
                'type' => 'Point',
                'coordinates' => [
                    'lat' => 1,
                    'lon' => 1,
                ],
                'place_id' => 1234567890,
                ],
            ]);

        $this->assertDatabaseHas(
            'places',
            [
                'name' => 'Test Place',
                'location_name' => 'Test Location',
                'category' => 'Test Category',
                'points' => json_encode([
                    'type' => 'Point',
                    'coordinates' => [
                        'lat' => 1,
                        'lon' => 1,
                    ],
                    'place_id' => 1234567890,
                ],
                    JSON_THROW_ON_ERROR),
            ]);
    }

    #[Test]
    public function it_wont_save_unsupported_attributes(): void
    {
        $this->expectException(QueryException::class);

        Place::factory()->create([
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'points' => [
                'type' => 'Point',
                'coordinates' => [
                    'lat' => 1,
                    'lon' => 1,
                ],
                'place_id' => 1234567890,
            ],
            'unsupported_attribute' => 'Test Value',
        ]);
    }
}
