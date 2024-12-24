import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DropdownSearch from './DropdownSearch.vue'
import { useGeocoding, usePlaces } from '../composables/useGeoapify'
import { useDebouncer } from '../composables/useDebouncer'

// Mock the composables
vi.mock('../composables/useGeoapify')
vi.mock('../composables/useDebouncer', () => ({
    useDebouncer: vi.fn((fn) => fn),
}))

const mockGeocodingResponse = {
    features: [
        {
            properties: {
                formatted: 'Amsterdam, Netherlands',
                category: 'city',
                lat: 52.3676,
                lon: 4.9041,
                place_id: 'amsterdam-123',
            },
        },
    ],
}

const mockPlacesResponse = {
    features: [
        {
            properties: {
                name: 'Anne Frank House',
                formatted: 'Anne Frank House, Amsterdam',
                categories: ['museum'],
                lat: 52.3752,
                lon: 4.8840,
                place_id: 'anne-frank-house-123',
            },
        },
        {
            properties: {
                name: 'Rijksmuseum',
                formatted: 'Rijksmuseum, Amsterdam',
                categories: ['museum'],
                lat: 52.3600,
                lon: 4.8852,
                place_id: 'rijksmuseum-123',
            },
        },
    ],
}

describe('DropdownSearch', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useGeocoding).mockResolvedValue(mockGeocodingResponse)
        vi.mocked(usePlaces).mockResolvedValue(mockPlacesResponse)
    })

    it('should mount successfully', () => {
        const wrapper = mount(DropdownSearch)
        expect(wrapper.exists()).toBe(true)
    })

    it('should render the correct structure', () => {
        const wrapper = mount(DropdownSearch)
        
        expect(wrapper.find('label[for="places"]').exists()).toBe(true)
        expect(wrapper.find('input#places').exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'TheLoader' }).exists()).toBe(true)
    })

    it('should have correct initial state', () => {
        const wrapper = mount(DropdownSearch)
        
        expect(wrapper.vm.places).toEqual([])
        expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should handle input changes and trigger search', async () => {
        const wrapper = mount(DropdownSearch)
        const input = wrapper.find('input')
        
        await input.setValue('Amsterdam')
        await input.trigger('input')
        await flushPromises()
        
        expect(useGeocoding).toHaveBeenCalledWith('Amsterdam')
        expect(usePlaces).toHaveBeenCalledWith('amsterdam-123')
        expect(wrapper.emitted('search')).toBeTruthy()
    })

    it('should handle empty input', async () => {
        const wrapper = mount(DropdownSearch)
        const input = wrapper.find('input')
        
        await input.setValue('')
        await input.trigger('input')
        await flushPromises()
        
        expect(useGeocoding).not.toHaveBeenCalled()
        expect(usePlaces).not.toHaveBeenCalled()
        expect(wrapper.emitted('search')?.[0]).toEqual([[]])
    })

    it('should show loading state during API calls', async () => {
        let resolveGeocoding: (value: any) => void
        const geocodingPromise = new Promise((resolve) => {
            resolveGeocoding = resolve
        })
        
        vi.mocked(useGeocoding).mockImplementation(() => geocodingPromise as Promise<any>)
        
        const wrapper = mount(DropdownSearch)
        const input = wrapper.find('input')
        
        await input.setValue('Amsterdam')
        await input.trigger('input')
        
        expect(wrapper.vm.isLoading).toBe(true)
        
        resolveGeocoding!(mockGeocodingResponse)
        await flushPromises()
        
        expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should handle API errors gracefully', async () => {
        vi.mocked(useGeocoding).mockRejectedValue(new Error('API Error'))
        const wrapper = mount(DropdownSearch)
        const input = wrapper.find('input')
        
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        
        await input.setValue('Amsterdam')
        await input.trigger('input')
        await flushPromises()
        
        expect(consoleSpy).toHaveBeenCalled()
        expect(wrapper.vm.isLoading).toBe(false)
        
        consoleSpy.mockRestore()
    })

    it('should handle focus event and clear input', async () => {
        const wrapper = mount(DropdownSearch)
        const input = wrapper.find('input')
        
        await input.setValue('Amsterdam')
        await input.trigger('focus')
        
        expect(input.element.value).toBe('')
        expect(wrapper.vm.places).toEqual([])
    })

    it('should transform geocoding results correctly', async () => {
        const wrapper = mount(DropdownSearch)
        const input = wrapper.find('input')
        
        await input.setValue('Amsterdam')
        await input.trigger('input')
        await flushPromises()
        
        const emittedSearch = wrapper.emitted('search')?.[0][0]
        expect(emittedSearch[0]).toEqual({
            name: 'Amsterdam, Netherlands',
            location_name: 'Amsterdam, Netherlands',
            category: 'city',
            points: {
                type: 'Point',
                coordinates: {
                    lat: 52.3676,
                    lon: 4.9041,
                },
                place_id: 'amsterdam-123',
            },
        })
    })

    it('should transform places results correctly', async () => {
        const wrapper = mount(DropdownSearch)
        const input = wrapper.find('input')
        
        await input.setValue('Amsterdam')
        await input.trigger('input')
        await flushPromises()
        
        const emittedSearch = wrapper.emitted('search')?.[0][0]
        expect(emittedSearch).toHaveLength(3) // 1 geocoding result + 2 places
        expect(emittedSearch[1]).toEqual({
            name: 'Anne Frank House',
            location_name: 'Anne Frank House, Amsterdam',
            category: ['museum'],
            points: {
                type: 'Point',
                coordinates: {
                    lat: 52.3752,
                    lon: 4.8840,
                },
                place_id: 'anne-frank-house-123',
            },
        })
    })

    it('should handle missing properties in API responses', async () => {
        vi.mocked(useGeocoding).mockResolvedValue({
            features: [
                {
                    properties: {
                        lat: 52.3676,
                        lon: 4.9041,
                        place_id: 'incomplete-123',
                        formatted: undefined,
                        category: undefined,
                    },
                },
            ],
        })
        vi.mocked(usePlaces).mockResolvedValue({ features: [] })
        
        const wrapper = mount(DropdownSearch)
        const input = wrapper.find('input')
        
        await input.setValue('Amsterdam')
        await input.trigger('input')
        await flushPromises()
        
        const emittedSearch = wrapper.emitted('search')?.[0][0]
        expect(emittedSearch[0]).toEqual({
            name: undefined,
            location_name: undefined,
            category: 'unknown',
            points: {
                type: 'Point',
                coordinates: {
                    lat: 52.3676,
                    lon: 4.9041,
                },
                place_id: 'incomplete-123',
            },
        })
    })

    it('should have correct accessibility attributes', () => {
        const wrapper = mount(DropdownSearch)
        
        const label = wrapper.find('label')
        const input = wrapper.find('input')
        
        expect(label.attributes('for')).toBe('places')
        expect(input.attributes('id')).toBe('places')
        expect(input.attributes('name')).toBe('places')
        expect(input.attributes('placeholder')).toBe('Provide a location name (eg. Amsterdam)')
    })
})
