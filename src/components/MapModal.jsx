import { useEffect } from "react";

export default function MapModal({ open, onClose, title, children }) {
    // ESC to close
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    // Lock background scroll when modal open
    useEffect(() => {
        if (!open) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close map modal"
                onClick={onClose}
                className="absolute inset-0 bg-black/40"
            />

            {/* Panel */}
            <div className="relative mx-auto mt-10 w-[min(1100px,92vw)]">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200">
                        <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-900 truncate">
                                {title || "Map"}
                            </div>
                            <div className="text-xs text-slate-500">Scroll to zoom • drag to move</div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                        {/* Give the map a stable height */}
                        <div className="h-[70vh] w-full rounded-xl overflow-hidden border border-slate-200">
                            {children}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-slate-200 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
