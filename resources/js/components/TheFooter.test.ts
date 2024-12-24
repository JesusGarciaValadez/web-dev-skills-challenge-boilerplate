import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TheFooter from './TheFooter.vue'

describe('TheFooter', () => {
    it('should mount successfully', () => {
        const wrapper = mount(TheFooter)
        expect(wrapper.exists()).toBe(true)
    })

    it('should render the correct structure', () => {
        const wrapper = mount(TheFooter)
        expect(wrapper.find('footer').exists()).toBe(true)
        expect(wrapper.find('[dusk="copyright-one"]').exists()).toBe(true)
        expect(wrapper.find('[dusk="copyright-two"]').exists()).toBe(true)
    })

    it('should have correct CSS classes for styling', () => {
        const wrapper = mount(TheFooter)
        
        const container = wrapper.find('.mx-auto')
        expect(container.classes()).toContain('max-w-3xl')
        expect(container.classes()).toContain('lg:max-w-7xl')
        expect(container.classes()).toContain('lg:px-8')
        expect(container.classes()).toContain('px-4')
        expect(container.classes()).toContain('sm:px-6')
        
        const content = wrapper.find('.border-t')
        expect(content.classes()).toContain('border-gray-200')
        expect(content.classes()).toContain('py-8')
        expect(content.classes()).toContain('text-center')
        expect(content.classes()).toContain('text-sm')
        expect(content.classes()).toContain('text-gray-500')
        expect(content.classes()).toContain('sm:text-left')
    })

    it('should display correct copyright text', () => {
        const wrapper = mount(TheFooter)
        
        const currentYear = new Date().getFullYear()
        expect(wrapper.find('[dusk="copyright-one"]').text()).toBe(`© ${currentYear} Jesus Garcia Valadez, Inc.`)
        expect(wrapper.find('[dusk="copyright-two"]').text()).toBe('All rights reserved.')
    })

    it('should have responsive text alignment', () => {
        const wrapper = mount(TheFooter)
        
        const content = wrapper.find('.text-center')
        expect(content.classes()).toContain('sm:text-left')
    })

    it('should have correct span element styling', () => {
        const wrapper = mount(TheFooter)
        
        const spans = wrapper.findAll('span')
        spans.forEach(span => {
            expect(span.classes()).toContain('block')
            expect(span.classes()).toContain('sm:inline')
        })
    })

    it('should have proper spacing and border', () => {
        const wrapper = mount(TheFooter)
        
        const container = wrapper.find('.border-t')
        expect(container.classes()).toContain('border-gray-200')
        expect(container.classes()).toContain('py-8')
    })
})
