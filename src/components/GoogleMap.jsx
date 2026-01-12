import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

export default function GoogleMap({ center, zoom = 15 }) {
    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_GEOCODING_API_KEY}>
            <div className="h-full w-full">
                <Map
                    defaultZoom={zoom}
                    defaultCenter={center}
                    mapId={import.meta.env.VITE_GOOGLE_MAP_MAP_ID}
                    gestureHandling="auto"
                    scrollwheel={true}
                >
                    <AdvancedMarker position={center} />
                </Map>
            </div>
        </APIProvider>
    );
}
