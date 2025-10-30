import { useEffect, useRef } from "react";

export default function BlockingSessionModal({
                                                 secondsLeft,
                                                 onStay,
                                                 onLogout,
                                             }) {
    const stayBtnRef = useRef(null);

    // Freeze background scroll while open
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        // focus first actionable element
        stayBtnRef.current?.focus();
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    // Prevent ESC from silently closing (banks do this)
    useEffect(() => {
        const stopEsc = (e) => {
            if (e.key === "Escape") e.preventDefault();
        };
        window.addEventListener("keydown", stopEsc);
        return () => window.removeEventListener("keydown", stopEsc);
    }, []);

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            aria-modal="true"
            role="dialog"
            aria-labelledby="session-title"
            aria-describedby="session-desc"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Dialog */}
            <div className="relative w-[92vw] max-w-md rounded-lg bg-white shadow-xl ring-1 ring-black/10">
                <div className="px-6 pt-6 pb-4">
                    <h2 id="session-title" className="text-lg font-semibold">
                        Session about to expire
                    </h2>
                    <p id="session-desc" className="mt-2 text-sm text-gray-600">
                        For your security, you’ll be logged out soon.
                        Time remaining:{" "}
                        <span className="font-mono font-semibold text-red-600">
              {Math.max(0, secondsLeft)}s
            </span>
                    </p>

                    {/* Progress bar (optional visual) */}
                    <div className="mt-4 h-2 w-full rounded bg-gray-200">
                        <div
                            className="h-2 rounded bg-red-500 transition-all"
                            style={{
                                width: `${Math.min(100, (secondsLeft / 120) * 100)}%`,
                            }}
                        />
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onLogout}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        >
                            Log out
                        </button>
                        <button
                            type="button"
                            ref={stayBtnRef}
                            onClick={onStay}
                            className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Stay signed in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
