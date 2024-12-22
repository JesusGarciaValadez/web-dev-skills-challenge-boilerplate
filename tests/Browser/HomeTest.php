<?php

namespace Tests\Browser;

//use Illuminate\Foundation\Testing\DatabaseTruncation;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class HomeTest extends DuskTestCase
{
    /**
     * Test the first loaded application flow.
     */
    public function test_loading_map(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                ->assertDontSee('Loading application...')
                ->assertSeeIn('@name', 'Jesus Garcia Valadez')
                ->assertSeeIn('@title', 'Geophy Skills Challenge')

                ->assertSeeIn('@places-of-interest-search-label', 'Places of interest search')
                ->assertPresent('#places')
                ->assertInputPresent('places')
                ->assertAttribute(
                    '@places-of-interest-search-input',
                    'placeholder',
                    'Provide a location name (eg. Amsterdam)'
                )

                // Verify map container exists
                ->assertPresent('#map')
                ->waitFor('.mapboxgl-canvas', 30)
                ->assertPresent('.mapboxgl-canvas')
                ->assertPresent('.mapboxgl-ctrl-top-left')
                ->assertPresent('.mapboxgl-ctrl-top-right')

                // Verify markers appear on map
                ->waitUntil("document.querySelectorAll('.mapboxgl-marker').length === 5")
                ->assertPresent('.mapboxgl-canvas')
                ->assertPresent('@marker-Breda')

                // Verify footer content
                ->assertSeeIn('@copyright-one', '© 2024 Jesus Garcia Valadez, Inc.')
                ->assertSeeIn('@copyright-two', 'All rights reserved.')
            ;
        });
    }

    /**
     * Test the main application flow.
     */
    public function test_happy_path(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                ->assertDontSee('Loading application...')
                ->assertSeeIn('@name', 'Jesus Garcia Valadez')
                ->assertSeeIn('@title', 'Geophy Skills Challenge')

                ->assertSeeIn('@places-of-interest-search-label', 'Places of interest search')
                ->assertPresent('#places')
                ->assertInputPresent('places')
                ->assertAttribute(
                    '@places-of-interest-search-input',
                    'placeholder',
                    'Provide a location name (eg. Amsterdam)'
                )

                // Verify map container exists
                ->assertPresent('#map')
                ->waitFor('.mapboxgl-canvas', 30)
                ->assertPresent('.mapboxgl-canvas')
                ->assertPresent('.mapboxgl-ctrl-top-left')
                ->assertPresent('.mapboxgl-ctrl-top-right')

                // Test search functionality
                ->click('@places-of-interest-search-input')
                ->type('@places-of-interest-search-input', 'Amsterdam')
                ->pause(1000)

                // Verify loading state
                ->waitFor('.animate-spin', 30)
                ->assertSeeIn('@loading-text', 'Loading...')

                // Wait for API results
                ->waitUntilMissing('.animate-spin', 30)
                ->assertMissing('.animate-spin')

                // Verify markers appear on map
                ->assertPresent('.mapboxgl-canvas')
                ->assertPresent('@marker-Zaanstad')

                // Test marker interaction
                ->mouseover('@marker-Zaanstad')
                ->waitUntil("document.querySelectorAll('.mapboxgl-popup').length > 0")

                // Verify footer content
                ->assertSeeIn('@copyright-one', '© 2024 Jesus Garcia Valadez, Inc.')
                ->assertSeeIn('@copyright-two', 'All rights reserved.')
            ;
        });
    }
}
