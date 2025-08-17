import React from 'react';
import CountryCard from '../components/CountryCard';
import thailand from '../assets/thailand.jpg';
import vietnam from '../assets/vietnam.jpg';
import indonesia from '../assets/indonesia.jpg';
import singapore from '../assets/singapore.jpg';
import malaysia from '../assets/malaysia.jpg';
import southeastAsiaBanner from '../assets/southeast-asia-banner.jpg';

const countries = [
    {
        name: 'Thailand',
        image: thailand,
        itineraries: ['3-Day Bangkok City Tour', 'Chiang Mai Temples & Elephants'],
    },
    {
        name: 'Vietnam',
        image: vietnam,
        itineraries: ['Hanoi & Halong Bay 5 Days', 'Saigon Street Food Walk'],
    },
    {
        name: 'Indonesia',
        image: indonesia,
        itineraries: ['Bali Relaxation Retreat', 'Java Volcano Adventure'],
    },
    {
        name: 'Singapore',
        image: singapore,
        itineraries: ['2-Day Singapore City Explorer', 'Gardens by the Bay & Sentosa Combo'],
    },
    {
        name: 'Malaysia',
        image: malaysia,
        itineraries: ['Kuala Lumpur & Batu Caves 3 Days', 'Penang Heritage & Food Trail'],
    },
];



function SoutheastAsia() {
    return (
        <div className="bg-gray-50 min-h-screen w-full overflow-x-hidden">
            <div className="relative h-[300px] md:h-[400px] bg-cover bg-center shadow-lg"
                 style={{ backgroundImage: `url('${southeastAsiaBanner}')` }}>
                <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                        Discover Southeast Asia
                    </h1>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto my-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-cols-fr">
                    {countries.map((country) => (
                        <CountryCard
                            key={country.name}
                            name={country.name}
                            itineraries={country.itineraries}
                            image={country.image}
                        />
                    ))}
                </div>

            </div>
        </div>

    );
}

export default SoutheastAsia;
