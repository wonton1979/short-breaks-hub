import { useEffect } from "react";

export default function DayDetailModal({ day, onClose }) {

    if (!day) return null;


    return (
        <div
            className="fixed inset-0 z-[100] bg-black/50 flex items-start md:items-center justify-center p-4"
            onClick={onClose} // click backdrop to close
        >
            <div
                className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden max-h-[85vh]"
                onClick={(e) => e.stopPropagation()} // keep clicks inside from closing
            >
                <header className="flex items-center justify-between px-5 py-4 border-b">
                    <h3 className="text-xl font-bold">
                        Day {day.day} — {day.title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200"
                        aria-label="Close"
                    >
                        Close
                    </button>
                </header>

                <div className="px-5 py-4 space-y-3 overflow-y-auto">
                    <p className="text-gray-700">{day.details}</p>

                    {/* Optional: show the short summary too */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs uppercase tracking-wide text-gray-500">Summary</div>
                        <div className="text-gray-700">{day.summary}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
