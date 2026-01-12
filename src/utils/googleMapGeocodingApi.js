export default function googleMapGeocodingApi(locationQuery) {
    const googleMapGeocodingApiKey = import.meta.env.VITE_GOOGLE_MAP_GEOCODING_API_KEY;
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${locationQuery}&key=${googleMapGeocodingApiKey}`)
        .then(res => res.json()).then((data) => {
        let region;
        let country;
        if (data.status === "OK") {
            if (data.results[0].address_components.length === 1) {
                region = data.results[0].address_components[0].long_name;
                country = data.results[0].address_components[0].long_name;
            } else if (data.results[0].address_components.length === 2) {
                region = data.results[0].address_components[1].long_name;
                country = data.results[0].address_components[1].long_name;
            } else if (data.results[0].address_components.length === 3) {
                region = data.results[0].address_components[1].long_name;
                country = data.results[0].address_components[2].long_name;
            } else {
                region = data.results[0].address_components[2].long_name;
                country = data.results[0].address_components[3].long_name;
            }
            return {
                city: data.results[0].address_components[0].long_name,
                region:  region,
                country: country,
                latitude: data.results[0].geometry.location.lat,
                longitude: data.results[0].geometry.location.lng,
        }
        }
        return data
    })
}
