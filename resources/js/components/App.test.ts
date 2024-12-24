import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from './App.vue'
import TheHeader from './TheHeader.vue'
import TheFooter from './TheFooter.vue'
import DropdownSearch from './DropdownSearch.vue'
import TheMap from './TheMap.vue'
import { useApi } from '../composables/useApi'

// Mock mapbox-gl
vi.mock('mapbox-gl', () => ({
    default: {
        Map: vi.fn(() => ({
            on: vi.fn(),
            remove: vi.fn(),
            addControl: vi.fn(),
        })),
        GeolocateControl: vi.fn(() => ({
            on: vi.fn(),
        })),
        Popup: vi.fn(() => ({
            setLngLat: vi.fn().mockReturnThis(),
            setHTML: vi.fn().mockReturnThis(),
            addTo: vi.fn().mockReturnThis(),
            remove: vi.fn(),
        })),
        Marker: vi.fn(() => ({
            setLngLat: vi.fn().mockReturnThis(),
            setPopup: vi.fn().mockReturnThis(),
            addTo: vi.fn().mockReturnThis(),
            remove: vi.fn(),
        })),
    },
}))

// Mock useMapbox composable
vi.mock('../composables/useMapbox', () => ({
    createMap: vi.fn(() => ({
        addControl: vi.fn(),
        remove: vi.fn(),
    })),
    createPopup: vi.fn(() => ({
        getElement: vi.fn(() => document.createElement('div')),
        setLngLat: vi.fn().mockReturnThis(),
        addTo: vi.fn().mockReturnThis(),
        remove: vi.fn(),
    })),
    createMarker: vi.fn(() => ({
        getElement: vi.fn(() => document.createElement('div')),
        getLngLat: vi.fn(() => ({ lat: 0, lng: 0 })),
        addTo: vi.fn().mockReturnThis(),
        remove: vi.fn(),
    })),
    createGeolocaleControl: vi.fn(() => ({
        on: vi.fn(),
    })),
    createNavigationControl: vi.fn(),
    createScaleControl: vi.fn(),
}))

vi.mock('../composables/useApi', () => ({
    useApi: vi.fn(),
}))

const mockPlaces = [
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

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useApi).mockResolvedValue(mockPlaces)
        
        // Create a map container element
        const mapContainer = document.createElement('div')
        mapContainer.id = 'map'
        document.body.appendChild(mapContainer)
    })

    afterEach(() => {
        // Clean up the map container
        const mapContainer = document.getElementById('map')
        if (mapContainer) {
            document.body.removeChild(mapContainer)
        }
    })

    it('should mount successfully', () => {
        const wrapper = mount(App, {
            global: {
                stubs: {
                    TheMap: true,
                    TheHeader: true,
                    TheFooter: true,
                    DropdownSearch: true,
                },
            },
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('should render all child components', () => {
        const wrapper = mount(App, {
            global: {
                stubs: {
                    TheMap: true,
                    TheHeader: true,
                    TheFooter: true,
                    DropdownSearch: true,
                },
            },
        })
        
        expect(wrapper.findComponent(TheHeader).exists()).toBe(true)
        expect(wrapper.findComponent(TheFooter).exists()).toBe(true)
        expect(wrapper.findComponent(DropdownSearch).exists()).toBe(true)
        expect(wrapper.findComponent(TheMap).exists()).toBe(true)
    })

    it('should have correct layout structure', () => {
        const wrapper = mount(App, {
            global: {
                stubs: {
                    TheMap: true,
                    TheHeader: true,
                    TheFooter: true,
                    DropdownSearch: true,
                },
            },
        })
        
        expect(wrapper.find('.min-h-full').exists()).toBe(true)
        expect(wrapper.find('main').exists()).toBe(true)
        expect(wrapper.find('.grid-cols-1').exists()).toBe(true)
        expect(wrapper.find('.lg\\:grid-cols-3').exists()).toBe(true)
    })

    it('should fetch and set initial places on mount', async () => {
        const wrapper = mount(App, {
            global: {
                stubs: {
                    TheMap: true,
                    TheHeader: true,
                    TheFooter: true,
                    DropdownSearch: true,
                },
            },
        })
        await flushPromises()
        
        expect(useApi).toHaveBeenCalledWith('/api/places', 'GET')
        expect(wrapper.findComponent(TheMap).props('pointsOfInterest')).toEqual(
            mockPlaces.map(place => ({
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
            }))
        )
    })

    it('should handle search results', async () => {
        const wrapper = mount(App, {
            global: {
                stubs: {
                    TheMap: true,
                    TheHeader: true,
                    TheFooter: true,
                    DropdownSearch: true,
                },
            },
        })
        await flushPromises()
        
        const searchResults = [
            {
                name: 'Search Place',
                location_name: 'Search Location',
                category: 'Search Category',
                points: {
                    type: 'Point',
                    coordinates: {
                        lat: 3.456,
                        lon: 6.789,
                    },
                    place_id: 'search-id',
                },
            },
        ]
        
        await wrapper.findComponent(DropdownSearch).vm.$emit('search', searchResults)
        
        const expectedPoints = [
            ...mockPlaces,
            ...searchResults.map(place => ({
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
            })),
        ]
        
        expect(wrapper.findComponent(TheMap).props('pointsOfInterest')).toEqual(expectedPoints)
    })

    it('should handle empty search results', async () => {
        const wrapper = mount(App, {
            global: {
                stubs: {
                    TheMap: true,
                    TheHeader: true,
                    TheFooter: true,
                    DropdownSearch: true,
                },
            },
        })
        await flushPromises()
        
        await wrapper.findComponent(DropdownSearch).vm.$emit('search', [])
        
        expect(wrapper.findComponent(TheMap).props('pointsOfInterest')).toEqual(mockPlaces)
    })

    it('should handle API error gracefully', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const error = new Error('API Error')
        
        // Mock the API call to reject before mounting
        vi.mocked(useApi).mockRejectedValueOnce(error)
        
        const wrapper = mount(App, {
            global: {
                stubs: {
                    TheMap: true,
                    TheHeader: true,
                    TheFooter: true,
                    DropdownSearch: true,
                },
                config: {
                    errorHandler: (err: unknown) => {
                        console.error(err)
                    },
                },
            },
        })
        
        await flushPromises()
        
        expect(wrapper.findComponent(TheMap).props('pointsOfInterest')).toEqual([])
        expect(errorSpy).toHaveBeenCalledWith(error)
        
        errorSpy.mockRestore()
    })

    it('should handle non-array API response gracefully', async () => {
        vi.mocked(useApi).mockResolvedValue('invalid response' as any)
        const wrapper = mount(App, {
            global: {
                stubs: {
                    TheMap: true,
                    TheHeader: true,
                    TheFooter: true,
                    DropdownSearch: true,
                },
            },
        })
        await flushPromises()
        
        expect(wrapper.findComponent(TheMap).props('pointsOfInterest')).toEqual([])
    })

    it('should have correct responsive classes', () => {
        const wrapper = mount(App, {
            global: {
                stubs: {
                    TheMap: true,
                    TheHeader: true,
                    TheFooter: true,
                    DropdownSearch: true,
                },
            },
        })
        
        const mainContainer = wrapper.find('.mx-auto')
        expect(mainContainer.classes()).toContain('max-w-3xl')
        expect(mainContainer.classes()).toContain('lg:max-w-[96rem]')
        expect(mainContainer.classes()).toContain('lg:px-8')
        
        const grid = wrapper.find('.grid')
        expect(grid.classes()).toContain('grid-cols-1')
        expect(grid.classes()).toContain('lg:grid-cols-3')
        expect(grid.classes()).toContain('gap-4')
        expect(grid.classes()).toContain('lg:gap-8')
    })
})
