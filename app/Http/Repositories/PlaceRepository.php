<?php

namespace App\Http\Repositories;

use App\Models\Place;
use App\Exceptions\Place\PlaceException;
use App\Exceptions\Place\PlaceNotFoundException;
use App\Exceptions\Place\PlaceNotSavedException;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\QueryException;

class PlaceRepository implements PlaceRepositoryInterface
{
    /**
     * @throws PlaceException
     */
    public function all(): Collection
    {
        try {
            return Place::selectColumns()->orderById()->get();
        } catch (Exception $e) {
            throw new PlaceException('Failed to retrieve places: ' . $e->getMessage());
        }
    }

    /**
     * @throws PlaceNotSavedException
     */
    public function save(array $data): Place
    {
        try {
            $place = Place::create($data);

            if (!$place->exists) {
                throw new PlaceNotSavedException('Place not saved');
            }

            return $place;
        } catch (QueryException $e) {
            throw new PlaceNotSavedException('Invalid place data: ' . $e->getMessage());
        } catch (Exception $e) {
            throw new PlaceNotSavedException($e->getMessage());
        }
    }

    /**
     * @throws PlaceNotSavedException
     */
    public function update(array $data, Place $place): Place
    {
        try {
            $place->update($data);

            if (!$place->wasChanged()) {
                throw new PlaceNotSavedException('Place not updated');
            }

            return $place;
        } catch (QueryException $e) {
            throw new PlaceNotSavedException('Invalid place data: ' . $e->getMessage());
        } catch (Exception $e) {
            throw new PlaceNotSavedException($e->getMessage());
        }
    }

    /**
     * @throws PlaceNotFoundException
     * @throws PlaceNotSavedException
     */
    public function delete(Place $place): Place
    {
        try {
            if (!$place->exists) {
                throw new PlaceNotFoundException();
            }

            $place->delete();
            return $place;
        } catch (PlaceNotFoundException $e) {
            throw $e;
        } catch (Exception $e) {
            throw new PlaceNotSavedException('Failed to delete place: ' . $e->getMessage());
        }
    }
}
