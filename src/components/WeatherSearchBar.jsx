export default function WeatherSearchBar ({locationQuery, setLocationQuery,noLocationQueryResults,handleLocationSearch}) {
    return (
        <div className="px-4 pb-4 mt-5">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Enter a Place Name</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="eg. London"
                    className="w-full rounded-lg border
                            border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
                <button className="rounded-lg bg-slate-900 px-3 py-1 text-sm font-semibold text-white" onClick={handleLocationSearch}>Search</button>
            </div>
            {
                noLocationQueryResults && (
                    <p className="text-red-600 text-[12px] mt-2">⚠️ Sorry, No Weather Data Was Found For Your Input.</p>
                )
            }
        </div>
    )
}