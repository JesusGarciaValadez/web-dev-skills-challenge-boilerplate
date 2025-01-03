<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlaceRequest;
use App\Http\Requests\UpdatePlaceRequest;
use App\Http\Services\PlaceService;
use App\Models\Place;
use Exception;
use Illuminate\Http\JsonResponse;
use Throwable;

class PlaceController extends Controller
{
    public function __construct(public readonly PlaceService $placeService) {}

    /**
     * Display a listing of the resource.
     *
     * @throws Exception
     */
    public function index(): JsonResponse
    {
        $places = $this->placeService->all();

        return response()->json($places);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    public function store(StorePlaceRequest $request): JsonResponse
    {
        $place = $this->placeService->save($request->validated());

        if (! $place->exists) {
            return response()->json(['error' => 'Failed to create place'], 500);
        }

        return response()->json($place, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Place $place): JsonResponse
    {
        return response()->json($place);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlaceRequest $request, Place $place): JsonResponse
    {
        $placeUpdated = $this->placeService->update($request->validated(), $place);

        return response()->json(null, $placeUpdated->wasChanged() ? 204 : 304);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Place $place): JsonResponse
    {
        $deletedPlace = $this->placeService->delete($place);

        return response()->json(null, $deletedPlace::doesntExist() ? 204 : 304);
    }
}
