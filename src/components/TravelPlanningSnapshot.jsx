import React, { useId, useState } from "react";

export default function TravelPlanningSnapshot({ data, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    const contentId = useId();

    return (
        <section className="rounded-xl border border-slate-200 bg-white">

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left rounded-xl hover:bg-slate-50 cursor-pointer"
                aria-expanded={open}
                aria-controls={contentId}
            >
                <div>
                    <h3 className="text-sm font-bold tracking-tight text-slate-900">
                        Travel Planning Snapshot
                    </h3>
                    <p className="text-xs text-slate-500">{data.city}</p>
                </div>

                {/* Big + / - */}
                <span
                    className={`shrink-0 grid place-items-center h-10 w-10 rounded-full border text-xl font-semibold transition
            ${open ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"}`}
                    aria-hidden="true"
                >
          {open ? "−" : "+"}
        </span>
            </button>

            {/* Collapsible content */}
            <div
                id={contentId}
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden border-t border-slate-200">
                    <div className="p-4">
                        {/* Best / Worst */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <div className="text-[11px] font-medium text-slate-500">
                                    Best time to visit
                                </div>
                                <div className="mt-1 text-sm font-semibold text-slate-900">
                                    {data.bestTime.months}
                                </div>
                                <div className="mt-1 text-xs leading-relaxed text-slate-600">
                                    {data.bestTime.note}
                                </div>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <div className="text-[11px] font-medium text-slate-500">
                                    Worst time to visit
                                </div>
                                <div className="mt-1 text-sm font-semibold text-slate-900">
                                    {data.worstTime.months}
                                </div>
                                <div className="mt-1 text-xs leading-relaxed text-slate-600">
                                    {data.worstTime.note}
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        {data.tips?.length ? (
                            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <div className="text-xs font-semibold text-slate-800">Trip tips</div>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
                                    {data.tips.map((t) => (
                                        <li key={t}>{t}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        {/* With kids */}
                        {data.withKids?.length ? (
                            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <div className="text-xs font-semibold text-slate-800">With kids</div>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
                                    {data.withKids.map((t) => (
                                        <li key={t}>{t}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}
