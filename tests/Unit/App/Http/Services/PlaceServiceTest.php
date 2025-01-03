<?php

namespace Tests\Unit\App\Http\Services;

use App\Http\Repositories\PlaceRepositoryInterface;
use App\Http\Services\PlaceService;
use App\Models\Place;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use RuntimeException;
use Tests\TestCase;

class PlaceServiceTest extends TestCase
{
    use RefreshDatabase;

    private PlaceService $placeService;
    private PlaceRepositoryInterface|Mockery\MockInterface $placeRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->placeRepository = Mockery::mock(PlaceRepositoryInterface::class);
        $this->placeService = new PlaceService($this->placeRepository);
    }

    #[Test]
    public function it_shows_up_to_ten_places_ordered_by_id(): void
    {
        $places = new Collection([Place::factory()->make(['id' => 1]), Place::factory()->make(['id' => 2]), Place::factory()->make(['id' => 3]),]);

        $this->placeRepository->shouldReceive('all')->once()->andReturn($places);

        $result = $this->placeService->all();

        $this->assertCount(3, $result);
        $this->assertEquals(1, $result->first()->id);
        $this->assertEquals(3, $result->last()->id);
    }

    #[Test]
    public function it_saves_a_place(): void
    {
        $data = ['name' => 'Test Place', 'location_name' => 'Test Location', 'category' => 'Test Category', 'points' => ['type' => 'Point', 'coordinates' => ['lat' => 2, 'lon' => 2,], 'place_id' => 1,],];

        $place = Place::factory()->make($data);
        $place->exists = true;

        $this->placeRepository->shouldReceive('save')->once()->with($data)->andReturn($place);

        $result = $this->placeService->save($data);

        $this->assertTrue($result->exists);
        $this->assertEquals('Test Place', $result->name);
    }

    #[Test]
    public function it_updates_a_place(): void
    {
        $place = Place::factory()->make();
        $data = ['name' => 'Updated Place', 'location_name' => 'Updated Location', 'category' => 'Updated Category', 'points' => ['type' => 'Point', 'coordinates' => ['lat' => 2, 'lon' => 2,], 'place_id' => 1,],];

        $updatedPlace = Place::factory()->make($data);
        $updatedPlace->wasChanged = true;

        $this->placeRepository->shouldReceive('update')->once()->with($data, $place)->andReturn($updatedPlace);

        $result = $this->placeService->update($data, $place);

        $this->assertEquals('Updated Place', $result->name);
    }

    #[Test]
    public function it_deletes_a_place(): void
    {
        $place = Place::factory()->make();
        $deletedPlace = Place::factory()->make();
        $deletedPlace->exists = false;

        $this->placeRepository->shouldReceive('delete')->once()->with($place)->andReturn($deletedPlace);

        $result = $this->placeService->delete($place);

        $this->assertFalse($result->exists);
    }

    #[Test]
    public function it_handles_repository_exceptions(): void
    {
        $this->placeRepository->shouldReceive('all')->once()->andThrow(new RuntimeException('Database error'));

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Database error');

        $this->placeService->all();
    }
}
