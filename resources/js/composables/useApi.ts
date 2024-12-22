'use strict';

const useApi = async (url: string, method: string) => {
    const requestOptions = { method };

    const response = await fetch(
        url,
        requestOptions
    )
    return await response.json()
}

export { useApi };
