interface Place {
    name: string,
    location_name: string,
    category: string,
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
