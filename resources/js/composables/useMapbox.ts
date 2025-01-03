/// <reference types="vite/client" />

'use strict';

import { toRaw } from 'vue'
import mapboxgl, {
    GeolocateControlOptions,
    MapOptions,
    PopupOptions,
    MarkerOptions,
    NavigationControlOptions,
    ScaleControlOptions,
    Popup
} from 'mapbox-gl'
import type { Place } from '../types/Place'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
const categoryColorMap: Record<string, string> = {
    accommodation: "cornflowerblue",
    activity: "tomato",
    adult: "hotpink",
    administrative: "red",
    amenity: "mediumpurple",
    airport: "darkkhaki",
    beach: "lightseagreen",
    building: "sienna",
    camping: "olivedrab",
    catering: "slategray",
    childcare: "palevioletred",
    commercial: "chocolate",
    education: "goldenrod",
    entertainment: "rebeccapurple",
    healthcare: "crimson",
    heritage: "mediumseagreen",
    highway: "lightskyblue",
    leisure: "darkorange",
    "low_emission_zone": "teal",
    "man_made": "maroon",
    "national_park": "forestgreen",
    natural: "springgreen",
    office: "teal",
    parking: "silver",
    pet: "deeppink",
    political: "darkolivegreen",
    "populated_place": "royalblue",
    "postal_code": "indianred",
    power: "blueviolet",
    production: "saddlebrown",
    "public_transport": "mediumslateblue",
    railway: "lightpink",
    religion: "darkmagenta",
    rental: "darkblue",
    service: "darkslategray",
    ski: "cornsilk",
    sport: "mediumorchid",
    tourism: "cadetblue"
}
const mapOptions: MapOptions = {
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    zoom: 10,
    center: [4.8924534, 52.3730796],
    attributionControl: true,
    projection: 'mercator',
}
const geolocateControlOptions: GeolocateControlOptions = {
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showAccuracyCircle: true,
    showUserHeading: true
}
const popupOptions: PopupOptions = {
    closeButton: false,
    closeOnClick: false,
    className: 'mapboxgl-popup'
}
const markerOptions: MarkerOptions  = {
    color: 'teal',
    rotation: 45,
    anchor: 'center',
    pitchAlignment: 'map',
    rotationAlignment: 'map',
    className: 'marker-enlarged'
}
const navigationControlOptions: NavigationControlOptions = {
    showCompass: true,
    showZoom: true,
    visualizePitch: true
}
const scaleControlOptions: ScaleControlOptions = {
    maxWidth: 80,
    unit: 'metric'
}

const createMap = () => new mapboxgl.Map(mapOptions)
const createGeolocaleControl = () => new mapboxgl.GeolocateControl(geolocateControlOptions)
const createPopup = (place: Place) => {
    const category = Array.isArray(toRaw(place.category))
        ? (typeof place.category[0] === 'string' ? place.category[0].split('.')[0] : '')
        : (typeof place.category === 'string' ? place.category.split('.')[0] : '')
    return new mapboxgl.Popup(popupOptions)
        .setHTML(
            `<h3>${place.name}</h3>
            <p>${place.location_name}</p>
            <p>${category}</p>
            <p>${place.points.coordinates.lat}, ${place.points.coordinates.lon}</p>`
        )
}
// https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/
const createMarker = (place: Place) => {
    const category = Array.isArray(toRaw(place.category))
        ? (typeof place.category[0] === 'string' ? place.category[0].split('.')[0] : '')
        : (typeof place.category === 'string' ? place.category.split('.')[0] : '')
    const color = categoryColorMap[category] || 'gray' // fallback color

    return new mapboxgl.Marker({ ...markerOptions, color })
        .setLngLat([ place.points.coordinates.lon, place.points.coordinates.lat ])
}
const createNavigationControl = () => new mapboxgl.NavigationControl(navigationControlOptions)
const createScaleControl = () => new mapboxgl.ScaleControl(scaleControlOptions)

export { createMap, createGeolocaleControl, createPopup, createMarker, createNavigationControl, createScaleControl }
