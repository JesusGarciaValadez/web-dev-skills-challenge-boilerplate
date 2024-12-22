<template>
    <div class="min-h-full app-container">
        <the-header />

        <main class="-mt-24 pb-8">
            <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-[96rem] lg:px-8">
                <!-- Main 3 column grid -->
                <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
                    <!-- Left column -->
                    <div class="grid grid-cols-1 gap-4">
                        <section aria-labelledby="section-1-title">
                            <div class="rounded-lg bg-white shadow">
                                <div class="p-6">
                                    <dropdown-search @search="onSearch" />
                                </div>
                            </div>
                        </section>
                    </div>

                    <!-- Right column -->
                    <div class="grid grid-cols-1 gap-4 lg:col-span-2">
                        <section aria-labelledby="section-2-title">
                            <div class="overflow-hidden rounded-lg bg-white shadow">
                                <div class="p-6">
                                    <the-map :points-of-interest="pointsOfInterest" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>

        <the-footer />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TheHeader from './TheHeader.vue'
import TheFooter from './TheFooter.vue'
import DropdownSearch from './DropdownSearch.vue'
import TheMap from './TheMap.vue'

import { useApi } from '../composables/useApi'
import type { Place } from '../types/Place'

let geocodingResponse = ref<Place[]>([])
const pointsOfInterest = ref<Place[]>([])

const settingPlaces = (place: Place) => ({
    name: place.name,
    location_name: place.location_name,
    category: place.category,
    points: {
        type: 'Point',
        coordinates: {
            lat: place.points.coordinates.lat,
            lon: place.points.coordinates.lon,
        },
        place_id: place.points.place_id,
    },
})

onMounted(async () => {
    geocodingResponse.value = await useApi('/api/places', 'GET')
    pointsOfInterest.value = geocodingResponse.value.map(settingPlaces)
})

function onSearch(results: Place[]) {
    pointsOfInterest.value = []

    const newPlaces = results.map(settingPlaces)

    pointsOfInterest.value = [
        ...geocodingResponse.value,
        ...newPlaces,
    ]
}
</script>
