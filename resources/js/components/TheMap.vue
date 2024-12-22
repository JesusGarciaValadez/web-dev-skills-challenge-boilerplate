<template>
    <div id="map" class="w-full min-h-96 h-[1070px] max-h-[1070px]" dusk="map" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'

import {
    createMap,
    createPopup,
    createMarker,
    createGeolocaleControl,
    createNavigationControl,
    createScaleControl
} from '../composables/useMapbox'
import type { Place } from '../types/Place'

const props = defineProps({
    pointsOfInterest: {
        type: Array as () => Place[],
        required: true
    }
})

let map: any = null
const markers = ref<any[]>([])

watch((): any => props.pointsOfInterest, (newVal: Place[]) => {
    markers.value.forEach(marker => marker.remove())
    markers.value = []

    newVal.forEach(place => {
        const popup = createPopup(place)
        const popupEl = popup.getElement()
        popupEl?.setAttribute('dusk', `popup-${place.name}`)

        const marker = createMarker(place)
            .addTo(map)

        const markerEl = marker.getElement()
        markerEl?.setAttribute('dusk', `marker-${place.name}`)

        markerEl.addEventListener('mouseenter', () => {
            popup.setLngLat(marker.getLngLat())
            popup.addTo(map)
        })

        markerEl.addEventListener('mouseleave', () => popup.remove())

        markers.value.push(marker)
    })
}, { immediate: true })

onMounted(() => {
    map = createMap()

    map.addControl(createGeolocaleControl())
    map.addControl(createNavigationControl(), 'top-left')
    map.addControl(createScaleControl())
})

onBeforeUnmount(() => {
    markers.value.forEach(marker => marker.remove())
    if (map) {
        map.remove()
        map = null
    }
})
</script>

<style scoped>
.marker-enlarged {
    width: 32px;
    height: 32px;
    cursor: pointer;
    transform: translate(-50%, -50%);
    /* Possibly a background or border for visibility */
    background-color: rgba(0, 128, 128, 0.2);
    border: 2px solid teal;
    border-radius: 50%;
}
</style>
