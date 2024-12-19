<?php

namespace Tests\Unit\App\Http\Services;

use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use JsonException;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use App\Models\Place;
use App\Http\Services\PlaceService;
use Throwable;

class PlaceServiceTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->placeService = new PlaceService();
    }

    /**
     * @throws Exception
     */
    #[Test]
    public function it_shows_up_to_ten_places_ordered_by_id(): void
    {
        Place::factory(10)->create();
        $places = $this->placeService->all();
        $firstPlace = $places->first();
        $lastPlace = $places->last();

        $this->assertCount(10, $places);
        $this->assertEquals($firstPlace->id, $places->first()->id);
        $this->assertEquals($lastPlace->id, $places->last()->id);
    }

    /**
     * @throws Throwable
     * @throws JsonException
     */
    #[Test]
    public function it_saves_a_place(): void
    {
        $place = $this->placeService->save([
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'point' => [
                'type' => 'Point',
                'coordinates' => [
                    'lat' => 2,
                    'lon' => 2,
                ],
                'place_id' => 1,
            ],
        ]);

        $this->assertDatabaseHas('places', [
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'point' => json_encode([
                'type' => 'Point',
                'coordinates' => [
                    'lat' => 2,
                    'lon' => 2,
                ],
                'place_id' => 1,
            ], JSON_THROW_ON_ERROR),
        ]);
        $this->assertTrue($place->exists);
    }

    #[Test]
    public function it_updates_a_place(): void
    {
        $place = Place::factory()->create();
        $updatedPlace = $this->placeService->update([
            'name' => 'Updated Place',
            'location_name' => 'Updated Location',
            'category' => 'Updated Category',
            'point' => [
                'type' => 'Point',
                'coordinates' => [
                    'lat' => 2,
                    'lon' => 2,
                ],
                'place_id' => 1,
            ],
        ], $place);

        $this->assertDatabaseHas('places', [
            'name' => 'Updated Place',
            'location_name' => 'Updated Location',
            'category' => 'Updated Category',
            'point' => json_encode([
                'type' => 'Point',
                'coordinates' => [
                    'lat' => 2,
                    'lon' => 2,
                ],
                'place_id' => 1,
            ]),
        ]);
        $this->assertTrue($updatedPlace->wasChanged());
    }

    #[Test]
    public function it_deletes_a_place(): void
    {
        $place = Place::factory()->create();
        $deletedPlace = $this->placeService->delete($place);

        $this->assertDatabaseEmpty('places');
        $this->assertTrue($deletedPlace->doesntExist());
    }
}
