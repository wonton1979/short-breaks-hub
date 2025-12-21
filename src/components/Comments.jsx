import React, {useEffect, useState} from "react";
import {showToast} from "../utils/toast.js";
import {
    postComment as postCommentApi, getCommentList, getCommentMe, deleteComment as deleteCommentApi,
    getResendVerificationEmail
} from "../api.js"
import {Auth} from "../auth.js";

export default function Comments({ itineraryId }) {

    const [showComposer, setShowComposer] = React.useState(false);
    const [body, setBody] = React.useState("");
    const [rating, setRating] = React.useState(0);
    const [saving, setSaving] = React.useState(false);
    const [hasUserCommented, setHasUserCommented] = React.useState(false);
    const [comments, setComments] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(1);
    const [commentCount, setCommentCount] = React.useState(0);
    const [commentDeleted, setCommentDeleted] = React.useState(false);
    const [showModal, setShowModal] = useState(null);
    const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);

    function loadComments(p = 0) {
        getCommentList(itineraryId).then((res) => {
            setComments(res.content);
        })
        if(localStorage.getItem("authToken"))
        {
            getCommentMe(itineraryId).then((res) => {
                if(res.hasUserCommented){
                    setBody(res.comment)
                    res.rating === "No Rating" ? setRating(0) : setRating(res.rating);
                    setHasUserCommented(true);
                }
            })
        }
    }

    useEffect(() => {
        loadComments(0);
    }, [itineraryId,commentDeleted]);



    function postComment() {

        if(!Auth.isEmailVerified()){
            setShowEmailVerificationModal(true);
            return;
        }

        if (!body.trim()) return;
        setSaving(true);
        postCommentApi(itineraryId, { body, rating: rating || null })
            .then(res => {
                loadComments(0)
                setCommentDeleted(false);
                setCommentCount(c => c + 1);
                setBody(""); setRating(0); setShowComposer(false);
                showToast("Comment has been added successfully!",{variant:"success",duration:4000});
            })
            .catch(err => {
                if (err?.response?.status === 401) {
                    showToast("Please log in to comment", { variant: "error",duration:4000 });
                } else {
                    showToast("Failed to post comment", { variant: "error",duration:4000 });
                }
            })
            .finally(() => setSaving(false));
    }

    function deleteComment() {
        deleteCommentApi(itineraryId).then((res) => {
            showToast("Comment has been removed successfully !", { variant: "success",duration:4000 });
            setCommentDeleted(true);
            setShowComposer(false);
            setBody("");
            setRating(0);
            setHasUserCommented(false);
            setCommentCount(c => c - 1);
        }).catch(err => {
            loadComments(0)
            showToast("Failed to delete comment", { variant: "error",duration:4000 });
        })
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

    return (
        <section id="comments" className="mt-10">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">
                    Comments {commentCount > 0 && <span className="text-slate-500">({commentCount})</span>}
                </h3>
                <button
                    className="px-3 py-2 rounded border hover:bg-slate-50 cursor-pointer"
                    onClick={() => setShowComposer(s => !s)}
                >
                    {showComposer ? "Cancel" : hasUserCommented ? "Modify My Comment" : "Write My Comment"}
                </button>
            </div>

            {/* Composer */}
            {showComposer && (
                <div className="mb-4 rounded border p-3">
                    <div className="mb-2 flex items-center gap-2">
                        <label className="text-sm text-slate-600">Rating</label>
                        <select
                            value={rating}
                            onChange={e => setRating(Number(e.target.value))}
                            className="border rounded px-2 py-1"
                        >
                            <option value={0}>No rating</option>
                            <option value={1}>★☆☆☆☆</option>
                            <option value={2}>★★☆☆☆</option>
                            <option value={3}>★★★☆☆</option>
                            <option value={4}>★★★★☆</option>
                            <option value={5}>★★★★★</option>
                        </select>
                    </div>

                    <textarea
                        className="w-full border rounded p-2"
                        rows={3}
                        placeholder="Share your experience…"
                        value={body}
                        onChange={e => setBody(e.target.value)}
                    />
                    <div className="mt-2 flex gap-2">
                        <button
                            disabled={saving || !body.trim()}
                            onClick={postComment}
                            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50 cursor-pointer"
                        >
                            { !hasUserCommented ? (saving ? "Posting…" : "Post") : (saving ? "Updating…" : "Update")}
                        </button>
                        { hasUserCommented && (<button className="px-4 py-2 rounded border cursor-pointer" onClick={deleteComment}>
                            Delete
                        </button>)}

                    </div>
                </div>
            )}

            {/* List */}
            {comments.length === 0 ? (
                <p className="text-slate-500">Be the first to comment.</p>
            ) : (
                <ul className="space-y-4">
                    {comments.map(c => (
                        <li key={c.id} className="border rounded p-3">
                            <div className="flex items-center gap-2 mb-1">
                                {c.userAvatarUrl && (
                                    <img src={c.userAvatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                                )}
                                <div className="text-sm">
                                    <div className="font-medium">{c.userDisplayName || "User"}</div>
                                    <div className="text-slate-500">
                                        {c.rating ? "★".repeat(c.rating) + "☆".repeat(5 - c.rating) : "No rating"}
                                    </div>
                                </div>
                                <div className="ml-auto text-xs text-slate-500">
                                    {new Date(c.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <p className="text-sm leading-6">{c.body}</p>
                        </li>
                    ))}
                </ul>
            )}

            {/* Pager */}
            <div className="mt-4 flex items-center gap-3">
                <button
                    disabled={page === 0}
                    onClick={() => loadComments(page - 1)}
                    className="border rounded px-3 py-1 disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-sm">Page {page + 1} / {Math.max(1, totalPages)}</span>
                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => loadComments(page + 1)}
                    className="border rounded px-3 py-1 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
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
        </section>
    )
}