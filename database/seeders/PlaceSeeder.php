<?php

namespace Database\Seeders;

use App\Models\Place;
use Illuminate\Database\Seeder;

class PlaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Place::factory()->create([
            'name' => 'Copenhagen',
            'location_name' => '1357 Copenhagen, Denmark',
            'category' => 'populated_place',
            'points' => [
                'type' => 'Point',
                'coordinates' => [
                    'lat' => '55.6867243',
                    'lon' => '12.5700724',
                ],
                'place_id' => '5158b49487e0232940592beff494e6d74b40f00103f901662ad10000000000c00207920307313335372b646b'
            ]
        ]);
        Place::factory()->create([
            'name' => 'Mexico',
            'location_name' => 'Mexico City, Mexico',
            'category' => 'administrative',
            'points' => [
                'type' => 'Point',
                'coordinates' => [
                    'lat' => '19.4326296',
                    'lon' => '-99.1331785',
                ],
                'place_id' => '51f1811dff85c858c05914483fd0c06e3340f00101f9014a00150000000000c00208'
            ]
        ]);
        Place::factory()->create([
            'name' => 'Breda',
            'location_name' => 'Breda, NB, Netherlands',
            'category' => 'administrative',
            'points' => [
                'type' => 'Point',
                'coordinates' => [
                    'lat' => '51.5887845',
                    'lon' => '4.7760237',
                ],
                'place_id' => '5104aff1f4a51a13405924f25d4a5dcb4940f00101f9017c64290000000000c00208'
            ]
        ]);
        Place::factory()->create([
            'name' => 'Japan',
            'location_name' => 'Tokyo, Japan',
            'category' => 'administrative',
            'points' => [
                'type' => 'Point',
                'coordinates' => [
                    'lat' => '35.6821936',
                    'lon' => '139.762221',
                ],
                'place_id' => '51626a4b1d64786140592fc5b01e52d74140f00101f901d58b170000000000c00208'
            ]
        ]);
        Place::factory()->create([
            'name' => 'Reykjavik City Hall',
            'location_name' => 'Reykjavik City Hall, Tjarnargata 11, 101 Reykjavik, Iceland',
            'category' => 'tourism.sights.city_hall',
            'points' => [
                'type' => 'Point',
                'coordinates' => [
                    'lat' => '64.145981',
                    'lon' => '-21.9422367',
                ],
                'place_id' => '514997a36c36f135c0599835b1c057095040f00101f9017d60270000000000c00208'
            ]
        ]);
    }
}
