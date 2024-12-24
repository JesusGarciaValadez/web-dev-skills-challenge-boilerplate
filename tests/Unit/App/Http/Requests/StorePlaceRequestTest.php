<?php

namespace Tests\Unit\App\Http\Requests;

use App\Http\Requests\StorePlaceRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\DataProvider;

class StorePlaceRequestTest extends TestCase
{
    private StorePlaceRequest $request;

    protected function setUp(): void
    {
        parent::setUp();
        $this->request = new StorePlaceRequest();
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
        $validator = Validator::make([
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
            ]),
        ], $this->request->rules());

        $this->assertTrue($validator->passes());
    }

    public static function invalidDataProvider(): array
    {
        return [
            'missing name' => [
                [
                    'location_name' => 'Test Location',
                    'category' => 'Test Category',
                    'points' => '{"type":"Point"}',
                ],
                ['name']
            ],
            'missing location_name' => [
                [
                    'name' => 'Test Place',
                    'category' => 'Test Category',
                    'points' => '{"type":"Point"}',
                ],
                ['location_name']
            ],
            'missing category' => [
                [
                    'name' => 'Test Place',
                    'location_name' => 'Test Location',
                    'points' => '{"type":"Point"}',
                ],
                ['category']
            ],
            'missing points' => [
                [
                    'name' => 'Test Place',
                    'location_name' => 'Test Location',
                    'category' => 'Test Category',
                ],
                ['points']
            ],
            'invalid points json' => [
                [
                    'name' => 'Test Place',
                    'location_name' => 'Test Location',
                    'category' => 'Test Category',
                    'points' => 'invalid-json',
                ],
                ['points']
            ],
            'non-string name' => [
                [
                    'name' => 123,
                    'location_name' => 'Test Location',
                    'category' => 'Test Category',
                    'points' => '{"type":"Point"}',
                ],
                ['name']
            ],
            'non-string location_name' => [
                [
                    'name' => 'Test Place',
                    'location_name' => 123,
                    'category' => 'Test Category',
                    'points' => '{"type":"Point"}',
                ],
                ['location_name']
            ],
            'non-string category' => [
                [
                    'name' => 'Test Place',
                    'location_name' => 'Test Location',
                    'category' => 123,
                    'points' => '{"type":"Point"}',
                ],
                ['category']
            ],
            'empty data' => [
                [],
                ['name', 'location_name', 'category', 'points']
            ],
        ];
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
        $validator = Validator::make([
            'name' => '',
            'location_name' => '',
            'category' => '',
            'points' => '',
        ], $this->request->rules());

        $this->assertFalse($validator->passes());
        $this->assertEquals(
            ['name', 'location_name', 'category', 'points'],
            array_keys($validator->errors()->messages())
        );
    }

    #[Test]
    public function it_handles_null_values(): void
    {
        $validator = Validator::make([
            'name' => null,
            'location_name' => null,
            'category' => null,
            'points' => null,
        ], $this->request->rules());

        $this->assertFalse($validator->passes());
        $this->assertEquals(
            ['name', 'location_name', 'category', 'points'],
            array_keys($validator->errors()->messages())
        );
    }
}
