<?php

namespace App\Http\Repositories;

use App\Models\Place;
use Illuminate\Database\Eloquent\Collection;

interface PlaceRepositoryInterface
{
    public function all(): Collection;
    public function save(array $data): Place;
    public function update(array $data, Place $place): Place;
    public function delete(Place $place): Place;
}
