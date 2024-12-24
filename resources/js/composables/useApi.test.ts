import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useApi } from './useApi'

describe('useApi composable', () => {
    beforeEach(() => {
        // Setup fetch mock before each test
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        // Clean up after each test
        vi.restoreAllMocks()
    })

    it('should return data for a valid URL', async () => {
        const mockData = { id: 1, title: 'Test Todo' }
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData)
        })

        const data = await useApi('https://jsonplaceholder.typicode.com/todos/1', 'GET')
        expect(data).toBeDefined()
        expect(data.id).toBe(1)
    })

    it('should return an empty array for an empty URL', async () => {
        const data = await useApi('', 'GET')
        expect(data).toEqual([])
    })

    it('should use GET as default method when no method provided', async () => {
        const mockData = { id: 1 }
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData)
        })

        const data = await useApi('https://api.example.com', '')
        expect(data).toBeDefined()
        
        expect(fetch).toHaveBeenCalledWith(
            'https://api.example.com',
            expect.objectContaining({ method: 'GET' })
        )
    })

    it('should handle network errors gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        fetch.mockRejectedValueOnce(new Error('Network error'))

        const data = await useApi('https://api.example.com', 'GET')
        expect(data).toBeUndefined()
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
    })

    it('should handle non-200 responses gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: () => Promise.resolve({ error: 'Not found' })
        })

        const data = await useApi('https://api.example.com', 'GET')
        expect(data).toBeUndefined()
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
    })

    it('should handle malformed JSON responses', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.reject(new Error('Invalid JSON'))
        })

        const data = await useApi('https://api.example.com', 'GET')
        expect(data).toBeUndefined()
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
    })

    it('should handle rate limit responses', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 429,
            json: () => Promise.resolve({ error: 'Too many requests' })
        })

        const data = await useApi('https://api.example.com', 'GET')
        expect(data).toBeUndefined()
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
    })

    it('should handle server errors', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ error: 'Internal server error' })
        })

        const data = await useApi('https://api.example.com', 'GET')
        expect(data).toBeUndefined()
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
    })

    it('should handle invalid URLs', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        fetch.mockRejectedValueOnce(new TypeError('Invalid URL'))

        const data = await useApi('invalid-url', 'GET')
        expect(data).toBeUndefined()
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
    })

    it('should handle timeout errors', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        fetch.mockRejectedValueOnce(new Error('Timeout'))

        const data = await useApi('https://api.example.com', 'GET')
        expect(data).toBeUndefined()
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
    })
})
