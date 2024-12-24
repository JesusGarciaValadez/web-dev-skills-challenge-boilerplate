import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TheLoader from './TheLoader.vue'

describe('TheLoader', () => {
    it('should mount successfully', () => {
        const wrapper = mount(TheLoader, {
            props: {
                isLoading: true
            }
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('should show loader when isLoading is true', () => {
        const wrapper = mount(TheLoader, {
            props: {
                isLoading: true
            }
        })
        
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('svg').exists()).toBe(true)
        expect(wrapper.find('[dusk="loading-text"]').text()).toBe('Loading...')
    })

    it('should hide loader when isLoading is false', () => {
        const wrapper = mount(TheLoader, {
            props: {
                isLoading: false
            }
        })
        
        expect(wrapper.find('svg').exists()).toBe(false)
        expect(wrapper.find('[dusk="loading-text"]').exists()).toBe(false)
    })

    it('should have correct CSS classes for positioning', () => {
        const wrapper = mount(TheLoader, {
            props: {
                isLoading: true
            }
        })
        
        const container = wrapper.find('div')
        expect(container.classes()).toContain('absolute')
        expect(container.classes()).toContain('top-0')
        expect(container.classes()).toContain('right-0')
        expect(container.classes()).toContain('mt-2')
        expect(container.classes()).toContain('mr-2')
        expect(container.classes()).toContain('flex')
        expect(container.classes()).toContain('items-center')
    })

    it('should have correct CSS classes for spinner animation', () => {
        const wrapper = mount(TheLoader, {
            props: {
                isLoading: true
            }
        })
        
        const spinner = wrapper.find('svg')
        expect(spinner.classes()).toContain('animate-spin')
        expect(spinner.classes()).toContain('h-5')
        expect(spinner.classes()).toContain('w-5')
        expect(spinner.classes()).toContain('text-blue-500')
    })

    it('should have correct CSS classes for loading text', () => {
        const wrapper = mount(TheLoader, {
            props: {
                isLoading: true
            }
        })
        
        const text = wrapper.find('[dusk="loading-text"]')
        expect(text.classes()).toContain('ml-1')
        expect(text.classes()).toContain('text-xs')
        expect(text.classes()).toContain('text-gray-500')
    })

    it('should update visibility when isLoading prop changes', async () => {
        const wrapper = mount(TheLoader, {
            props: {
                isLoading: false
            }
        })
        
        expect(wrapper.find('svg').exists()).toBe(false)
        
        await wrapper.setProps({ isLoading: true })
        expect(wrapper.find('svg').exists()).toBe(true)
        
        await wrapper.setProps({ isLoading: false })
        expect(wrapper.find('svg').exists()).toBe(false)
    })

    it('should validate isLoading prop type', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        
        mount(TheLoader, {
            props: {
                // @ts-expect-error - Testing invalid prop type
                isLoading: 'not-a-boolean'
            }
        })
        
        expect(warn).toHaveBeenCalled()
        warn.mockRestore()
    })
})
