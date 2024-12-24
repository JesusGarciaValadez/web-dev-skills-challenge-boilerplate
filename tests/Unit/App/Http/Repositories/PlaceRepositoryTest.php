<?php

namespace Tests\Unit\App\Http\Repositories;

use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use JsonException;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use App\Models\Place;
use App\Http\Repositories\PlaceRepository;
use RuntimeException;

class PlaceRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private PlaceRepository $placeRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->placeRepository = new PlaceRepository();
    }

    #[Test]
    public function it_retrieves_all_places_ordered_by_id(): void
    {
        Place::factory(10)->create();
        $places = $this->placeRepository->all();
        $firstPlace = $places->first();
        $lastPlace = $places->last();

        $this->assertCount(10, $places);
        $this->assertEquals($firstPlace->id, $places->first()->id);
        $this->assertEquals($lastPlace->id, $places->last()->id);
    }

    #[Test]
    public function it_saves_a_place_to_database(): void
    {
        $place = $this->placeRepository->save([
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'points' => [
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
            'points' => json_encode([
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
    public function it_updates_a_place_in_database(): void
    {
        $place = Place::factory()->create();
        $updatedPlace = $this->placeRepository->update([
            'name' => 'Updated Place',
            'location_name' => 'Updated Location',
            'category' => 'Updated Category',
            'points' => [
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
            'points' => json_encode([
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
    public function it_deletes_a_place_from_database(): void
    {
        $place = Place::factory()->create();
        $deletedPlace = $this->placeRepository->delete($place);

        $this->assertDatabaseEmpty('places');
        $this->assertTrue($deletedPlace->doesntExist());
    }

    #[Test]
    public function it_throws_exception_when_save_fails_with_invalid_data(): void
    {
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Invalid place data');

        $this->placeRepository->save([]);
    }

    #[Test]
    public function it_throws_exception_when_update_fails_with_no_changes(): void
    {
        $place = Place::factory()->create();

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Place not updated');

        $this->placeRepository->update([
            'name' => $place->name,
            'location_name' => $place->location_name,
            'category' => $place->category,
            'points' => $place->points,
        ], $place);
    }

    #[Test]
    public function it_throws_exception_when_delete_fails_with_nonexistent_place(): void
    {
        $place = Place::factory()->make();

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Place does not exist');

        $this->placeRepository->delete($place);
    }
}
