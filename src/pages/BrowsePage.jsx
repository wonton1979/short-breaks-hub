import React, { useEffect, useMemo, useState } from "react";
import {useParams,useLocation} from "react-router-dom";
import { getItinerariesByCountry,getAllItinerariesByCustomSearch } from "../api";
import {Helmet} from "react-helmet-async";
import Lottie from "lottie-react";
import LoadingAnimation from "../assets/Loading-Animation.json";
import ItineraryCard from "../components/ItineraryCard.jsx";
import {formatSlug} from "../utils/formatSlug.js"

function useQuery() {
    const { search } = useLocation();
    return new URLSearchParams(search);
}

export default function BrowsePage() {
    let {country} = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const qs = useQuery();
    const initialQ = qs.get("q") || "";
    const [sort, setSort] = useState("days,asc");
    const [daysMin, setDaysMin] = useState(1);
    const [daysMax, setDaysMax] = useState(6);
    const [q, setQ] = React.useState(initialQ);

    function applyFilters(page = 0) {
        const params = new URLSearchParams();
        if (q?.trim()) params.set("q", q.trim());
        if (daysMin != null) params.set("daysMin", String(daysMin));
        if (daysMax != null) params.set("daysMax", String(daysMax));
        params.set("page", String(page));
        params.set("size", "12");
        params.set("country", country.replace("-"," "));
        if (sort) params.set("sort", sort);
        getAllItinerariesByCustomSearch(params.toString()).then((res) => {
            setItems(res.content);
        }).catch((err) => console.log(err));
    }

    function clearFilters() {
        window.location.reload();
    }

    function onSubmit(e){
        e.preventDefault();
        applyFilters();
    }


    useEffect(() => {
        let ignore = false;
        setLoading(true);
        setErr("");
        if(country.includes("-")){
            country = country.replace("-"," ");
        }

        getItinerariesByCountry(country)
            .then((data) => { if (!ignore) {
                console.log(data)
                setItems(data);
            } })
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
                            Short Breaks In {country ? `— ${formatSlug(country)}` : ""}
                        </h1>
                    </header>

                    <section className="mb-4 rounded-lg border bg-white p-4">
                        <form className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end" onSubmit={onSubmit}>
                            {/* q */}
                            <label className="md:col-span-4 block">
                                <span className="block text-sm text-slate-600 mb-1">Keyword</span>
                                <input
                                    type="search"
                                    className="w-full h-10 rounded border px-3"
                                    placeholder="Bangkok, beach, street food…"
                                    value={q}
                                    onChange={e => setQ(e.target.value)}
                                />
                            </label>

                            {/* Min days */}
                            <label className="md:col-span-2 block">
                                <span className="block text-sm text-slate-600 mb-1">Min days</span>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min={1}
                                        className="w-full h-10 rounded border pr-12 px-3"
                                        value={daysMin ?? ""}
                                        onChange={e => setDaysMin(e.target.value ? +e.target.value : null)}
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm whitespace-nowrap">days</span>
                                </div>
                            </label>

                            {/* Max days */}
                            <label className="md:col-span-2 block">
                                <span className="block text-sm text-slate-600 mb-1">Max days</span>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min={1}
                                        className="w-full h-10 rounded border pr-12 px-3"
                                        value={daysMax ?? ""}
                                        onChange={e => setDaysMax(e.target.value ? +e.target.value : null)}
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm whitespace-nowrap">days</span>
                                </div>
                            </label>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="h-10 px-4 rounded border text-slate-700 hover:bg-slate-50 md:col-span-2 cursor-pointer"
                            >
                                Clear
                            </button>
                            <button
                                type="submit"
                                className="h-10 px-4 rounded bg-amber-500 text-white hover:bg-amber-600 md:col-span-2 cursor-pointer"
                            >
                                Apply
                            </button>
                        </form>

                    </section>



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

