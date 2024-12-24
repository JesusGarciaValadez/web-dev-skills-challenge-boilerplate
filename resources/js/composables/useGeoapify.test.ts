import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useGeocoding, usePlaces } from './useGeoapify'

describe('useGeoapify composables', () => {
    beforeEach(() => {
        // Setup fetch mock before each test
        global.fetch = vi.fn()
        // Mock environment variable
        vi.stubEnv('VITE_GEOAPIFY_ACCESS_TOKEN', 'test_api_key')
    })

    afterEach(() => {
        // Clean up after each test
        vi.restoreAllMocks()
        vi.unstubAllEnvs()
    })

    describe('useGeocoding', () => {
        it('should fetch geocoding data successfully', async () => {
            const mockResponse = {
                features: [{
                    properties: {
                        formatted: 'Amsterdam, Netherlands',
                        place_id: 'test_place_id',
                        lat: 52.3730796,
                        lon: 4.8924534,
                        category: 'populated_place'
                    }
                }]
            }
            
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })

            const data = await useGeocoding('Amsterdam')
            expect(data).toBeDefined()
            expect(data.features[0].properties.formatted).toBe('Amsterdam, Netherlands')
            
            const callUrl = (fetch as jest.Mock).mock.calls[0][0]
            const params = new URLSearchParams(new URL(callUrl).search)
            expect(params.get('text')).toBe('Amsterdam')
            expect(params.get('apiKey')).toBe('test_api_key')
        })

        it('should handle empty search query', async () => {
            const data = await useGeocoding('')
            expect(data.features).toEqual([])
        })

        it('should properly encode search query parameters', async () => {
            const mockResponse = { features: [] }
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })

            await useGeocoding('New York City, USA')
            const callUrl = (fetch as jest.Mock).mock.calls[0][0]
            const params = new URLSearchParams(new URL(callUrl).search)
            expect(params.get('text')).toBe('New York City, USA')
        })

        it('should handle special characters in search query', async () => {
            const mockResponse = { features: [] }
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })

            await useGeocoding('São Paulo, Brasil')
            const callUrl = (fetch as jest.Mock).mock.calls[0][0]
            const params = new URLSearchParams(new URL(callUrl).search)
            expect(params.get('text')).toBe('São Paulo, Brasil')
        })

        it('should handle missing API key', async () => {
            vi.unstubAllEnvs()
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            
            const data = await useGeocoding('Amsterdam')
            expect(data).toBeUndefined()
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error:',
                expect.any(Error)
            )
            consoleSpy.mockRestore()
        })

        it('should handle network errors', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))
            
            const data = await useGeocoding('Amsterdam')
            expect(data).toBeUndefined()
            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockRestore()
        })
    })

    describe('usePlaces', () => {
        it('should fetch places data successfully', async () => {
            const mockResponse = {
                features: [{
                    properties: {
                        name: 'Test Place',
                        formatted: 'Test Location',
                        categories: ['tourism.sights'],
                        lat: 52.3730796,
                        lon: 4.8924534,
                        place_id: 'test_place_id'
                    }
                }]
            }
            
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })

            const data = await usePlaces('test_place_id')
            expect(data).toBeDefined()
            expect(data.features[0].properties.name).toBe('Test Place')
            
            const callUrl = (fetch as jest.Mock).mock.calls[0][0]
            const params = new URLSearchParams(new URL(callUrl).search)
            expect(params.get('apiKey')).toBe('test_api_key')
        })

        it('should return empty array for empty place_id', async () => {
            const data = await usePlaces('')
            expect(data).toEqual([])
        })

        it('should include all categories in the request', async () => {
            const mockResponse = { features: [] }
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })

            await usePlaces('test_place_id')
            
            const callUrl = (fetch as jest.Mock).mock.calls[0][0]
            const params = new URLSearchParams(new URL(callUrl).search)
            
            // Verify that the URL contains all required categories
            const categories = params.get('categories')?.split(',') || []
            expect(categories).toContain('accommodation')
            expect(categories).toContain('activity')
            expect(categories).toContain('adult')
            expect(categories).toContain('administrative')
            
            // Verify other URL parts
            expect(params.get('filter')).toBe('place:test_place_id')
            expect(params.get('limit')).toBe('100')
            expect(params.get('apiKey')).toBe('test_api_key')
        })

        it('should handle missing API key', async () => {
            vi.unstubAllEnvs()
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            
            const data = await usePlaces('test_place_id')
            expect(data).toBeUndefined()
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error fetching places: ',
                expect.any(Error)
            )
            consoleSpy.mockRestore()
        })

        it('should handle malformed response data', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ malformed: 'data' })
            })
            
            const data = await usePlaces('test_place_id')
            expect(data.features).toBeUndefined()
            expect(consoleSpy).not.toHaveBeenCalled()
            consoleSpy.mockRestore()
        })

        it('should handle rate limit exceeded response', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: false,
                status: 429,
                json: () => Promise.resolve({ error: 'Rate limit exceeded' })
            })
            
            const data = await usePlaces('test_place_id')
            expect(data).toBeUndefined()
            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockRestore()
        })

        it('should handle invalid place_id format', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: () => Promise.resolve({ error: 'Invalid place_id format' })
            })
            
            const data = await usePlaces('invalid_format')
            expect(data).toBeUndefined()
            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockRestore()
        })
    })
})
