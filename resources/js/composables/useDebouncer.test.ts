import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebouncer } from './useDebouncer'

describe('useDebouncer composable', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        vi.useRealTimers()
    })

    it('should debounce a function', () => {
        const callback = vi.fn()
        const debouncedFunction = useDebouncer(callback, 200)

        debouncedFunction()
        debouncedFunction()
        debouncedFunction()

        expect(callback).not.toHaveBeenCalled()

        vi.advanceTimersByTime(200)
        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments to the debounced function', () => {
        const callback = vi.fn()
        const debouncedFunction = useDebouncer(callback, 200)
        const testArg = { test: 'value' }

        debouncedFunction(testArg)
        vi.advanceTimersByTime(200)

        expect(callback).toHaveBeenCalledWith(testArg)
    })

    it('should cancel previous timeout on rapid calls', () => {
        const callback = vi.fn()
        const debouncedFunction = useDebouncer(callback, 200)

        debouncedFunction()
        vi.advanceTimersByTime(100) // Advance halfway
        debouncedFunction() // Reset the timer
        vi.advanceTimersByTime(100) // Advance halfway again

        expect(callback).not.toHaveBeenCalled()

        vi.advanceTimersByTime(100) // Complete the second timer
        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle zero delay', () => {
        const callback = vi.fn()
        const debouncedFunction = useDebouncer(callback, 0)

        debouncedFunction()
        vi.advanceTimersByTime(0)

        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple arguments', () => {
        const callback = vi.fn()
        const debouncedFunction = useDebouncer(callback, 200)
        const arg1 = 'test'
        const arg2 = 123
        const arg3 = { key: 'value' }

        debouncedFunction(arg1, arg2, arg3)
        vi.advanceTimersByTime(200)

        expect(callback).toHaveBeenCalledWith(arg1, arg2, arg3)
    })

    it('should maintain the last call context', () => {
        const callback = vi.fn()
        const debouncedFunction = useDebouncer(callback, 200)
        
        debouncedFunction('first')
        debouncedFunction('second')
        debouncedFunction('third')
        
        vi.advanceTimersByTime(200)
        
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith('third')
    })

    it('should handle negative delay as zero', () => {
        const callback = vi.fn()
        const debouncedFunction = useDebouncer(callback, -100)

        debouncedFunction()
        vi.advanceTimersByTime(0)

        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle non-numeric delay as zero', () => {
        const callback = vi.fn()
        // @ts-expect-error Testing invalid input
        const debouncedFunction = useDebouncer(callback, 'invalid')

        debouncedFunction()
        vi.advanceTimersByTime(0)

        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle undefined delay as zero', () => {
        const callback = vi.fn()
        // @ts-expect-error Testing invalid input
        const debouncedFunction = useDebouncer(callback)

        debouncedFunction()
        vi.advanceTimersByTime(0)

        expect(callback).toHaveBeenCalledTimes(1)
    })
})
