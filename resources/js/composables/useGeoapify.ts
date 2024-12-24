'use strict';

const API_KEY = import.meta.env.VITE_GEOAPIFY_ACCESS_TOKEN;
const categoryMap = [
    'accommodation',
    'activity',
    'adult',
    'administrative',
    'amenity',
    'airport',
    'beach',
    'building',
    'camping',
    'catering',
    'childcare',
    'commercial',
    'education',
    'entertainment',
    'healthcare',
    'heritage',
    'highway',
    'leisure',
    'low_emission_zone',
    'man_made',
    'national_park',
    'natural',
    'office',
    'parking',
    'pet',
    'political',
    'populated_place',
    'postal_code',
    'power',
    'production',
    'public_transport',
    'railway',
    'religion',
    'rental',
    'service',
    'ski',
    'sport',
    'tourism',
]
const allCategories = categoryMap.join(',')

const useGeocoding = async (place: string) => {
    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${place}&apiKey=${API_KEY}`,
    )
    return await response.json()
}

const usePlaces = async (place_id: string) => {
    if (!place_id) {
        return []
    }

    try {
        const response = await fetch(
            `https://api.geoapify.com/v2/places?categories=${allCategories}&filter=place:${place_id}&limit=100&apiKey=${API_KEY}`,
        )

        return await response.json()
    } catch (error) {
        console.error('Error fetching places: ', error)
    }
}

export { useGeocoding, usePlaces };
