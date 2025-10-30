export default function DayPlanTextArea({day, plan,handleUpdateDayPlanContent,handleDeleteDay}) {
    return(
        <div className="rounded-md border border-slate-400 p-4" data-item="day">
            <div className="flex items-center justify-between">
                <h3 className="font-medium">Day {day}</h3>
                { day === 1 ?
                    null:(<button type="button" className="text-xs text-slate-500 hover:text-slate-700"
                                  data-action="delete-currentTime" onClick={()=>handleDeleteDay(day)}>Delete</button>
                    )}
            </div>
            <label className="block text-sm text-slate-700 mt-3">Plan</label>
            <textarea rows={3} placeholder="Morning at Gardens by the Bay, afternoon at Chinatown…"
                      value={plan}
                      className="mt-1 py-1 px-3 border-2 w-full rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                      data-field="currentTime-plan"
                      onChange={(e) => handleUpdateDayPlanContent(day,e.target.value)}
            />
        </div>
    )
}