import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createMap, createGeolocaleControl, createPopup, createMarker, createNavigationControl, createScaleControl } from './useMapbox'
import mapboxgl from 'mapbox-gl'
import type { Place } from '../types/Place'

describe('useMapbox composable', () => {
    beforeEach(() => {
        // Mock mapboxgl.Map
        vi.spyOn(mapboxgl, 'Map').mockImplementation(() => ({
            remove: vi.fn(),
            on: vi.fn(),
            off: vi.fn()
        }))

        // Mock Popup class with proper context handling
        vi.spyOn(mapboxgl, 'Popup').mockImplementation(() => {
            let htmlContent = '';
            return {
                setHTML(html: string) {
                    htmlContent = html;
                    return this;
                },
                getElement() {
                    return {
                        innerHTML: htmlContent
                    };
                }
            };
        })

        // Mock Marker class
        vi.spyOn(mapboxgl, 'Marker').mockImplementation((options) => {
            let lat: number, lng: number;
            return {
                setLngLat(coords: [number, number]) {
                    [lng, lat] = coords;
                    return this;
                },
                getLngLat() {
                    return { lat, lng };
                },
                getElement() {
                    return {
                        style: {
                            backgroundColor: options?.color || ''
                        }
                    };
                },
                addTo() { 
                    return this; 
                }
            };
        })

        // Mock environment variable
        vi.stubEnv('VITE_MAPBOX_ACCESS_TOKEN', 'test_token')
    })

    afterEach(() => {
        vi.restoreAllMocks()
        vi.unstubAllEnvs()
    })

    describe('createMap', () => {
        it('should create a map instance with default options', () => {
            const map = createMap()
            expect(mapboxgl.Map).toHaveBeenCalledWith(expect.objectContaining({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v12',
                zoom: 10,
                center: [4.8924534, 52.3730796]
            }))
        })
    })

    describe('createGeolocaleControl', () => {
        it('should create a geolocate control instance with correct options', () => {
            const geolocateControl = createGeolocaleControl()
            expect(geolocateControl).toBeInstanceOf(mapboxgl.GeolocateControl)
            expect(geolocateControl.options).toEqual(expect.objectContaining({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showAccuracyCircle: true,
                showUserHeading: true
            }))
        })
    })

    describe('createPopup', () => {
        it('should create a popup with correct content for basic place', () => {
            const place: Place = {
                name: 'Test Place',
                location_name: 'Test Location',
                category: 'tourism.sights',
                points: { type: 'POINT', coordinates: { lat: 52.3730796, lon: 4.8924534 }, place_id: 'test' }
            }
            const popup = createPopup(place)
            const html = popup.getElement().innerHTML
            expect(html).toContain('Test Place')
            expect(html).toContain('Test Location')
            expect(html).toContain('tourism')
            expect(html).toContain('52.3730796, 4.8924534')
        })

        it('should handle place with array of categories', () => {
            const place: Place = {
                name: 'Test Place',
                location_name: 'Test Location',
                category: ['tourism.sights', 'leisure.park'],
                points: { type: 'POINT', coordinates: { lat: 52.3730796, lon: 4.8924534 }, place_id: 'test' }
            }
            const popup = createPopup(place)
            const html = popup.getElement().innerHTML
            expect(html).toContain('tourism')
        })

        it('should handle place with empty category', () => {
            const place: Place = {
                name: 'Test Place',
                location_name: 'Test Location',
                category: '',
                points: { type: 'POINT', coordinates: { lat: 52.3730796, lon: 4.8924534 }, place_id: 'test' }
            }
            const popup = createPopup(place)
            const html = popup.getElement().innerHTML
            expect(html).toContain('Test Place')
            expect(html).toContain('Test Location')
        })

        it('should handle place with undefined category', () => {
            const place: Place = {
                name: 'Test Place',
                location_name: 'Test Location',
                category: undefined as any,
                points: { type: 'POINT', coordinates: { lat: 52.3730796, lon: 4.8924534 }, place_id: 'test' }
            }
            const popup = createPopup(place)
            const html = popup.getElement().innerHTML
            expect(html).toContain('Test Place')
            expect(html).toContain('Test Location')
        })
    })

    describe('createMarker', () => {
        it('should create a marker with correct coordinates', () => {
            const place: Place = {
                name: 'Test Place',
                location_name: 'Test Location',
                category: 'tourism.sights',
                points: { type: 'POINT', coordinates: { lat: 52.3730796, lon: 4.8924534 }, place_id: 'test' }
            }
            const marker = createMarker(place)
            expect(marker.getLngLat().lat).toBe(52.3730796)
            expect(marker.getLngLat().lng).toBe(4.8924534)
        })

        it('should use correct color for known category', () => {
            const place: Place = {
                name: 'Test Place',
                location_name: 'Test Location',
                category: 'tourism.sights',
                points: { type: 'POINT', coordinates: { lat: 52.3730796, lon: 4.8924534 }, place_id: 'test' }
            }
            const marker = createMarker(place)
            expect(marker.getElement().style.backgroundColor).toBe('cadetblue')
        })

        it('should use fallback color for unknown category', () => {
            const place: Place = {
                name: 'Test Place',
                location_name: 'Test Location',
                category: 'unknown.category',
                points: { type: 'POINT', coordinates: { lat: 52.3730796, lon: 4.8924534 }, place_id: 'test' }
            }
            const marker = createMarker(place)
            expect(marker.getElement().style.backgroundColor).toBe('gray')
        })

        it('should handle array of categories', () => {
            const place: Place = {
                name: 'Test Place',
                location_name: 'Test Location',
                category: ['tourism.sights', 'leisure.park'],
                points: { type: 'POINT', coordinates: { lat: 52.3730796, lon: 4.8924534 }, place_id: 'test' }
            }
            const marker = createMarker(place)
            expect(marker.getElement().style.backgroundColor).toBe('cadetblue')
        })
    })

    describe('createNavigationControl', () => {
        it('should create a navigation control with correct options', () => {
            const navigationControl = createNavigationControl()
            expect(navigationControl).toBeInstanceOf(mapboxgl.NavigationControl)
            expect(navigationControl.options).toEqual(expect.objectContaining({
                showCompass: true,
                showZoom: true,
                visualizePitch: true
            }))
        })
    })

    describe('createScaleControl', () => {
        it('should create a scale control with correct options', () => {
            const scaleControl = createScaleControl()
            expect(scaleControl).toBeInstanceOf(mapboxgl.ScaleControl)
            expect(scaleControl.options).toEqual(expect.objectContaining({
                maxWidth: 80,
                unit: 'metric'
            }))
        })
    })
})
