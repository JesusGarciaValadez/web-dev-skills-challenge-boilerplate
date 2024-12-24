import { describe, it, expect } from 'vitest'
import type { Place } from './Place'

describe('Place type', () => {
    it('should create a valid Place object with basic properties', () => {
        const place: Place = {
            name: 'Test Place',
            location_name: 'Test Location',
            category: 'tourism.sights',
            points: {
                type: 'POINT',
                coordinates: {
                    lat: 52.3730796,
                    lon: 4.8924534
                },
                place_id: 'test123'
            }
        }

        expect(place.name).toBe('Test Place')
        expect(place.location_name).toBe('Test Location')
        expect(place.category).toBe('tourism.sights')
        expect(place.points.type).toBe('POINT')
        expect(place.points.coordinates.lat).toBe(52.3730796)
        expect(place.points.coordinates.lon).toBe(4.8924534)
        expect(place.points.place_id).toBe('test123')
    })

    it('should create a valid Place object with array category', () => {
        const place: Place = {
            name: 'Test Place',
            location_name: 'Test Location',
            category: ['tourism.sights', 'leisure.park'],
            points: {
                type: 'POINT',
                coordinates: {
                    lat: 52.3730796,
                    lon: 4.8924534
                },
                place_id: 'test123'
            }
        }

        expect(Array.isArray(place.category)).toBe(true)
        expect(place.category).toContain('tourism.sights')
        expect(place.category).toContain('leisure.park')
    })

    it('should handle empty string category', () => {
        const place: Place = {
            name: 'Test Place',
            location_name: 'Test Location',
            category: '',
            points: {
                type: 'POINT',
                coordinates: {
                    lat: 52.3730796,
                    lon: 4.8924534
                },
                place_id: 'test123'
            }
        }

        expect(place.category).toBe('')
    })

    it('should handle extreme coordinate values', () => {
        const place: Place = {
            name: 'Test Place',
            location_name: 'Test Location',
            category: 'tourism',
            points: {
                type: 'POINT',
                coordinates: {
                    lat: 90, // Maximum latitude
                    lon: 180 // Maximum longitude
                },
                place_id: 'test123'
            }
        }

        expect(place.points.coordinates.lat).toBe(90)
        expect(place.points.coordinates.lon).toBe(180)
    })

    it('should handle negative coordinate values', () => {
        const place: Place = {
            name: 'Test Place',
            location_name: 'Test Location',
            category: 'tourism',
            points: {
                type: 'POINT',
                coordinates: {
                    lat: -90, // Minimum latitude
                    lon: -180 // Minimum longitude
                },
                place_id: 'test123'
            }
        }

        expect(place.points.coordinates.lat).toBe(-90)
        expect(place.points.coordinates.lon).toBe(-180)
    })

    it('should handle long place names and location names', () => {
        const longName = 'A'.repeat(100)
        const longLocation = 'B'.repeat(200)
        
        const place: Place = {
            name: longName,
            location_name: longLocation,
            category: 'tourism',
            points: {
                type: 'POINT',
                coordinates: {
                    lat: 0,
                    lon: 0
                },
                place_id: 'test123'
            }
        }

        expect(place.name.length).toBe(100)
        expect(place.location_name.length).toBe(200)
    })

    it('should handle special characters in names', () => {
        const place: Place = {
            name: 'Café & Restaurant "La Piñata"',
            location_name: 'Straße 123, München',
            category: 'catering',
            points: {
                type: 'POINT',
                coordinates: {
                    lat: 0,
                    lon: 0
                },
                place_id: 'test123'
            }
        }

        expect(place.name).toBe('Café & Restaurant "La Piñata"')
        expect(place.location_name).toBe('Straße 123, München')
    })

    it('should handle different point types', () => {
        const place: Place = {
            name: 'Test Place',
            location_name: 'Test Location',
            category: 'tourism',
            points: {
                type: 'MultiPoint', // Different point type
                coordinates: {
                    lat: 0,
                    lon: 0
                },
                place_id: 'test123'
            }
        }

        expect(place.points.type).toBe('MultiPoint')
    })
})
