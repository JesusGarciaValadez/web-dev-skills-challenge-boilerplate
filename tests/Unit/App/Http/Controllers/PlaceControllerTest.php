<?php

namespace Tests\Unit\App\Http\Controllers;

use App\Http\Controllers\PlaceController;
use App\Http\Requests\UpdatePlaceRequest;
use App\Http\Services\PlaceService;
use App\Models\Place;
use Illuminate\Foundation\Testing\RefreshDatabase;
use JsonException;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use Throwable;
use App\Http\Requests\StorePlaceRequest;
use Illuminate\Database\Eloquent\Collection;

class PlaceControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_has_a_placeService_injected(): void
    {
        $placeService = $this->getMockBuilder(PlaceService::class)
            ->disableOriginalConstructor()
            ->getMock();

        $placeController = new PlaceController($placeService);

        $this->assertInstanceOf(PlaceService::class, $placeController->placeService);
    }

    #[Test]
    public function it_can_return_204_status_if_there_is_no_places(): void
    {
        $placeService = $this->getMockBuilder(PlaceService::class)
            ->disableOriginalConstructor()
            ->getMock();

        $placeService->expects($this->once())
            ->method('all')
            ->willReturn(new Collection([]));

        $placeController = new PlaceController($placeService);

        $response = $placeController->index();

        $this->assertEquals(204, $response->getStatusCode());
    }

    #[Test]
    public function it_can_return_201_status_if_there_are_places_available(): void
    {
        $places = Collection::make([
            new Place([
                'name' => 'Test Place',
                'location_name' => 'Test Location',
                'category' => 'Test Category',
                'point' => '{"type":"Point","coordinates":{"lat":1,"lon":1},"place_id":"test-id"}'
            ])
        ]);

        $placeService = $this->getMockBuilder(PlaceService::class)
            ->disableOriginalConstructor()
            ->getMock();

        $placeService->expects($this->once())
            ->method('all')
            ->willReturn($places);

        $placeController = new PlaceController($placeService);

        $response = $placeController->index();

        $this->assertEquals(200, $response->getStatusCode());
    }

    /**
     * @throws Throwable
     * @throws JsonException
     */
    #[Test]
    public function it_can_return_201_status_if_the_place_is_created(): void
    {
        $place = new Place([
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'point' => '{"type":"Point","coordinates":{"lat":1,"lon":1},"place_id":"test-id"}'
        ]);
        $place->exists = true;

        $placeService = $this->getMockBuilder(PlaceService::class)
            ->disableOriginalConstructor()
            ->getMock();

        $placeService->expects($this->once())
            ->method('save')
            ->willReturn($place);

        $data = [
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'point' => json_encode([
                'type' => 'Point',
                'coordinates' => [
                    'lat' => 1,
                    'lon' => 1
                ],
                'place_id' => 'test-id'
            ], JSON_THROW_ON_ERROR)
        ];
        $placeController = new PlaceController($placeService);

        $request = StorePlaceRequest::create(
            '/api/places',
            'POST',
            $data
        );

        $request->setContainer($this->app);
        $request->validateResolved();

        $placeController = new PlaceController($placeService);
        $response = $placeController->store($request);

        $this->assertEquals(201, $response->getStatusCode());
    }

    #[Test]
    public function it_returns_a_500_status_if_storing_a_new_place_fails(): void
    {
        $place = new Place([
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'point' => '{"type":"Point","coordinates":{"lat":1,"lon":1},"place_id":"test-id"}'
        ]);
        $place->exists = false;

        $placeService = $this->getMockBuilder(PlaceService::class)
            ->disableOriginalConstructor()
            ->getMock();

        $placeService->expects($this->once())
            ->method('save')
            ->willReturn($place);

        $data = [
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'point' => json_encode([
                'type' => 'Point',
                'coordinates' => [
                    'lat' => 1,
                    'lon' => 1
                ],
                'place_id' => 'test-id'
            ], JSON_THROW_ON_ERROR)
        ];
        $placeController = new PlaceController($placeService);

        $request = StorePlaceRequest::create(
            '/api/places',
            'POST',
            $data
        );

        $request->setContainer($this->app);
        $request->validateResolved();

        $placeController = new PlaceController($placeService);
        $response = $placeController->store($request);

        $this->assertEquals(500, $response->getStatusCode());
    }

    #[Test]
    public function it_returns_the_place_requested_using_the_place_id(): void
    {
        $place = new Place([
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'point' => '{"type":"Point","coordinates":{"lat":1,"lon":1},"place_id":"test-id"}'
        ]);

        $placeService = $this->getMockBuilder(PlaceService::class)
            ->disableOriginalConstructor()
            ->getMock();

        $placeController = new PlaceController($placeService);

        $response = $placeController->show($place);

        $this->assertEquals(200, $response->getStatusCode());
    }

    #[Test]
    public function it_returns_a_204_status_when_updating_an_existing_place(): void
    {
        // Create the original place with initial values
        $place = new Place([
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'point' => '{"type":"Point","coordinates":{"lat":1,"lon":1},"place_id":"test-id"}'
        ]);

        // Create a mock Place that will represent the updated entity
        $updatedPlace = new Place();
        $updatedPlace->fill([
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'point' => '{"type":"Point","coordinates":{"lat":1,"lon":1},"place_id":"test-id"}'
        ]);

        // Mark these as the original values
        $updatedPlace->syncOriginal();

        // Now actually change some values to ensure wasChanged() will return true
        $updatedPlace->fill([
            'name' => 'Different Name',
            'location_name' => 'Different Location',
            'category' => 'Different Category',
            'point' => '{"type":"Point","coordinates":{"lat":2,"lon":2},"place_id":"new-test-id"}'
        ]);

        // This synchronizes the changes to make wasChanged returns true
        $updatedPlace->syncChanges();

        // Mock the service
        $placeService = $this->getMockBuilder(PlaceService::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Ensure that when update is called, it returns the $updatedPlace
        // which now has changed attributes.
        $placeService->expects($this->once())
            ->method('update')
            ->willReturn($updatedPlace);

        $data = [
            'name' => 'Different Name',
            'location_name' => 'Different Location',
            'category' => 'Different Category',
            'point' => json_encode([
                'type' => 'Point',
                'coordinates' => [
                    'lat' => 2,
                    'lon' => 2
                ],
                'place_id' => 'new-test-id'
            ], JSON_THROW_ON_ERROR)
        ];

        $request = UpdatePlaceRequest::create(
            '/api/places/1',
            'PUT',
            $data
        );

        $request->setContainer($this->app);
        $request->validateResolved();

        $placeController = new PlaceController($placeService);
        $response = $placeController->update($request, $place);

        $this->assertEquals(204, $response->getStatusCode());
    }

    #[Test]
    public function it_returns_a_204_status_when_deleting_an_existing_place(): void
    {
        $place = new Place([
            'name' => 'Test Place',
            'location_name' => 'Test Location',
            'category' => 'Test Category',
            'point' => '{"type":"Point","coordinates":{"lat":1,"lon":1},"place_id":"test-id"}'
        ]);

        $placeService = $this->getMockBuilder(PlaceService::class)
            ->disableOriginalConstructor()
            ->getMock();

        $placeService->expects($this->once())
            ->method('delete')
            ->willReturn($place);

        $placeController = new PlaceController($placeService);

        $response = $placeController->destroy($place);

        $this->assertEquals(204, $response->getStatusCode());
    }
}
