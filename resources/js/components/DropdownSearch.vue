<template>
    <div class="relative rounded-md bg-white px-3 pb-1.5 pt-2.5 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-teal-600">
        <label
            for="places"
            class="block text-xs font-medium text-gray-900"
            dusk="places-of-interest-search-label"
        >
            Places of interest search
        </label>
        <input
            ref="placesInput"
            type="text"
            name="places"
            id="places"
            placeholder="Provide a location name (eg. Amsterdam)"
            @input="debouncedOnChange"
            @focus="onFocus"
            class="block w-full text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
            dusk="places-of-interest-search-input"
        />
        <the-loader :is-loading="isLoading" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TheLoader from './TheLoader.vue'

import { useDebouncer } from '../composables/useDebouncer'
import { useGeocoding, usePlaces } from '../composables/useGeoapify'
import type { Place } from '../types/Place'

const emit = defineEmits(['search'])

const placesInput = ref<HTMLInputElement | null>(null)
const places = ref<Place[]>([])
const isLoading = ref(false)

const onChange = async (event: any) => {
    const query = event.target.value.trim()
    if (!query) {
        places.value = []
        emit('search', [])
        return
    }

    try {
        isLoading.value = true

        // 1) First, geocode the user input
        const geoResponse = await useGeocoding(query)
        const geoFeatures = geoResponse.features || []

        // Transform geocoding results to Place[] shape
        const geocodingResults: Place = {
            name: geoFeatures[0].properties.formatted,
            location_name: geoFeatures[0].properties.formatted,
            category: geoFeatures[0].properties.category || 'unknown',
            points: {
                type: 'Point',
                coordinates: {
                    lat: geoFeatures[0].properties.lat,
                    lon: geoFeatures[0].properties.lon,
                },
                place_id: geoFeatures[0].properties.place_id,
            },
        }

        // 2) If we got at least one result, get place_id of the first one
        let finalResults: Place[] = [geocodingResults]
        if (finalResults.length > 0) {
            const placeId = finalResults[0].points.place_id

            // 3) Now fetch up to 100 "places of interest" in that location
            const placesResponse = await usePlaces(placeId)
            const placesFeatures = placesResponse.features || []

            // Transform them to the same Place[] shape
            const interestPlaces: Place[] = placesFeatures.map((feature: any) => {
                return {
                    name: feature.properties.name || feature.properties.formatted || 'Unknown place',
                        location_name: feature.properties.formatted || 'unknown',
                    category: feature.properties.categories || 'unknown',
                    points: {
                    type: 'Point',
                        coordinates: {
                            lat: feature.properties.lat,
                            lon: feature.properties.lon,
                        },
                        place_id: feature.properties.place_id,
                    },
                }
            })

            // Combine geocoding + interest places
            finalResults = [
                geocodingResults,
                ...interestPlaces
            ]
        }

        // 4) Set local state + emit
        places.value = finalResults
        emit('search', finalResults)

    } catch (error) {
        console.error("Error fetching geocoding or places results:", error)
    } finally {
        isLoading.value = false
    }
}

const debouncedOnChange = useDebouncer(onChange, 500)

const onFocus = () => {
    if (placesInput.value) {
        placesInput.value.value = ''
    }
    places.value = []
}
</script>
