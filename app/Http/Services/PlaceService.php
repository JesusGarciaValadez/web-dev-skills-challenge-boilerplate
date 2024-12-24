<?php

namespace App\Http\Services;

use App\Models\Place;
use App\Http\Repositories\PlaceRepositoryInterface;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use RuntimeException;

class PlaceService
{
    private PlaceRepositoryInterface $placeRepository;

    public function __construct(PlaceRepositoryInterface $placeRepository)
    {
        $this->placeRepository = $placeRepository;
    }

    /**
     * @throws RuntimeException
     */
    public function all(): Collection
    {
        try {
            return $this->placeRepository->all();
        } catch (Exception $e) {
            throw new RuntimeException($e->getMessage());
        }
    }

    /**
     * @throws RuntimeException
     */
    public function save(array $data): Place
    {
        try {
            return $this->placeRepository->save($data);
        } catch (Exception $e) {
            throw new RuntimeException($e->getMessage());
        }
    }

    /**
     * @throws RuntimeException
     */
    public function update(array $data, Place $place): Place
    {
        try {
            return $this->placeRepository->update($data, $place);
        } catch (Exception $e) {
            throw new RuntimeException($e->getMessage());
        }
    }

    /**
     * @throws RuntimeException
     */
    public function delete(Place $place): Place
    {
        try {
            return $this->placeRepository->delete($place);
        } catch (Exception $e) {
            throw new RuntimeException($e->getMessage());
        }
    }
}
