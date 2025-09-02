export const itineraries = [
    {
        slug: "3-day-bangkok-city-tour",
        region: "southeast-asia",
        country: "Thailand",
        title: "Bangkok 3-Day City Tour",
        days: 3,
        priceFrom: 299,
        hero: "../src/assets/sea-bangkok.jpg",
        highlights: ["Grand Palace & Wat Phra Kaew", "Chao Phraya Night Cruise", "Chinatown Street Eats"],
        summary: "A first-timer friendly 3-day loop through Bangkok’s must-see sights with time for markets and river views.",
        // keep the rest the same (slug, region, etc.)
        schedule: [
            {
                day: 1,
                title: "Arrival & Old Town",
                summary:
                    "Airport pickup, check-in, and a relaxed afternoon in Rattanakosin: Grand Palace, Wat Pho, and a sunset view by the river.",
                details:
                    "Morning/midday arrival and hotel check-in. Visit the Grand Palace & Wat Phra Kaew, then Wat Pho (Reclining Buddha). Stroll riverside at sunset; optional short long-tail boat ride. Dinner near Tha Maharaj or Sanam Luang. Early night."
            },
            {
                day: 2,
                title: "Canals, Temples & Night Cruise",
                summary:
                    "Morning long-tail boat through canals, visit Wat Arun. Evening Chao Phraya dinner cruise with skyline views.",
                details:
                    "Start with a Klong (canal) tour from Phra Arthit/Saphan Taksin. Visit Wat Arun. Lunch nearby or ICONSIAM. Afternoon rest/massage. Evening Chao Phraya dinner cruise (book ahead) for lit-up temples and skyline."
            },
            {
                day: 3,
                title: "Markets & Departure",
                summary:
                    "Explore local markets (Or Tor Kor / Chatuchak if weekend). Optional massage, transfer to airport.",
                details:
                    "If weekend: Chatuchak. Otherwise: Or Tor Kor for fruit/snacks. Optional shopping in Siam area. Consider a final Thai massage. Airport with 3h buffer for intl flights."
            }
        ]

    },

    // leave the rest unchanged for now…
];
