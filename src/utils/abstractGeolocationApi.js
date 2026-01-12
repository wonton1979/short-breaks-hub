export default function abstractGeolocationApi() {
    const abstractGeolocationApiKey = import.meta.env.VITE_ABSTRACT_GEOLOCATION_API_KEY
    return  fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${abstractGeolocationApiKey}`)
        .then(response => response.ok ? response.json() : undefined)
        .then(({city,region,country,longitude,latitude,timezone}) => {
            return {"city":city,"region":region,"country":country,"longitude":longitude,"latitude":latitude,"timezone": timezone.abbreviation};
        })
        .catch(error => console.log(error.message));
}
