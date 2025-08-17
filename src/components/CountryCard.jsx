// src/components/CountryCard.jsx
import React from 'react';

function CountryCard({ name, itineraries, image }) {
    return (
        <div className="bg-white rounded-xl overflow-hidden
        shadow-md hover:shadow-2xl hover:scale-[1.01] transition-transform
         duration-300 w-full">
            <img
                src={image}
                alt={name}
                className="w-full aspect-video object-cover"
            />

            <div className="p-6">
                <h2 className="text-2xl font-bold text-yellow-700 mb-3">{name}</h2>
                <ul className="text-gray-700 space-y-2">
                    {itineraries.map((trip) => (
                        <li
                            key={trip}
                            className="hover:text-yellow-600 transition-colors cursor-pointer text-[1rem]"
                        >
                            • {trip}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
}


export default CountryCard;
