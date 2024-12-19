<?php

namespace Tests\Unit\App\Models;

use App\Models\Place;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PlaceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_retrieves_default_columns(): void
    {
        Place::factory(10)->create();

        $place = Place::selectColumns()->first()->toArray();

        $this->assertArrayHasKey('id', $place);
        $this->assertArrayHasKey('name', $place);
        $this->assertArrayHasKey('location_name', $place);
        $this->assertArrayHasKey('category', $place);
        $this->assertArrayHasKey('point', $place);
        $this->assertArrayNotHasKey('key_not_present', $place);
    }

    #[Test]
    public function it_retrieves_results_ordering_by_id_asc(): void
    {
        Place::factory(9)->create();

        $place = Place::select(['id'])->orderById()->first();
        $oldestPlace = Place::select(['id'])->orderBy('id', 'asc')->oldest('id')->get()->first();
        $latestPlace = Place::select(['id'])->orderBy('id', 'desc')->latest('id')->get()->first();

        $this->assertEquals($oldestPlace->id, $place->id);
        $this->assertNotEquals($latestPlace->id, $place->id);
    }
}
