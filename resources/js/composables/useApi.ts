'use strict';

const useApi = async (url: string, method: string) => {
    if (!url) {
        return []
    }

    if (!method) {
        method = 'GET'
    }

    const requestOptions = { method };

    try {
        const response = await fetch(
            url,
            requestOptions
        )
        return await response.json()
    } catch (error) {
        console.error('Error:', error)
    }
}

export { useApi };
