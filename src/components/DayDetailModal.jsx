import {useEffect} from "react";

export default function DayDetailModal({ day, onClose }) {

    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-white rounded-xl shadow-xl h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()} // keep clicks inside from closing
            >
                <header className="flex items-center justify-between px-5 py-4 border-b">
                    <h3 className="text-xl md:text-2xl font-bold">
                        Day {day.currentTime} — {day.title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200"
                        aria-label="Close"
                    >
                        Close
                    </button>
                </header>

                <div className="px-5 py-4 space-y-4 overflow-y-auto">
                    {/* Main details – keep all user line breaks */}
                    <p className="text-[15px] leading-relaxed text-gray-800 whitespace-pre-line">
                        {day.details}
                    </p>

                    {/* Summary box */}
                    {day.summary && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                                Summary
                            </div>
                            <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                                {day.summary}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

