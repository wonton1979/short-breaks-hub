import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getItinerariesByCountry } from "../api";
import {Helmet} from "react-helmet-async";
import Lottie from "lottie-react";
import LoadingAnimation from "../assets/Loading-Animation.json";
import ItineraryCard from "../components/ItineraryCard.jsx";
import {formatSlug} from "../utils/formatSlug.js"

export default function BrowsePage() {
    const {country} = useParams();


    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");


    useEffect(() => {
        let ignore = false;
        setLoading(true);
        setErr("");

        getItinerariesByCountry(country)
            .then((data) => { if (!ignore) setItems(data); })
            .catch((e) => { if (!ignore) setErr(e?.message || "Failed to load"); })
            .finally(() => { if (!ignore) setLoading(false); });

        return () => { ignore = true; };
    }, [country]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-white">
                <div className="w-[1000px] h-[1000px] mt-[250px] ml-[20px] xl:ml-[650px] md:ml-[250px] lg:ml-[400px]">
                    <Lottie animationData={LoadingAnimation} loop={true} />
                </div>
            </div>
        )
    }

    return (
        <>
            <Helmet>
                <title>{country ? `Short Breaks in ${formatSlug(country)} | Short Breaks Hub`
                    : `Browse Short Breaks | Short Breaks Hub`}</title>
                <meta
                    name="description"
                    content={country
                        ? `Discover curated short-break itineraries in ${formatSlug(country)} — days, highlights, and prices in one place.`
                        : `Browse curated short-break itineraries across regions and countries. Find your next 2–5 day escape.`}
                />
            </Helmet>

            <main className="min-h-screen bg-gray-50">
                <section className="max-w-screen-xl mx-auto px-4 py-8">
                    <header className="mb-6">
                        <h1 className="text-2xl font-bold">
                            Browse {country ? `— ${formatSlug(country)}` : ""}
                        </h1>
                    </header>

                    {err && <p className="text-red-600">{err}</p>}

                    {!loading && !err && items.length === 0 && (
                        <div className="rounded-lg border border-dashed p-6 text-gray-600 bg-white">
                            <p className="font-semibold mb-1">No itineraries found.</p>
                            <p className="text-sm">Try a different region or country.</p>
                        </div>
                    )}

                    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((it) => (
                            <ItineraryCard key={it.slug} it={it} />
                        ))}
                    </ul>
                </section>
            </main>
        </>
    );
}

