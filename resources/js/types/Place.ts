interface Place {
    name: string,
    location_name: string,
    category: Array<string> | string,
    points: {
        type: string,
        coordinates: {
            lon: number,
            lat: number
        },
        place_id: string
    }
}

export { Place };
