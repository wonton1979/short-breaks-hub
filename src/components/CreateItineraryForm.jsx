import {useEffect, useState} from "react";
import DayPlanTextArea from "./DayPlanTextArea.jsx";
import {
    postUserItineraryPhoto, postUserItinerary, getUserDraftCount, postUserDraftItinerary, postDraftPhoto,
    postUpdateDraftCoverPhoto, getDraftByDraftId, updateDraft, deleteDraft,getResendVerificationEmail
} from "../api.js";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Auth} from "../auth.js";

export default function CreateItineraryForm() {

    const [dayPlan , setDayPlan ] = useState([{title:"",details:""}]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [countries, setCountries] = useState([]);
    const [countriesSuggestionsOpen, setCountriesSuggestionsOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showModal, setShowModal] = useState(null);
    const [showSuccessDraftSaveModal, setShowSuccessDraftSaveModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [draftId, setDraftId] = useState(null);
    const navigate = useNavigate();
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [searchParams] = useSearchParams()
    const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
    const [itineraryContent, setItineraryContent] = useState({
        title: "",
        country: "",
        region: "",
        days: 3,
        estimatedCost: 0,
        summary: "",
        coverPhoto: "",
        highlights: "",
        visibility: "PUBLIC",
    });


    function handleAddDay(){
        setDayPlan((days)=>[...days,{title:"",details:""}]);
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

    function handleUpdateDayPlanTitle(id,title){
        setDayPlan(days=> days.map((day,index)=>{
            if(index === id - 1){
                return {...day, title:title };
            }
            return day
        }));
    }

    function handleUpdateDayPlanContent(id,content){
        setDayPlan(days=> days.map((day,index)=>{
            if(index === id - 1){
                return {...day, details:content };
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

    function handleEmailVerificationRequest(){
        getResendVerificationEmail().then(() => {
            setShowEmailVerificationModal(false);
            setShowModal({
                "msgTitle": "Email Verification Request",
                "msg":"Verification email has been sent.please check your mail\n It may take couple of minutes.",
                "icon": "success",
            });
        }).catch((err) => {
            setShowEmailVerificationModal(false);

            const status = err?.response?.status;

            if (status === 429) {
                setShowModal({
                    msgTitle: "Please wait",
                    msg: "You’ve recently requested a verification email. Try again in 1 minute.",
                    icon: "warning",
                });
                return;
            }

            setShowModal({
                msgTitle: "Email Verification Failed",
                msg: err?.response?.data?.message || "Something went wrong. Please try again later.",
                icon: "error",
            });
        });

    }

    function handleSaveDraft(){

        getUserDraftCount().then((res) => {
            if( res.count === 3 && !draftId){
                setShowModal({"msgTitle": "Draft Limit Reached","msg":"You can only have <span class=\"font-bold\">up to 3 itinerary drafts</span>.\n" +
                        "                                <br />\n" +
                        "                                Please delete an existing draft before creating a new one."});
            }
            else {
                const plan = dayPlan.map((eachDayPlan,index) =>({...eachDayPlan, day: index + 1}));
                const payload = {...itineraryContent,region: itineraryContent.region.toUpperCase(),userDayPlan:plan,draftId:draftId};
                if(payload.title.trim().length === 0){
                    setShowModal({"msgTitle": "Itinerary Title Missing",
                        "msg":"Please enter a <span class=\"font-bold\">Title</span> before saving your draft."});
                    return;
                }
                if (payload.draftId === null){
                    setIsSavingDraft(true);
                    if(file){
                        postDraftPhoto(file).then((res) => {
                            payload.coverPhoto = res;
                            postUserDraftItinerary(payload).then((res) => {
                                setShowSuccessDraftSaveModal(true);
                                setDraftId(res.draftId);
                            })
                        }).catch(() => {
                            setShowModal({"msgTitle": "Save Failed", "msg":"Something went wrong. Please try again."});
                        }).finally(() => {
                            setIsSavingDraft(false);
                        })
                    }
                    else {
                        postUserDraftItinerary(payload).then((res) => {
                            setShowSuccessDraftSaveModal(true);
                            setDraftId(res.draftId);
                        }).catch(() => {
                            setShowModal({"msgTitle": "Save Failed", "msg":"Something went wrong. Please try again."});
                        }).finally(() => {
                            setIsSavingDraft(false);
                        })
                    }
                }
                else{
                    setIsSavingDraft(true);
                    if(previewUrl !== itineraryContent.coverPhoto && file){
                        postUpdateDraftCoverPhoto(file,itineraryContent.coverPhoto).then(() => {
                            updateDraft(draftId,payload).then(() => {
                                setShowModal({"msgTitle": "Draft Update", "msg":"Draft Updated Successfully."});
                            });
                        }).finally(() => {setIsSavingDraft(false);})
                    }
                    else {
                        updateDraft(draftId,payload).then(() => {
                            setShowModal({"msgTitle": "Draft Update", "msg":"Draft Updated Successfully."});
                        }).finally(() => {setIsSavingDraft(false);});
                    }
                }
            }
        })
    }

    function handleSubmitItinerary() {
        if(!Auth.isEmailVerified()){
            setShowEmailVerificationModal(true);
            return;
        }


        setSubmitted(true);

        const { title, country, days, summary } = itineraryContent;

        const normalizedCountry = country.trim();
        const isCountryValid = country.trim().length > 0 &&
            countries.includes(
                normalizedCountry[0].toUpperCase() + normalizedCountry.substring(1)
            );

        const isValid =
            title.trim().length >= 10 && title.trim().length <= 100 &&
            isCountryValid &&
            days >= 1 && days <= 7 &&
            summary.trim().length >= 50 &&
            days === dayPlan.length &&
            dayPlan.filter(
                (eachDayPlan) =>
                    eachDayPlan.details.trim().length > 30 && eachDayPlan.details.trim().length <= 1990).length === days;

        if (!isValid)  return;


        postUserItineraryPhoto(file)
            .then((res) => {
               itineraryContent.coverPhoto = res;
               const plan = dayPlan.map((eachDayPlan,index) =>({...eachDayPlan, day: index + 1}));
               const payload = {...itineraryContent,region: itineraryContent.region.toUpperCase(),userDayPlan:plan};
               postUserItinerary(payload).then(() => {
                   setCountdown(5);
                   setShowSuccessModal(true);
                   }
               )
            })
            .catch((err) => console.error("Upload failed:", err));

        if (previewUrl) {
            if(typeof previewUrl === "string"){
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
        }
    }

    function handleDeleteDraft() {
        setShowConfirmationModal(false);
        deleteDraft(draftId).then(() => {
            setShowModal({"msgTitle": "Draft Delete", "msg":"Draft Delete Successfully."});

        }).finally(() => {
            navigate("/create-itinerary");
            window.location.reload();
        });
    }



    useEffect(() => {
        if (!showSuccessModal) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [showSuccessModal]);

    useEffect(() => {
        if (!showSuccessModal) return;

        const id = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(id);
                    navigate("/profile?tab=published-itineraries");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [showSuccessModal, navigate]);


    useEffect(() => {
        axios.get("https://countriesnow.space/api/v0.1/countries")
            .then((res) => {
                setCountries(res.data.data.map( country => country.country));
            })
            .catch((err) => {console.log(err)});
        if(searchParams){
            const parameterDraftId = searchParams.get("draftId");
            if(parameterDraftId){
                getDraftByDraftId(parameterDraftId).then(data => {
                    setItineraryContent(current => ({...current,...data}))
                    setDraftId(parameterDraftId)
                    setPreviewUrl(data.coverPhoto);
                })
            }
        }
    },[])

    useEffect(() => {
        const normalizedCountry = itineraryContent.country.trim();
        if(itineraryContent.country.trim().length > 0 &&
            countries.includes(
                normalizedCountry[0].toUpperCase() + normalizedCountry.substring(1)
            )){
            axios.get(`https://restcountries.com/v3.1/name/${itineraryContent.country}`)
                .then((res) => {
                    setItineraryContent(current => ({...current, region: res.data[0].region}))
                })
                .catch((err) => {console.log(err)});
        }
        }, [itineraryContent.country])



    const suggestions = itineraryContent.country ?
        itineraryContent.country.length >= 2 ? countries
            .filter( country =>  country.toLowerCase().startsWith(itineraryContent.country.toLowerCase()))
            .slice(0, 10): null : null;

    return (
        <>
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
                                       onChange={(e)=> {
                                           setItineraryContent(current => ({...current, title: e.target.value}));
                                       }}
                                       value={itineraryContent.title}
                                       className={`mt-1 py-1 px-3 border-2 w-full rounded-md 
                                       ${submitted ? (itineraryContent.title && itineraryContent.title.length >=10) ? 
                                           "border-slate-300" : "border-red-700":"border-slate-300" }  
                                           focus:border-slate-400 focus:ring-0`}
                                       data-field="title" minLength={5}/>
                                {
                                    submitted ? (itineraryContent.title && itineraryContent.title.length >=10) ? null :
                                        (<p className="text-red-700 mt-2">Please give your itinerary a title (Minimum 10 characters)</p>) : null
                                }

                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country</label>
                                <input id="country" type="text" placeholder="Singapore" value={itineraryContent.country}
                                       onChange={(e)=> {
                                           setItineraryContent(current => ({...current, country: e.target.value}))
                                           setCountriesSuggestionsOpen(true)
                                       }
                                }
                                       className={`mt-1 py-1 px-3 border-2 w-full rounded-md 
                                       ${submitted ? (itineraryContent.country && 
                                           countries.includes(itineraryContent.country[0].toUpperCase()+itineraryContent.country.substring(1))) ? 
                                           "border-slate-300" : "border-red-700":"border-slate-300"} focus:border-slate-400 focus:ring-0`}
                                       data-field="country" />
                            </div>
                            { (countriesSuggestionsOpen && suggestions?.length > 0) && (
                                <ul className="absolute z-10 w-50 bg-white border border-slate-300 rounded-md mt-1 shadow max-h-60 overflow-auto">
                                    {suggestions.map((country) => (
                                        <li
                                            key={country}
                                            onClick={() => {
                                                setItineraryContent(current => ({...current, country: country}))
                                                setCountriesSuggestionsOpen(false)
                                                }
                                            }
                                            className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                                        >
                                            {country}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div>
                                <label htmlFor="region" className="block text-sm font-medium text-slate-700">Region</label>
                                <input id="region" type="text" value={itineraryContent.region} disabled
                                       className="mt-1 py-1 px-3 border-2 w-full rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                                       data-field="region" />
                            </div>

                            <div>
                                <label htmlFor="days" className="block text-sm font-medium text-slate-700">Days</label>
                                <div className="mt-1 flex items-center gap-2">
                                    <input id="days" type="number" min="1" max="7" placeholder="3"
                                           value={itineraryContent.days}
                                           className={`w-28 py-1 px-3 border-2 rounded-md ${submitted ? (itineraryContent.days && (itineraryContent.days>=1 && itineraryContent.days<=7)) ?
                                               "border-slate-300" : "border-red-700":"border-slate-300"} focus:border-slate-400 focus:ring-0`}
                                           data-field="days"
                                           onChange={(e)=> {
                                               setItineraryContent(current => ({...current, days: parseInt(e.target.value)}))
                                           }
                                           }
                                    />
                                    <span className="text-slate-500 text-sm">days</span>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="priceFrom" className="block text-sm font-medium text-slate-700">Estimated from (optional)</label>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-slate-500">£</span>
                                    <input id="priceFrom" type="number" min="0" placeholder="250"
                                           value={itineraryContent.estimatedCost}
                                           className="w-32 py-1 px-3 border-2 rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                                           onChange={(e)=> setItineraryContent(current => ({...current, estimatedCost: e.target.value}))}
                                           data-field="priceFrom" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="summary" className="block text-sm font-medium text-slate-700">Summary</label>
                            <textarea id="summary" rows={3} placeholder="Perfect for food lovers and first-time visitors…"
                                      value={itineraryContent.summary}
                                      onChange={(e)=> {
                                          setItineraryContent(current => ({...current, summary: e.target.value}))
                                      }
                                      }
                                      className={`mt-1 py-1 px-3 border-2 w-full rounded-md ${submitted ? (itineraryContent.summary && itineraryContent.summary.length>=50) ?
                                          "border-slate-300" : "border-red-700":"border-slate-300"} focus:border-slate-400 focus:ring-0`}
                                      data-field="summary" minLength={50} maxLength={600}/>
                            <p className="text-xs text-slate-500 mt-1">Min 50 characters and keep it under 500 characters if possible.</p>
                        </div>
                    </section>

                    {/* Hero image */}
                    <section className="p-6 border-b border-slate-100">
                        <h2 className="text-base font-medium mb-4">Cover photo</h2>
                        <div className="flex items-start gap-4">
                            {
                                typeof(previewUrl) === "string" ? (
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
                        {
                            submitted ? (previewUrl) ? null :
                                (<p className="text-red-700 mt-2">Please upload a cover photo for your itinerary.</p>) : null
                        }
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
                                    plan={day.details}
                                    title={day.title}
                                    submitted={submitted}
                                    handleUpdateDayPlanContent={handleUpdateDayPlanContent}
                                    handleUpdateDayPlanTitle={handleUpdateDayPlanTitle}
                                    handleDeleteDay={handleDeleteDay}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">You can add more days later.</p>
                        {
                            submitted ? (itineraryContent.days === dayPlan.length) ? null :
                                (<p className="text-red-700 mt-2">Please make sure the days of your itinerary match the day plan.</p>) : null
                        }
                    </section>

                    {/* Tags / visibility */}
                    <section className="p-6">
                        <h2 className="text-base font-medium mb-4">Extras</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-slate-700">Highlights (optional)</label>
                                <input id="tags" type="text" placeholder="family, food, beach"
                                       className="mt-1 py-1 px-3 border-2 w-full rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                                       onChange={(e)=>
                                           setItineraryContent(current => ({...current, highlights: e.target.value}))}
                                       data-field="tags" />
                                <p className="text-xs text-slate-500 mt-1">Comma-separated. E.g. “family, foodie, budget”.</p>
                            </div>

                            <div>
                                <label htmlFor="visibility" className="block text-sm font-medium text-slate-700">Visibility</label>
                                <select id="visibility"
                                        value={itineraryContent.visibility}
                                        className="mt-1 py-1 px-3 border-2 w-full rounded-md border-slate-300 focus:border-slate-400 focus:ring-0"
                                        onChange={(e)=>
                                        {
                                            setItineraryContent(current=> ({...current, visibility: e.target.value}))}
                                        }
                                        data-field="visibility">
                                    <option value="PUBLIC">Public</option>
                                    <option value="PRIVATE">Private (only me)</option>
                                </select>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-end gap-2 mt-6">
                    <button type="button" className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50"
                            data-action="discard" onClick={()=> setShowConfirmationModal(true)}>Discard</button>
                    <button type="button" className="px-4 py-2 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            data-action="save-draft" disabled={isSavingDraft} onClick={handleSaveDraft}>
                        { isSavingDraft ? 'Saving' : 'Save Draft' }
                    </button>
                    <button type="button" className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                            data-action="publish" onClick={handleSubmitItinerary}>Publish</button>
                </div>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white max-w-md w-full mx-4 rounded-xl shadow-xl p-6 text-center">
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            🟢 Itinerary published
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Your itinerary has been created successfully.
                            <br />
                            Redirecting in{" "}
                            <span className="font-semibold">{countdown}</span> seconds…
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/profile?tab=published-itineraries")}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                        >
                            Go now
                        </button>
                    </div>
                </div>
            )}
            {
                showSuccessDraftSaveModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white max-w-md w-full mx-4 rounded-xl shadow-xl p-6 text-center">
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                                🟢 Itinerary Draft Saved
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Your itinerary draft has been saved successfully.
                                <br />
                                You can continue editing or come back later.
                            </p>

                            <button
                                type="button"
                                onClick={() => setShowSuccessDraftSaveModal(!showSuccessDraftSaveModal)}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                )
            }
            {
                showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white max-w-md w-full mx-4 rounded-xl shadow-xl p-6 text-center">
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                                { showModal.icon === "success" ? `🟢 ${showModal.msgTitle}` : `⚠️ ${showModal.msgTitle}` }
                            </h2>
                            <p className="text-slate-600 mb-6" dangerouslySetInnerHTML={{__html:showModal.msg}}>

                            </p>

                            <button
                                type="button"
                                onClick={() => setShowModal(null)}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                )
            }
            {
                showConfirmationModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white max-w-md w-full mx-4 rounded-xl shadow-xl p-6 text-center">
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                                ⚠️ Delete Draft Confirmation
                            </h2>
                            <p className="text-slate-600 mb-6">
                                    Please confirm to delete the draft
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowConfirmationModal(false);
                                    handleDeleteDraft();
                                }}
                                className="inline-flex items-center justify-center px-7 py-2 rounded-md bg-slate-900
                                text-white text-sm font-medium hover:bg-slate-800"
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowConfirmationModal(false)}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-slate-900
                                text-white text-sm font-medium hover:bg-slate-800 ml-5"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )
            }
            {
                showEmailVerificationModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white max-w-md w-full mx-4 rounded-xl shadow-xl p-6 text-center">
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                                ⚠️ Email Verification Required
                            </h2>
                            <p className="text-slate-600 mb-2">
                                Please verify your email first.
                            </p>
                            <p className="text-slate-600 mb-6">
                                You can request a new link if previous one is expired.
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowEmailVerificationModal(false);
                                }}
                                className="inline-flex items-center justify-center px-7 py-2 rounded-md bg-slate-900
                                text-white text-sm font-medium hover:bg-slate-800"
                            >
                                Ok
                            </button>
                            <button
                                type="button"
                                onClick={()=> handleEmailVerificationRequest()}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-slate-900
                                text-white text-sm font-medium hover:bg-slate-800 ml-5"
                            >
                                Request New Email Verification Link
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    );
}
