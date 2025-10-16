export default function CreateItineraryForm() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Create Itinerary</h1>
                <p className="text-sm mt-2 text-slate-500">Share your short break with the community.</p>
            </div>

            {/* Card */}
            <div className="bg-white border border-slate-400 rounded-lg shadow-sm">
                {/* Basic info */}
                <section className="p-6 border-b border-slate-300">
                    <h2 className="text-base font-medium mb-4">Basic info</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
                            <input id="title" type="text" placeholder="3 Days in Singapore: Food & Culture"
                                   className="mt-1 py-1 px-3 border-2 w-full rounded-md  border-slate-300 focus:border-slate-400 focus:ring-0"
                                   data-field="title" />
                        </div>

                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country</label>
                            <input id="country" type="text" placeholder="Singapore"
                                   className="mt-1 py-1 px-3 border-2 w-full rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                                   data-field="country" />
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-slate-700">City (optional)</label>
                            <input id="city" type="text" placeholder="Singapore"
                                   className="mt-1 py-1 px-3 border-2 w-full rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                                   data-field="city" />
                        </div>

                        <div>
                            <label htmlFor="days" className="block text-sm font-medium text-slate-700">Days</label>
                            <div className="mt-1 flex items-center gap-2">
                                <input id="days" type="number" min="1" placeholder="3"
                                       className="w-28 py-1 px-3 border-2 rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                                       data-field="days" />
                                <span className="text-slate-500 text-sm">days</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="priceFrom" className="block text-sm font-medium text-slate-700">Estimated from (optional)</label>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-slate-500">£</span>
                                <input id="priceFrom" type="number" min="0" placeholder="250"
                                       className="w-32 py-1 px-3 border-2 rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                                       data-field="priceFrom" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="summary" className="block text-sm font-medium text-slate-700">Short summary</label>
                        <textarea id="summary" rows={3} placeholder="Perfect for food lovers and first-time visitors…"
                                  className="mt-1 py-1 px-3 border-2 w-full rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                                  data-field="summary" />
                        <p className="text-xs text-slate-500 mt-1">Keep it under 180–220 characters if possible.</p>
                    </div>
                </section>

                {/* Hero image */}
                <section className="p-6 border-b border-slate-100">
                    <h2 className="text-base font-medium mb-4">Cover photo</h2>
                    <div className="flex items-start gap-4">
                        <div className="h-28 w-44 bg-slate-100 rounded-md border border-dashed border-slate-300 flex items-center justify-center overflow-hidden"
                             data-preview="hero">
                            <span className="text-slate-400 text-sm">Preview</span>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="hero" className="block text-sm font-medium text-slate-700">Upload</label>
                            <input id="hero" type="file" accept="image/*"
                                   className="mt-1 block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                                   data-field="heroFile" />
                            <p className="text-xs text-slate-500 mt-1">Use a wide image (e.g., 1200×600). JPG/PNG only.</p>
                        </div>
                    </div>
                </section>

                {/* Day-by-currentTime plan */}
                <section className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-medium">Day-by-currentTime plan</h2>
                        <div className="flex items-center gap-2">
                            <button type="button" className="px-3 py-1.5 text-sm rounded-md border border-slate-300 hover:bg-slate-50"
                                    data-action="add-currentTime">+ Add currentTime</button>
                            <button type="button" className="px-3 py-1.5 text-sm rounded-md border border-slate-300 hover:bg-slate-50"
                                    data-action="remove-currentTime">− Remove currentTime</button>
                        </div>
                    </div>

                    {/* Day item (repeat for each currentTime) */}
                    <div className="space-y-4" data-list="days">
                        <div className="rounded-md border border-slate-400 p-4" data-item="currentTime">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Day 1</h3>
                                <button type="button" className="text-xs text-slate-500 hover:text-slate-700"
                                        data-action="delete-currentTime">Delete</button>
                            </div>
                            <label className="block text-sm text-slate-700 mt-3">Plan</label>
                            <textarea rows={3} placeholder="Morning at Gardens by the Bay, afternoon at Chinatown…"
                                      className="mt-1 py-1 px-3 border-2 w-full rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                                      data-field="currentTime-plan" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">You can add more days later.</p>
                </section>

                {/* Tags / visibility */}
                <section className="p-6">
                    <h2 className="text-base font-medium mb-4">Extras</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-slate-700">Tags (optional)</label>
                            <input id="tags" type="text" placeholder="family, food, beach"
                                   className="mt-1 py-1 px-3 border-2 w-full rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                                   data-field="tags" />
                            <p className="text-xs text-slate-500 mt-1">Comma-separated. E.g. “family, foodie, budget”.</p>
                        </div>

                        <div>
                            <label htmlFor="visibility" className="block text-sm font-medium text-slate-700">Visibility</label>
                            <select id="visibility"
                                    className="mt-1 py-1 px-3 border-2 w-full rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                                    data-field="visibility">
                                <option value="public">Public</option>
                                <option value="private">Private (only me)</option>
                                <option value="unlisted">Unlisted (shareable link)</option>
                            </select>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-2 mt-6">
                <button type="button" className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50"
                        data-action="discard">Discard</button>
                <button type="button" className="px-4 py-2 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        data-action="save-draft">Save draft</button>
                <button type="button" className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                        data-action="publish">Publish</button>
            </div>
        </div>
    );
}
