import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TheHeader from './TheHeader.vue'

describe('TheHeader', () => {
    it('should mount successfully', () => {
        const wrapper = mount(TheHeader)
        expect(wrapper.exists()).toBe(true)
    })

    it('should render the correct structure', () => {
        const wrapper = mount(TheHeader)
        expect(wrapper.find('header').exists()).toBe(true)
        expect(wrapper.find('img').exists()).toBe(true)
        expect(wrapper.find('h1').exists()).toBe(true)
    })

    it('should have correct CSS classes for styling', () => {
        const wrapper = mount(TheHeader)
        
        expect(wrapper.find('header').classes()).toContain('bg-teal-400')
        expect(wrapper.find('header').classes()).toContain('pb-24')
        
        const container = wrapper.find('.mx-auto')
        expect(container.classes()).toContain('max-w-3xl')
        expect(container.classes()).toContain('lg:max-w-7xl')
        expect(container.classes()).toContain('lg:px-8')
        expect(container.classes()).toContain('px-4')
        expect(container.classes()).toContain('sm:px-6')
    })

    it('should display correct text content', () => {
        const wrapper = mount(TheHeader)
        
        expect(wrapper.find('[dusk="name"]').text()).toBe('Jesus Garcia Valadez')
        expect(wrapper.find('[dusk="title"]').text()).toBe('Geophy Skills Challenge')
    })

    it('should have correct image attributes', () => {
        const wrapper = mount(TheHeader)
        const img = wrapper.find('img')
        
        expect(img.attributes('src')).toBe('https://tailwindui.com/plus/img/logos/mark.svg?color=teal&shade=200')
        expect(img.attributes('alt')).toBe('Your Company')
        expect(img.classes()).toContain('h-8')
        expect(img.classes()).toContain('w-auto')
    })

    it('should have accessible elements', () => {
        const wrapper = mount(TheHeader)
        
        expect(wrapper.find('[dusk="name"]').attributes('class')).toContain('sr-only')
        expect(wrapper.find('a').exists()).toBe(true)
    })

    it('should have responsive layout classes', () => {
        const wrapper = mount(TheHeader)
        
        const logoContainer = wrapper.find('.absolute.left-0')
        expect(logoContainer.classes()).toContain('lg:static')
        
        const titleContainer = wrapper.find('.lg\\:ml-4')
        expect(titleContainer.classes()).toContain('lg:flex')
        expect(titleContainer.classes()).toContain('lg:items-center')
    })
})
