export default function StayOptions({ city, options = [] }) {
    if (!options.length) {
        return (
            <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-lg font-bold mb-2">Stay Options</h3>
                <p className="text-gray-600 text-sm">Coming soon.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-bold mb-4">Stay Options in {city}</h3>

            <ul className="space-y-4">
                {options.map((o) => (
                    <li key={o.tier} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-xs uppercase tracking-wider text-gray-500">{o.tier}</div>
                                <div className="text-base font-semibold text-gray-900">{o.hotel}</div>
                                <div className="text-sm text-gray-600">
                                    {"★".repeat(o.stars)} <span className="text-gray-400">({o.stars}-star)</span>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <div className="text-sm text-gray-500">from</div>
                                <div className="text-xl font-extrabold text-gray-900">${o.nightlyFrom}</div>
                                <a
                                    href={o.link}
                                    target="_blank"
                                    rel="noopener"
                                    className="inline-block mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-3 py-2 rounded-lg shadow"
                                >
                                    View deal
                                </a>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <p className="text-[11px] text-gray-500 mt-4">
                We may earn a commission from partner links.
            </p>
        </div>
    );
}
