import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TheMap from './TheMap.vue'
import {
    createMap,
    createPopup,
    createMarker,
    createGeolocaleControl,
    createNavigationControl,
    createScaleControl
} from '../composables/useMapbox'

// Mock the mapbox composables
const mockMarkerRemove = vi.fn()
const mockPopupRemove = vi.fn()
const mockMapRemove = vi.fn()
const mockSetLngLat = vi.fn().mockReturnThis()
const mockAddTo = vi.fn().mockReturnThis()

vi.mock('../composables/useMapbox', () => ({
    createMap: vi.fn(() => ({
        addControl: vi.fn(),
        remove: mockMapRemove,
    })),
    createPopup: vi.fn(() => ({
        getElement: vi.fn(() => {
            const div = document.createElement('div')
            div.setAttribute('dusk', '')
            return div
        }),
        setLngLat: mockSetLngLat,
        addTo: mockAddTo,
        remove: mockPopupRemove,
    })),
    createMarker: vi.fn(() => ({
        getElement: vi.fn(() => {
            const div = document.createElement('div')
            div.setAttribute('dusk', '')
            return div
        }),
        getLngLat: vi.fn(() => ({ lat: 0, lng: 0 })),
        addTo: vi.fn().mockReturnThis(),
        remove: mockMarkerRemove,
    })),
    createGeolocaleControl: vi.fn(() => ({
        on: vi.fn(),
    })),
    createNavigationControl: vi.fn(),
    createScaleControl: vi.fn(),
}))

const mockPointsOfInterest = [
    {
        name: 'Test Place 1',
        location_name: 'Test Location 1',
        category: 'Test Category 1',
        points: {
            type: 'Point',
            coordinates: {
                lat: 1.234,
                lon: 4.567,
            },
            place_id: 'test-id-1',
        },
    },
    {
        name: 'Test Place 2',
        location_name: 'Test Location 2',
        category: 'Test Category 2',
        points: {
            type: 'Point',
            coordinates: {
                lat: 2.345,
                lon: 5.678,
            },
            place_id: 'test-id-2',
        },
    },
]

describe('TheMap', () => {
    beforeEach(() => {
        // Create a map container element
        const mapContainer = document.createElement('div')
        mapContainer.id = 'map'
        document.body.appendChild(mapContainer)
        
        // Clear all mock functions
        vi.clearAllMocks()
    })

    afterEach(() => {
        // Clean up the map container
        const mapContainer = document.getElementById('map')
        if (mapContainer) {
            document.body.removeChild(mapContainer)
        }
    })

    it('should mount successfully', () => {
        const wrapper = mount(TheMap, {
            props: {
                pointsOfInterest: [],
            },
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('should render the map container with correct classes', () => {
        const wrapper = mount(TheMap, {
            props: {
                pointsOfInterest: [],
            },
        })
        
        const mapContainer = wrapper.find('#map')
        expect(mapContainer.exists()).toBe(true)
        expect(mapContainer.classes()).toContain('w-full')
        expect(mapContainer.classes()).toContain('min-h-96')
        expect(mapContainer.classes()).toContain('h-[1070px]')
        expect(mapContainer.classes()).toContain('max-h-[1070px]')
    })

    it('should initialize map with controls on mount', async () => {
        mount(TheMap, {
            props: {
                pointsOfInterest: [],
            },
        })
        await flushPromises()
        
        expect(createMap).toHaveBeenCalled()
        expect(createGeolocaleControl).toHaveBeenCalled()
        expect(createNavigationControl).toHaveBeenCalled()
        expect(createScaleControl).toHaveBeenCalled()
    })

    it('should create markers for points of interest', async () => {
        const wrapper = mount(TheMap, {
            props: {
                pointsOfInterest: mockPointsOfInterest,
            },
        })
        await flushPromises()
        
        expect(createMarker).toHaveBeenCalledTimes(mockPointsOfInterest.length)
        expect(createPopup).toHaveBeenCalledTimes(mockPointsOfInterest.length)
    })

    it('should update markers when points of interest change', async () => {
        const wrapper = mount(TheMap, {
            props: {
                pointsOfInterest: [],
            },
        })
        await flushPromises()
        
        await wrapper.setProps({
            pointsOfInterest: mockPointsOfInterest,
        })
        await flushPromises()
        
        expect(createMarker).toHaveBeenCalledTimes(mockPointsOfInterest.length)
        expect(createPopup).toHaveBeenCalledTimes(mockPointsOfInterest.length)
    })

    it('should remove markers when points of interest are removed', async () => {
        const wrapper = mount(TheMap, {
            props: {
                pointsOfInterest: mockPointsOfInterest,
            },
        })
        await flushPromises()
        
        await wrapper.setProps({
            pointsOfInterest: [],
        })
        await flushPromises()
        
        expect(mockMarkerRemove).toHaveBeenCalledTimes(mockPointsOfInterest.length)
    })

    it('should set dusk attributes on markers and popups', async () => {
        const wrapper = mount(TheMap, {
            props: {
                pointsOfInterest: mockPointsOfInterest,
            },
        })
        await flushPromises()
        
        const markerElements = document.querySelectorAll('[dusk^="marker-"]')
        const popupElements = document.querySelectorAll('[dusk^="popup-"]')
        
        mockPointsOfInterest.forEach((place, index) => {
            const markerEl = markerElements[index]
            const popupEl = popupElements[index]
            
            if (markerEl) {
                expect(markerEl.getAttribute('dusk')).toBe(`marker-${place.name}`)
            }
            if (popupEl) {
                expect(popupEl.getAttribute('dusk')).toBe(`popup-${place.name}`)
            }
        })
    })

    it('should handle marker mouse events', async () => {
        const wrapper = mount(TheMap, {
            props: {
                pointsOfInterest: mockPointsOfInterest,
            },
        })
        await flushPromises()
        
        const markerEl = document.querySelector('[dusk^="marker-"]')
        if (markerEl) {
            markerEl.dispatchEvent(new Event('mouseenter'))
            expect(mockSetLngLat).toHaveBeenCalled()
            expect(mockAddTo).toHaveBeenCalled()
            
            markerEl.dispatchEvent(new Event('mouseleave'))
            expect(mockPopupRemove).toHaveBeenCalled()
        }
    })

    it('should cleanup on unmount', async () => {
        const wrapper = mount(TheMap, {
            props: {
                pointsOfInterest: mockPointsOfInterest,
            },
        })
        await flushPromises()
        
        wrapper.unmount()
        
        expect(mockMarkerRemove).toHaveBeenCalled()
        expect(mockMapRemove).toHaveBeenCalled()
    })

    it('should handle empty points of interest array', async () => {
        const wrapper = mount(TheMap, {
            props: {
                pointsOfInterest: [],
            },
        })
        await flushPromises()
        
        expect(createMarker).not.toHaveBeenCalled()
        expect(createPopup).not.toHaveBeenCalled()
    })
})
