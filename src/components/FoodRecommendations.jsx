import React, {useId, useState} from "react";
import MapModal from "./MapModal";
import GoogleMap from "./GoogleMap";
import {loadSubFolderImages} from "../utils/loadImage.js";

export default function FoodRecommendations({ data, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    const contentId = useId();
    const [mapOpen, setMapOpen] = useState(false);
    const [mapPlace, setMapPlace] = useState(null);

    const openMapForPlace = (place) => {
        setMapPlace(place);
        setMapOpen(true);
    };



    // Hardcoded fallback data (so you can see the UI immediately)
    const fallback = {
        mustTry: ["Nasi Lemak", "Roti Canai", "Satay", "Laksa", "Char Kway Teow", "Teh Tarik"],
        areas: [
            {
                name: "KLCC",
                note: "Easy mall dining + Malaysian classics. Good for a quick lunch between sights.",
            },
            {
                name: "Chinatown / Central Market",
                note: "Old-school coffee shops, hawker-style bites, great for late afternoon + dinner.",
            },
            {
                name: "Bukit Bintang",
                note: "Street food + lively night scene. Ideal for a casual evening.",
            },
        ],
        places: [
            {
                name: "Jalan Alor Food Street",
                area: "Bukit Bintang",
                reason: "Iconic street-food vibe with many stalls.",
                imageUrl: "/src/assets/itineraries/malaysia/kuala-lumpur-food/jalan-alor-food-street.jpg",
                lat: 3.1457,
                lng: 101.7083
            },
            {
                name: "Madam Kwan’s",
                area: "KLCC",
                reason: "Popular spot for Malaysian comfort classics.",
                imageUrl: "/src/assets/itineraries/malaysia/kuala-lumpur-food/madam-kwans.jpg",
                lat: 3.1575,
                lng: 101.7116
            },
            {
                name: "Traditional Kopitiam (Coffee Shop)",
                area: "Chinatown",
                reason: "Simple local breakfast + kopi/teh.",
                imageUrl: "/src/assets/itineraries/malaysia/kuala-lumpur-food/traditional-kopitiam.jpg",
                lat: 3.1413,
                lng: 101.6977
            },
        ],
    };

    const d = data ?? fallback;

    return (
        <section className="rounded-xl border border-slate-200 bg-white">
            {/* Header button */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left rounded-xl hover:bg-slate-50 cursor-pointer"
                aria-expanded={open}
                aria-controls={contentId}
            >
                <div>
                    <h3 className="text-sm font-bold tracking-tight text-slate-900">
                        Food Recommendations
                    </h3>
                    <p className="text-xs text-slate-500">Must-try local dishes and where to find them</p>
                </div>

                {/* Toggle icon */}
                <span
                    className={`shrink-0 grid place-items-center h-10 w-10 rounded-full border text-xl font-semibold transition
            ${
                        open
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
                    }`}
                    aria-hidden="true"
                >
          {open ? "−" : "+"}
        </span>
            </button>

            {/* Collapsible content */}
            <div
                id={contentId}
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden border-t border-slate-200">
                    <div className="p-4">
                        {/* Must-try dishes */}
                        {d.mustTry?.length ? (
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <div className="text-xs font-semibold text-slate-800">Must-Try Dishes</div>

                                {/* chips */}
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {d.mustTry.map((item) => (
                                        <span
                                            key={item}
                                            className="inline-flex items-center font-bold rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
                                        >
                      {item}
                    </span>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* Best areas to eat */}
                        {d.areas?.length ? (
                            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <div className="text-xs font-semibold text-slate-800">Best areas to eat</div>

                                <ul className="mt-2 space-y-2 text-xs text-slate-600">
                                    {d.areas.map((a) => (
                                        <li key={a.name}>
                                            <span className="font-semibold text-slate-800">{a.name}:</span>{" "}
                                            {a.note}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        {/* Recommended places (with images, can be empty) */}
                        {d.places?.length ? (
                            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <div className="text-xs font-semibold text-slate-800">
                                    Recommended places
                                </div>

                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    {d.places.map((p) => (
                                        <div
                                            key={p.name}
                                            className="rounded-lg border border-slate-200 bg-white overflow-hidden"
                                        >
                                            {/* image placeholder */}
                                            <div className="h-40 w-full bg-slate-100">
                                                {p.imageUrl ? (
                                                    <img
                                                        src={loadSubFolderImages(p.imageUrl.split("/")[3] + "/"+p.imageUrl.split("/")[4]+"/"+p.imageUrl.split("/")[5],p.imageUrl.split("/")[6].split(".")[0])}
                                                        alt={p.name}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : null}
                                            </div>

                                            <div className="p-3">
                                                <div className="text-xs font-semibold text-slate-900">
                                                    {p.name}
                                                </div>
                                                <div className="mt-0.5 text-[11px] text-slate-500">
                                                    {p.area}
                                                </div>
                                                <div className="mt-2 text-xs text-slate-600">
                                                    {p.reason}
                                                </div>

                                                {/* CTA placeholder for affiliate later */}
                                                <button
                                                    type="button"
                                                    onClick={() => openMapForPlace(p)}
                                                    className="mt-3 inline-flex items-center justify-center rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                                                >
                                                    View On Map
                                                </button>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            <MapModal
                open={mapOpen}
                onClose={() => setMapOpen(false)}
                title={mapPlace ? `${mapPlace.name} • ${mapPlace.area || ""}` : "Map"}
            >
                {mapPlace?.lat && mapPlace?.lng ? (
                    <GoogleMap center={{ lat: mapPlace.lat, lng: mapPlace.lng }} zoom={16} />
                ) : (
                    <div className="h-full w-full grid place-items-center text-sm text-slate-600">
                        This place has no coordinates yet.
                    </div>
                )}
            </MapModal>

        </section>
    );
}
