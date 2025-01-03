'use strict';

/**
 *
 */
const useApi = async (url: string, method: string) => {
    if (!url) {
        return []
    }

    if (!method) {
        method = 'GET'
    }

    const requestOptions = { method };

    try {
        // Handle both absolute and relative URLs
        const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
        new URL(fullUrl);

        const response = await fetch(
            fullUrl,
            requestOptions
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json()
    } catch (error) {
        console.error('Error:', error)
        return undefined
    }
}

export { useApi };
