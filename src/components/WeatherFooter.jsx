export default function WeatherFooter() {
    return (
        <footer className="mx-5 my-4 justify-between text-xs text-slate-500">
            <p>Data Source :  Abstractapi-Geolocation | Open-Meteo | Google Map - Geocoding</p>
            <div className="flex items-center gap-2 mt-5">
                <a href="#" className="hover:underline">
                    View on GitHub
                </a>
            </div>
        </footer>
    )
}