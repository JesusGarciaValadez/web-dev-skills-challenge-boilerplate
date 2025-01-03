import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createApp } from 'vue'
import AppComponent from './components/App.vue'

// Create a mock app instance
const mockApp = {
    mount: vi.fn(),
    mixin: vi.fn()
}

// Mock createApp to return our mock app instance
vi.mock('vue', () => ({
    createApp: vi.fn(() => mockApp)
}))

vi.mock('./components/App.vue', () => ({
    default: {}
}))

describe('app.js', () => {
    beforeEach(() => {
        // Clear the document body classes before each test
        document.body.className = ''
        // Reset all mocks
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.clearAllMocks()
        // Clear any modules cache
        vi.resetModules()
    })

    it('should create and mount the Vue app', async () => {
        await import('./app')

        expect(createApp).toHaveBeenCalledWith(AppComponent)
        expect(createApp).toHaveBeenCalledTimes(1)
        expect(mockApp.mount).toHaveBeenCalledWith('#app')
        expect(mockApp.mount).toHaveBeenCalledTimes(1)
    })

    it('should add mixin that adds vue-mounted class to body', async () => {
        await import('./app')

        expect(mockApp.mixin).toHaveBeenCalledTimes(1)

        // Get the mixin object that was passed
        const mixin = mockApp.mixin.mock.calls[0][0]
        expect(mixin).toHaveProperty('mounted')

        // Call the mounted hook manually
        mixin.mounted()

        expect(document.body.classList.contains('vue-mounted')).toBe(true)
    })

    it('should handle multiple mixin mounted calls gracefully', async () => {
        await import('./app')

        const mixin = mockApp.mixin.mock.calls[0][0]

        // Call mounted hook multiple times
        mixin.mounted()
        mixin.mounted()
        mixin.mounted()

        // Class should still be there and no duplicates
        expect(document.body.classList.contains('vue-mounted')).toBe(true)
        expect(document.body.className.split(' ').filter(c => c === 'vue-mounted').length).toBe(1)
    })

    it('should handle pre-existing body classes', async () => {
        // Add some pre-existing classes
        document.body.classList.add('existing-class')
        document.body.classList.add('another-class')

        await import('./app')

        const mixin = mockApp.mixin.mock.calls[0][0]

        mixin.mounted()

        // Check that existing classes are preserved
        expect(document.body.classList.contains('existing-class')).toBe(true)
        expect(document.body.classList.contains('another-class')).toBe(true)
        expect(document.body.classList.contains('vue-mounted')).toBe(true)
    })

    it('should handle empty body class list', async () => {
        // Ensure body has no classes
        document.body.className = ''

        await import('./app')

        const mixin = mockApp.mixin.mock.calls[0][0]

        mixin.mounted()

        // Should only have vue-mounted class
        expect(document.body.className).toBe('vue-mounted')
    })
})
