<?php

namespace App\Http\Services;

use App\Models\Place;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Throwable;

class PlaceService
{
    /**
     * @throws Exception
     */
    public function all(): Collection
    {
        try {
            return Place::selectColumns()->orderById()->get();
        } catch (Exception $e) {
            throw new \RuntimeException($e->getMessage());
        }
    }

    /**
     * @throws Throwable
     */
    public function save(array $data): Place
    {
        $place = null;

        try {
            $place = Place::create($data);
        } catch (Exception $e) {
            throw new \RuntimeException($e->getMessage());
        }

        throw_unless($place->exists, new \RuntimeException('Place not saved'));

        return $place;
    }

    public function update(array $data, Place $place): Place
    {
        try {
            $place->update($data);

            throw_unless($place->wasChanged(), new \RuntimeException('Place not updated'));
        } catch (Exception $e) {
            throw new \RuntimeException($e->getMessage());
        } catch (Throwable $e) {
            throw new \RuntimeException($e->getMessage());
        }

        return $place;
    }

    public function delete(Place $place): Place
    {
        try {
            $place->delete();
        } catch (Exception $e) {
            throw new \RuntimeException($e->getMessage());
        }

        return $place;
    }
}
