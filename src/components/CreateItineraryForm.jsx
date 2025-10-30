import {useState} from "react";
import DayPlanTextArea from "./DayPlanTextArea.jsx";
import {postUserItineraryPhoto} from "../api.js";

export default function CreateItineraryForm() {

    const [dayPlan , setDayPlan ] = useState([{plan:""}]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [file, setFile] = useState(null);

    function handleAddDay(){
        setDayPlan((days)=>[...days,{plan:""}]);
    }

    function handleRemoveDay(){
        if(dayPlan.length > 1){
            setDayPlan((days)=>days.filter((day,index) => index !== dayPlan.length-1));
        }
    }

    function handleDeleteDay(id){
        if(dayPlan.length > 1){
            setDayPlan((days)=>days.filter((day,index) => index !== id-1));
        }
    }

    function handleUpdateDayPlanContent(id,content){
        setDayPlan(days=> days.map((day,index)=>{
            if(index === id - 1){
                return { plan:content };
            }
            return day
        }));
    }

    function handlePhotoPreview(e){
        const selectedPhoto = e.target.files?.[0];
        if(selectedPhoto){
            setFile(selectedPhoto);
            setPreviewUrl(URL.createObjectURL(selectedPhoto));
        }

    }

    function handleSubmitItinerary(){
        console.log(file);
        postUserItineraryPhoto(file).then(res=>{
            console.log(res);
        })
        if(previewUrl){
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null);
        }
    }

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
                        {
                            previewUrl ? (
                                <div className="h-28 w-44 bg-slate-100 rounded-md border border-dashed border-slate-300 flex items-center justify-center overflow-hidden"
                                     data-preview="hero">
                                    <img src={previewUrl} alt="itinerary photo preview" className="object-cover object-center w-full h-full" />
                                </div>
                            ):(
                                <div className="h-28 w-44 bg-slate-100 rounded-md border border-dashed border-slate-300 flex items-center justify-center overflow-hidden"
                                     data-preview="hero">
                                    <span className="text-slate-400 text-sm">Preview</span>
                                </div>
                            )

                        }
                        <div className="flex-1">
                            <label htmlFor="hero" className="block text-sm font-medium text-slate-700">Upload</label>
                            <input id="hero" type="file" accept="image/*"
                                   className="mt-1 block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                                   data-field="heroFile" onChange={handlePhotoPreview} />
                            <p className="text-xs text-slate-500 mt-1">Use a wide image (e.g., 1200×600). JPG/PNG only.</p>
                        </div>
                    </div>
                </section>

                {/* Day-by-Day plan */}
                <section className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-medium">Day-by-Day plan</h2>
                        <div className="flex items-center gap-2">
                            <button type="button" disabled={dayPlan.length >= 7}
                                    className="px-3 py-1.5 text-sm rounded-md border border-slate-300
                                    hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400"
                                    data-action="add-day" onClick={()=>handleAddDay()}>+ Add Day</button>
                            <button type="button" disabled={dayPlan.length === 1}
                                    className="px-3 py-1.5 text-sm rounded-md border border-slate-300
                                    hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400"
                                    data-action="remove-day" onClick={()=>handleRemoveDay()}>− Remove Day</button>
                        </div>
                    </div>

                    {/* Day item */}
                    <div className="space-y-4" data-list="days">
                        {dayPlan.map((day, index) => (
                            <DayPlanTextArea
                                key={index}
                                day={index+1}
                                plan={day.plan}
                                handleUpdateDayPlanContent={handleUpdateDayPlanContent}
                                handleDeleteDay={handleDeleteDay}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">You can add more days later.</p>
                </section>

                {/* Tags / visibility */}
                <section className="p-6">
                    <h2 className="text-base font-medium mb-4">Extras</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-slate-700">Highlights (optional)</label>
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
                        data-action="publish" onClick={handleSubmitItinerary}>Publish</button>
            </div>
        </div>
    );
}
