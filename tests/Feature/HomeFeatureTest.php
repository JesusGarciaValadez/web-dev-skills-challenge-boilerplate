<?php

namespace Tests\Feature;

use App\Models\Place;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class HomeFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create some test places
        Place::factory()->createMany([
            [
                'name' => 'Test Place 1',
                'location_name' => 'Test Location 1',
                'category' => 'tourism.sights',
                'points' => [
                    'type' => 'Point',
                    'coordinates' => [
                        'lat' => 52.3730796,
                        'lon' => 4.8924534,
                    ],
                    'place_id' => 'test-id-1',
                ],
            ],
            [
                'name' => 'Test Place 2',
                'location_name' => 'Test Location 2',
                'category' => 'leisure.park',
                'points' => [
                    'type' => 'Point',
                    'coordinates' => [
                        'lat' => 52.3680,
                        'lon' => 4.9036,
                    ],
                    'place_id' => 'test-id-2',
                ],
            ],
        ]);
    }

    #[Test]
    public function it_returns_success_response(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    #[Test]
    public function it_returns_view_with_correct_name(): void
    {
        $response = $this->get('/');
        $response->assertViewIs('home');
    }

    #[Test]
    public function it_includes_vite_assets(): void
    {
        $response = $this->get('/');
        $response->assertSee('resources/css/app.css', false);
        $response->assertSee('resources/js/app.js', false);
    }

    #[Test]
    public function it_includes_required_meta_tags(): void
    {
        $response = $this->get('/');

        $response->assertSee('<meta charset="utf-8">', false);
        $response->assertSee('<meta name="viewport" content="width=device-width, initial-scale=1">', false);
        $response->assertSee('<meta name="csrf-token"', false);
    }

    #[Test]
    public function it_includes_app_container(): void
    {
        $response = $this->get('/');
        $response->assertSee('<div id="app">', false);
    }

    #[Test]
    public function it_returns_places_from_api(): void
    {
        $response = $this->getJson('/api/places');

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonStructure([
                '*' => [
                    'name',
                    'location_name',
                    'category',
                    'points' => [
                        'type',
                        'coordinates' => [
                            'lat',
                            'lon',
                        ],
                        'place_id',
                    ],
                ],
            ]);
    }

    #[Test]
    public function it_returns_places_in_correct_order(): void
    {
        $response = $this->getJson('/api/places');

        $response->assertStatus(200)
            ->assertJson([
                [
                    'name' => 'Test Place 1',
                    'location_name' => 'Test Location 1',
                ],
                [
                    'name' => 'Test Place 2',
                    'location_name' => 'Test Location 2',
                ],
            ]);
    }

    #[Test]
    public function it_handles_empty_places_table(): void
    {
        // Clear the places table
        Place::query()->delete();

        $response = $this->getJson('/api/places');

        $response->assertStatus(200)
            ->assertJson([]);
    }

    #[Test]
    public function it_validates_place_creation(): void
    {
        $response = $this->postJson('/api/places', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'location_name',
                'category',
                'points',
            ]);
    }

    #[Test]
    public function it_creates_place_successfully(): void
    {
        $placeData = [
            'name' => 'New Test Place',
            'location_name' => 'New Test Location',
            'category' => 'tourism.museum',
            'points' => json_encode([
                'type' => 'Point',
                'coordinates' => [
                    'lat' => 52.3680,
                    'lon' => 4.9036,
                ],
                'place_id' => 'new-test-id',
            ]),
        ];

        $response = $this->postJson('/api/places', $placeData);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'New Test Place',
                'location_name' => 'New Test Location',
                'category' => 'tourism.museum',
            ]);

        $this->assertDatabaseHas('places', [
            'name' => 'New Test Place',
            'location_name' => 'New Test Location',
            'category' => 'tourism.museum',
        ]);
    }
}
