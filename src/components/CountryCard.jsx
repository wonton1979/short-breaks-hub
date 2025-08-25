// src/components/CountryCard.jsx
import React from 'react';

// src/components/CountryCard.jsx
import { Link } from "react-router-dom";

function toSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumerics
        .trim()
        .replace(/\s+/g, "-");        // spaces -> hyphens
}

export default function CountryCard({ name, image, itineraries }) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
            <img src={image} alt={name} className="w-full h-48 object-cover" />
            <div className="p-5 flex-1">
                <h3 className="text-xl font-bold text-yellow-700 mb-2">{name}</h3>
                <ul className="text-gray-700 space-y-1">
                    {itineraries.map((title) => {
                        const slug = toSlug(title);
                        return (
                            <li key={title}>
                                <Link
                                    to={`/itinerary/${slug}`}
                                    className="hover:text-yellow-600 transition-colors"
                                >
                                    • {title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

