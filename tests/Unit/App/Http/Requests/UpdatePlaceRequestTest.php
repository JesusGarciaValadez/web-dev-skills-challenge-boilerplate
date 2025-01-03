<?php

namespace Tests\Unit\App\Http\Requests;

use App\Http\Requests\UpdatePlaceRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UpdatePlaceRequestTest extends TestCase
{
    private UpdatePlaceRequest $request;

    public static function invalidDataProvider(): array
    {
        return ['missing name' => [['location_name' => 'Updated Location', 'category' => 'Updated Category', 'points' => '{"type":"Point"}',], ['name']], 'missing location_name' => [['name' => 'Updated Place', 'category' => 'Updated Category', 'points' => '{"type":"Point"}',], ['location_name']], 'missing category' => [['name' => 'Updated Place', 'location_name' => 'Updated Location', 'points' => '{"type":"Point"}',], ['category']], 'missing points' => [['name' => 'Updated Place', 'location_name' => 'Updated Location', 'category' => 'Updated Category',], ['points']], 'invalid points json' => [['name' => 'Updated Place', 'location_name' => 'Updated Location', 'category' => 'Updated Category', 'points' => 'invalid-json',], ['points']], 'non-string name' => [['name' => 123, 'location_name' => 'Updated Location', 'category' => 'Updated Category', 'points' => '{"type":"Point"}',], ['name']], 'non-string location_name' => [['name' => 'Updated Place', 'location_name' => 123, 'category' => 'Updated Category', 'points' => '{"type":"Point"}',], ['location_name']], 'non-string category' => [['name' => 'Updated Place', 'location_name' => 'Updated Location', 'category' => 123, 'points' => '{"type":"Point"}',], ['category']], 'empty data' => [[], ['name', 'location_name', 'category', 'points']],];
    }

    #[Test]
    public function it_authorizes_request(): void
    {
        $this->assertTrue($this->request->authorize());
    }

    #[Test]
    public function it_has_required_rules(): void
    {
        $rules = $this->request->rules();

        $this->assertArrayHasKey('name', $rules);
        $this->assertArrayHasKey('location_name', $rules);
        $this->assertArrayHasKey('category', $rules);
        $this->assertArrayHasKey('points', $rules);
    }

    #[Test]
    public function it_validates_valid_data(): void
    {
        $validator = Validator::make(['name' => 'Updated Place', 'location_name' => 'Updated Location', 'category' => 'Updated Category', 'points' => json_encode(['type' => 'Point', 'coordinates' => ['lat' => 2, 'lon' => 2,], 'place_id' => 1,]),], $this->request->rules());

        $this->assertTrue($validator->passes());
    }

    #[Test]
    #[DataProvider('invalidDataProvider')]
    public function it_validates_invalid_data(array $data, array $expectedErrors): void
    {
        $validator = Validator::make($data, $this->request->rules());

        $this->assertFalse($validator->passes());
        $this->assertEquals($expectedErrors, array_keys($validator->errors()->messages()));
    }

    #[Test]
    public function it_handles_empty_strings(): void
    {
        $validator = Validator::make(['name' => '', 'location_name' => '', 'category' => '', 'points' => '',], $this->request->rules());

        $this->assertFalse($validator->passes());
        $this->assertEquals(['name', 'location_name', 'category', 'points'], array_keys($validator->errors()->messages()));
    }

    #[Test]
    public function it_handles_null_values(): void
    {
        $validator = Validator::make(['name' => null, 'location_name' => null, 'category' => null, 'points' => null,], $this->request->rules());

        $this->assertFalse($validator->passes());
        $this->assertEquals(['name', 'location_name', 'category', 'points'], array_keys($validator->errors()->messages()));
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->request = new UpdatePlaceRequest();
    }
}
