// src/components/ItineraryDayAccordion.jsx
export default function ItineraryDayAccordion({ schedule = [] }) {
    if (!schedule.length) {
        return (
            <div className="rounded-lg border bg-white p-4 text-gray-600">
                Day-by-day schedule coming soon.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {schedule.map((item) => (
                <details
                    key={item.day}
                    className="group rounded-lg border bg-white open:shadow-md transition"
                    open={item.day === 1} // open Day 1 by default
                >
                    <summary className="flex items-center justify-between cursor-pointer select-none px-4 py-3">
            <span className="font-semibold text-gray-900">
              Day {item.day} — {item.title}
            </span>
                        <span className="ml-4 text-gray-400 group-open:hidden">+</span>
                        <span className="ml-4 text-gray-400 hidden group-open:inline">−</span>
                    </summary>
                    <div className="px-4 pb-4 text-gray-700 leading-relaxed">
                        {item.description}
                    </div>
                </details>
            ))}
        </div>
    );
}
