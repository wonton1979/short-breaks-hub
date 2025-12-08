import React from 'react';
import {useNavigate} from "react-router-dom";


export default function CountryCard({ name, itineraries, image }) {
    const navigate = useNavigate();
    const formatSlug = (slug) =>
        slug
            .replace(/-/g, " ")
            .replace(/\b\w/g, (ch) => ch.toUpperCase());

    const previewList = itineraries.slice(0, 6);


    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            {/* image */}
            <div className="h-40 md:h-48 w-full overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* content */}
            <div className="p-5 flex-1 flex flex-col">
                {/* country name + count */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">
            {itineraries.length} itineraries
          </span>
                </div>

                {/* mini itinerary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {previewList.map((slug) => (
                        <button
                            key={slug}
                            onClick={() => navigate(`/user-itinerary/${slug}`)}
                            className="text-left text-sm border border-gray-200 rounded-lg px-3 py-2
                         bg-gray-50 hover:bg-white hover:border-blue-400
                         shadow-sm hover:shadow-md transition
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {formatSlug(slug)}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => navigate(`/country/${countrySlug}`)}
                    className="text-sm text-blue-600 underline mt-5"
                >
                    View all itineraries →
                </button>

            </div>
        </div>
    );
}


