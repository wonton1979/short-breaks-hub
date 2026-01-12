export default function datePicker({minDate, maxDate,invalidDatePicked,selectedDate,setSelectedDate,handleDateChange}) {
    return (
        <div className="px-4 pb-4">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Pick a date</label>
            <div className="flex gap-2">
                <input type="date" min={minDate} max={maxDate} value={selectedDate} className="w-full rounded-lg border
                        border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                       onChange={e => setSelectedDate(e.target.value)} />
                <button className="rounded-lg bg-slate-900 px-4 py-1 text-sm font-semibold text-white"
                        onClick={handleDateChange} title="Show weather for the selected date">Show</button>
            </div>
            {
                invalidDatePicked && (
                    <p className="text-red-600 text-[12px] mt-2">⚠️ Invalid Date Picked, Forecast Only Available Up To 14 Days From Today.</p>
                )
            }
        </div>
    )
}