import React from 'react';

function RegionCard({ image, title, description, onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer
                 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        >
            <img
                src={image}
                alt={title}
                className="h-48 w-full object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{title}</h3>
                <p className="text-gray-600 text-sm mb-2">{description}</p>
                <span className="text-yellow-600 font-semibold hover:underline">Explore →</span>
            </div>
        </div>
    );
}

export default RegionCard;
