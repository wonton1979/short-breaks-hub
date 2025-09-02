import { useParams, Link, useNavigate } from "react-router-dom";
import { itineraries } from "../data/itineraries";
import ItineraryDayAccordion from "../components/ItineraryDayAccordion";
import {useState, useMemo, useEffect} from "react";
import StayOptions from "../components/StayOptions";
import { staysByCity } from "../data/stays";


export default function ItineraryPage() {
    const { slug } = useParams();
    const navigate = useNavigate();


    const data = itineraries.find((i) => i.slug === slug)
        || itineraries.find((i) => i.title && slugify(i.title) === slug);

    function toLocalISO(d) {
        const t = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
        return t.toISOString().slice(0, 10);
    }


    const today = new Date();
    const defaultIn = new Date(today);
    defaultIn.setDate(today.getDate() + 14);

    const defaultOut = new Date(defaultIn);
    defaultOut.setDate(defaultIn.getDate() + 3);

    const [checkIn, setCheckIn]   = useState(toLocalISO(defaultIn));
    const [checkOut, setCheckOut] = useState(toLocalISO(defaultOut));

    const nights = useMemo(() => {
        const a = new Date(checkIn);
        const b = new Date(checkOut);
        const diff = (b - a) / 86400000;
        return diff > 0 ? Math.round(diff) : 0;
    }, [checkIn, checkOut]);

    useEffect(() => {
        if (!data) return;


        document.title = `${data.title} • Short Breaks Hub`;

        const descr =
            document.querySelector('meta[name="description"]') ||
            (() => {
                const m = document.createElement("meta");
                m.setAttribute("name", "description");
                document.head.appendChild(m);
                return m;
            })();

        descr.setAttribute(
            "content",
            data.summary ||
            `${data.country} • ${data.days} days from $${data.priceFrom}`
        );
    }, [data]);


    if (!data) {
        return (
            <div className="max-w-screen-lg mx-auto px-4 py-16">
                <h1 className="text-2xl font-bold mb-4">Itinerary not found</h1>
                <button onClick={() => navigate(-1)} className="text-yellow-700 underline">
                    Go back
                </button>
            </div>
        );
    }

    const city = data.city || (data.country === "Thailand" ? "Bangkok" : undefined);
    const stayOptions = city ? (staysByCity[city] || []) : [];

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section
                className="relative h-[42vh] md:h-[55vh] bg-center bg-cover"
                style={{ backgroundImage: `url(${data.hero})` }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 h-full flex items-end">
                    <div className="max-w-screen-xl mx-auto px-4 md:px-6 pb-8">
                        <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow">
                            {data.title}
                        </h1>
                        <p className="text-white/90 mt-2">
                            {data.country} · {data.days} Days · From ${data.priceFrom}
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-screen-xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-3 gap-8">
                <article className="md:col-span-2">
                    {/* Highlights */}
                    <h2 className="text-xl font-bold mb-3">Trip Highlights</h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        {data.highlights?.map((h) => <li key={h}>{h}</li>)}
                    </ul>

                    {/* Overview */}
                    <h2 className="text-xl font-bold mt-8 mb-3">Overview</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {data.summary}
                    </p>

                    {/* Day-by-Day */}
                    <h3 className="text-lg font-semibold mt-8 mb-3">Day by Day</h3>
                    <ItineraryDayAccordion schedule={data.schedule} />
                </article>


                <aside>
                    <div className="bg-white rounded-xl shadow p-5 sticky top-20">
                        <h3 className="text-lg font-bold mb-3">Choose your dates</h3>

                        <div className="grid grid-cols-2 gap-3">
                            <label className="text-sm text-gray-600">
                                Check‑in
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="mt-1 w-full border rounded px-2 py-1"
                                />
                            </label>

                            <label className="text-sm text-gray-600">
                                Check‑out
                                <input
                                    type="date"
                                    value={checkOut}
                                    min={checkIn}                  // can't pick before check‑in
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="mt-1 w-full border rounded px-2 py-1"
                                />
                            </label>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            {nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "Select valid dates"}
                        </p>

                        <hr className="my-4" />
                    </div>
                    <div className="mt-4">
                        <StayOptions city={city || data.country}
                                     options={stayOptions}
                                     checkIn={checkIn}
                                     checkOut={checkOut}
                                     nights={nights}
                        />
                    </div>
                </aside>

            </section>
        </main>
    );
}


function slugify(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}
