import React, { useMemo, useState } from "react";

function ProgressBar({ done, total }) {
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return (
        <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
        <span>
          {done}/{total} done
        </span>
                <span>{pct}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div
                    className="h-2 rounded-full bg-gray-900 transition-all"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

function StatusPill({ done }) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                done ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
            }`}

        >
      <span
          className={[
              "h-1.5 w-1.5 rounded-full",
              done ? "bg-green-600" : "bg-amber-600",
          ].join(" ")}
      />
            {done ? "Done" : "Pending"}
    </span>
    );
}

function PrimaryButton({ children, onClick, disabled, className = "" }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={[
                "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition",
                disabled
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-black",
                className,
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function SecondaryButton({ children, onClick, disabled, className = "" }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={[
                "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition",
                disabled
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-800 hover:bg-gray-50",
                className,
            ].join(" ")}
        >
            {children}
        </button>
    );
}


const FILTER_SCHEMAS = {
    hotel: {
        title: "Find hotels",
        fields: [
            { key: "checkIn", label: "Check-in", type: "date" },
            { key: "checkOut", label: "Check-out", type: "date" },
            { key: "rooms", label: "Rooms", type: "number", min: 1, max: 5, placeholder: "1" },
            { key: "adults", label: "Adults", type: "number", min: 1, max: 10, placeholder: "2" },
            { key: "children", label: "Children", type: "number", min: 0, max: 6, placeholder: "0" },
            { key: "landmark", label: "Near landmark / area", type: "text", placeholder: "e.g. KLCC, Shinjuku" },
            { key: "breakfast", label: "Breakfast included", type: "toggle" },
            { key: "freeCancel", label: "Free cancellation", type: "toggle" },
        ],
    },
    flights: {
        title: "Find flights",
        fields: [
            { key: "from", label: "From (airport/city)", type: "text", placeholder: "e.g. London (LHR)" },
            { key: "to", label: "To (airport/city)", type: "text", placeholder: "auto: destination city" },
            { key: "depart", label: "Departure date", type: "date" },
            { key: "return", label: "Return date", type: "date" },
            {
                key: "cabin",
                label: "Cabin class",
                type: "select",
                options: [
                    { label: "Economy", value: "economy" },
                    { label: "Premium economy", value: "premium" },
                    { label: "Business", value: "business" },
                    { label: "First", value: "first" },
                ],
            },
            {
                key: "bags",
                label: "Baggage",
                type: "select",
                options: [
                    { label: "Hand luggage only", value: "hand" },
                    { label: "Checked bag included", value: "checked" },
                ],
            },
        ],
    },
    insurance: {
        title: "Compare travel insurance",
        fields: [
            { key: "start", label: "Trip start date", type: "date" },
            { key: "end", label: "Trip end date", type: "date" },
            { key: "travellers", label: "Travellers", type: "number", min: 1, max: 8, placeholder: "2" },
            {
                key: "cover",
                label: "Cover level",
                type: "select",
                options: [
                    { label: "Standard", value: "standard" },
                    { label: "Comprehensive", value: "comprehensive" },
                ],
            },
            { key: "winterSports", label: "Winter sports", type: "toggle" },
            { key: "medical", label: "Pre-existing medical", type: "toggle" },
        ],
    },
    parking: {
        title: "Airport parking / transfer",
        fields: [
            { key: "airport", label: "Airport", type: "text", placeholder: "e.g. Heathrow T5" },
            { key: "departTime", label: "Depart time", type: "text", placeholder: "e.g. 08:30" },
            { key: "returnTime", label: "Return time", type: "text", placeholder: "e.g. 21:10" },
            {
                key: "type",
                label: "Type",
                type: "select",
                options: [
                    { label: "Parking", value: "parking" },
                    { label: "Transfer / taxi", value: "transfer" },
                    { label: "Shuttle", value: "shuttle" },
                ],
            },
        ],
    },
    car: {
        title: "Find car rentals",
        fields: [
            { key: "pickup", label: "Pick-up location", type: "text", placeholder: "e.g. Airport / Downtown" },
            { key: "pickupDate", label: "Pick-up date", type: "date" },
            { key: "dropoffDate", label: "Drop-off date", type: "date" },
            {
                key: "transmission",
                label: "Transmission",
                type: "select",
                options: [
                    { label: "Automatic", value: "auto" },
                    { label: "Manual", value: "manual" },
                ],
            },
            { key: "driverAge", label: "Driver age", type: "number", min: 18, max: 80, placeholder: "30" },
        ],
    },
};

/* -----------------------------
   Drawer + Field components
------------------------------ */

function Field({ field, value, onChange }) {
    if (field.type === "toggle") {
        return (
            <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
                <div>
                    <p className="text-sm font-medium text-gray-900">{field.label}</p>
                </div>
                <input
                    type="checkbox"
                    checked={!!value}
                    onChange={(e) => onChange(field.key, e.target.checked)}
                    className="h-4 w-4"
                />
            </label>
        );
    }

    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">{field.label}</label>

            {field.type === "text" && (
                <input
                    type="text"
                    value={value ?? ""}
                    placeholder={field.placeholder ?? ""}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
            )}

            {field.type === "date" && (
                <input
                    type="date"
                    value={value ?? ""}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
            )}

            {field.type === "number" && (
                <input
                    type="number"
                    value={value ?? ""}
                    min={field.min}
                    max={field.max}
                    placeholder={field.placeholder ?? ""}
                    onChange={(e) =>
                        onChange(field.key, e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
            )}

            {field.type === "select" && (
                <select
                    value={value ?? ""}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                >
                    <option value="">Select…</option>
                    {(field.options ?? []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}

function Drawer({ open, title, onClose, children, footer }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* backdrop */}
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/30"
            />

            {/* panel */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{title}</p>
                        <p className="text-xs text-gray-500">Adjust filters before searching.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>

                <div className="p-4 overflow-auto flex-1">{children}</div>

                {footer ? <div className="p-4 border-t">{footer}</div> : null}
            </div>
        </div>
    );
}

/* -----------------------------
   Main component
------------------------------ */

export default function TripPrepRail({
                                         city,
                                         country,
                                         days,
                                         items,
                                         onMarkDone,
                                         onReset,
                                         onMarkAllDone,
                                     }) {
    const total = items.length;
    const doneCount = useMemo(() => items.filter((i) => i.done).length, [items]);
    const remaining = total - doneCount;
    const nextUp = useMemo(() => items.find((i) => !i.done) || null, [items]);

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeKey, setActiveKey] = useState(null); // "hotel" | "flights" | ...
    const [filtersByKey, setFiltersByKey] = useState({});

    // Defaults for suggestion
    function getDefaultFilters(key) {
        const base = filtersByKey[key] ?? {};

        // Provide sensible defaults
        if (key === "flights") {
            return {
                ...base,
                to: base.to ?? city ?? "",
            };
        }
        if (key === "insurance") {
            return {
                ...base,
                travellers: base.travellers ?? 2,
            };
        }
        if (key === "hotel") {
            return {
                ...base,
                rooms: base.rooms ?? 1,
                adults: base.adults ?? 2,
                children: base.children ?? 0,
            };
        }
        return base;
    }

    function openFilters(key) {
        setActiveKey(key);
        setFiltersByKey((prev) => ({
            ...prev,
            [key]: getDefaultFilters(key),
        }));
        setDrawerOpen(true);
    }

    function closeFilters() {
        setDrawerOpen(false);
    }

    function changeFilter(key, fieldKey, value) {
        setFiltersByKey((prev) => ({
            ...prev,
            [key]: { ...(prev[key] ?? {}), [fieldKey]: value },
        }));
    }

    function resetFilters(key) {
        setFiltersByKey((prev) => ({ ...prev, [key]: {} }));
    }


    const idToSchemaKey = {
        hotel: "hotel",
        flights: "flights",
        insurance: "insurance",
        airport: "parking",
        car: "car",
    };

    const activeSchema = activeKey ? FILTER_SCHEMAS[activeKey] : null;
    const activeFilters = activeKey ? (filtersByKey[activeKey] ?? {}) : {};

    function handleSearch() {
        if (!activeKey) return;

        const matchingItemId = Object.keys(idToSchemaKey).find(
            (id) => idToSchemaKey[id] === activeKey
        );

        const item = items.find((i) => i.id === matchingItemId);

        const context = { city, country, days };

        if (item?.onSearch) {
            item.onSearch(activeFilters, context);
        } else if (item?.onFind) {
            item.onFind(activeFilters, context);
        } else {
            console.log("Search:", activeKey, activeFilters, context);
        }

        closeFilters();
    }

    return (
        <>
            <aside className="space-y-4">
                {/* Header card */}
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold">Trip prep</h3>
                            <p className="text-sm text-gray-600">
                                {city ? `${city}${country ? `, ${country}` : ""}` : "Progress and next actions"}
                                {days ? ` · ${days} days` : ""}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <SecondaryButton onClick={onMarkAllDone} disabled={total === 0 || remaining === 0}>
                                Mark all done
                            </SecondaryButton>
                            <SecondaryButton onClick={onReset} disabled={total === 0 || doneCount === 0}>
                                Reset
                            </SecondaryButton>
                        </div>
                    </div>

                    <ProgressBar done={doneCount} total={total} />
                </div>

                {/* Next up card */}
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">Next up</h4>
                        <span className="text-xs text-gray-600">{remaining} remaining</span>
                    </div>

                    <div className="mt-3 rounded-lg border border-gray-200 p-3">
                        {nextUp ? (
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-900">{nextUp.title}</p>
                                    <StatusPill done={false} />
                                </div>
                                <p className="mt-1 text-sm text-gray-600">{nextUp.hint}</p>

                                <div className="mt-3 flex gap-2">
                                    <PrimaryButton
                                        className="flex-1"
                                        onClick={() => {
                                            const schemaKey = idToSchemaKey[nextUp.id];
                                            if (schemaKey) openFilters(schemaKey);
                                            else nextUp.onFind?.();
                                        }}
                                    >
                                        {nextUp.ctaLabel ?? "Find"}
                                    </PrimaryButton>

                                    <SecondaryButton className="flex-1" onClick={() => onMarkDone(nextUp.id)}>
                                        Mark done
                                    </SecondaryButton>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm font-medium text-gray-900">🎉 You’re good to go</p>
                                <p className="text-sm text-gray-600">Enjoy your holiday — everything is prepared.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Full list */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h4 className="text-sm font-semibold text-gray-900">Before you go</h4>
                    <p className="text-sm text-gray-600">Filters open when you press Find.</p>

                    <div className="mt-3 space-y-3">
                        {items.map((item) => {
                            const cardStyle = item.done
                                ? "border-green-200 bg-green-50"
                                : "border-amber-200 bg-amber-50";

                            return (
                                <div key={item.id} className={`rounded-lg border p-3 ${cardStyle}`}>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-gray-900">{item.title}</p>
                                        <StatusPill done={item.done} />
                                    </div>

                                    <p className="mt-1 text-sm text-gray-700">{item.hint}</p>

                                    <div className="mt-3 flex gap-2">
                                        <PrimaryButton
                                            className="flex-1"
                                            onClick={() => {
                                                const schemaKey = idToSchemaKey[item.id];
                                                if (schemaKey) openFilters(schemaKey);
                                                else item.onFind?.();
                                            }}
                                        >
                                            {item.ctaLabel ?? "Find"}
                                        </PrimaryButton>

                                        <SecondaryButton
                                            className="flex-1"
                                            onClick={() => onMarkDone(item.id)}
                                            disabled={item.done}
                                        >
                                            Mark done
                                        </SecondaryButton>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {remaining === 0 && (
                        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                            <p className="text-sm font-medium text-gray-900">🎉 You’re good to go</p>
                            <p className="text-sm text-gray-700">Enjoy your holiday — everything is prepared.</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Drawer */}
            <Drawer
                open={drawerOpen}
                title={activeSchema?.title ?? "Filters"}
                onClose={closeFilters}
                footer={
                    activeKey ? (
                        <div className="flex gap-2">
                            <SecondaryButton className="flex-1" onClick={() => resetFilters(activeKey)}>
                                Reset filters
                            </SecondaryButton>
                            <PrimaryButton className="flex-1" onClick={handleSearch}>
                                Search
                            </PrimaryButton>
                        </div>
                    ) : null
                }
            >
                {activeSchema ? (
                    <div className="space-y-3">
                        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                            <p className="text-xs text-gray-600">
                                Destination: <span className="font-medium text-gray-900">{city || "—"}</span>
                                {country ? <span className="text-gray-400"> · </span> : null}
                                {country ? <span className="font-medium text-gray-900">{country}</span> : null}
                                {days ? <span className="text-gray-400"> · </span> : null}
                                {days ? <span className="font-medium text-gray-900">{days} days</span> : null}
                            </p>
                        </div>

                        {activeSchema.fields.map((field) => (
                            <Field
                                key={field.key}
                                field={field}
                                value={activeFilters[field.key]}
                                onChange={(k, v) => changeFilter(activeKey, k, v)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-600">No filters available.</p>
                )}
            </Drawer>
        </>
    );
}


