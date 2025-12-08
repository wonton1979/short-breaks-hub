import {useEffect, useState} from "react";
import {postQuestionThread} from "../api.js";
import {isExpired,getUserId} from "../utils/jwtParser.js";

export default function ThreadConversation({   creatorId,
                                               threadDetails,
                                               loading,
                                               error,
                                               itineraryId,
                                               onThreadUpdated, }) {

    const [replyText, setReplyText] = useState("");
    const [replyLoading, setReplyLoading] = useState(false);
    const [replyError, setReplyError] = useState(null);
    const [isSamePerson, setIsSamePerson] = useState(false);
    const token = localStorage.getItem("authToken");

    useEffect(() => {

        console.log(threadDetails);

        setIsSamePerson(false);

        if (!threadDetails) return;

        const userId = getUserId();
        if (!userId) return;

        const messageCount = threadDetails.messages.length;

        if (parseInt(threadDetails.askerId) === parseInt(userId) && messageCount % 2 === 1) {
            setIsSamePerson(true);
        }

        if (parseInt(creatorId) === parseInt(userId) && messageCount % 2 === 0) {
            setIsSamePerson(true);
        }

    }, [threadDetails]);


    const handleSubmitReply = () => {
        const content = replyText.trim();
        if (!content) return;

        setReplyLoading(true);
        setReplyError(null);


        postQuestionThread(itineraryId,threadDetails.id,content).then((res) => {
                const updatedThread = res.data;

                setReplyText("");

                // Let parent update its state (threadDetails + summary)
                if (onThreadUpdated) {
                    onThreadUpdated(updatedThread);
                }
            })
            .catch((err) => {
                console.error("Failed to send reply", err);

                if (err.response?.status === 401) {
                    setReplyError("Please log in to reply.");
                } else if (err.response?.data?.message) {
                    setReplyError(err.response.data.message);
                } else {
                    setReplyError("Failed to send reply. Please try again.");
                }
            })
            .finally(() => {
                setReplyLoading(false);
            });
    };


    if (loading) {
        return (
            <div className="mt-3 text-sm text-slate-500">
                Loading conversation...
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-3 text-sm text-red-600">
                {error}
            </div>
        );
    }

    if (!threadDetails) {
        return null;
    }

    return (
        <div className="border-t border-slate-200 pt-3 space-y-3" onClick={(e) => e.stopPropagation()}>
            {threadDetails.messages.map((msg) => (
                <div key={msg.id} className="text-sm">
                    <p className="font-medium text-slate-800">
                        {msg.sender === "TRAVELLER"
                            ? threadDetails.askerUsername
                            : threadDetails.creatorUsername}
                    </p>
                    <p className="text-slate-700">{msg.content}</p>
                    <p className="text-xs text-slate-500 mt-1">
                        {new Date(msg.createdAt).toLocaleString()}
                    </p>
                </div>
            ))}
            {!threadDetails.closed &&
                token &&
                !isExpired(token) &&
                !isSamePerson  && (
                <div className="mt-3 border-t border-slate-200 pt-3">
                    <label className="block text-xs font-medium text-slate-700">
                        Add a reply
                    </label>
                    <textarea
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
                     min-h-[70px]"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        maxLength={1000}
                        placeholder="Write your reply..."
                    />

                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                            {replyText.length}/1000 characters
                        </p>

                        <button
                            type="button"
                            onClick={handleSubmitReply}
                            disabled={replyLoading || replyText.trim().length === 0}
                            className="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium
                       text-white hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {replyLoading ? "Sending..." : "Send reply"}
                        </button>
                    </div>

                    {replyError && (
                        <p className="mt-2 text-xs text-red-600">
                            {replyError}
                        </p>
                    )}
                </div>
            )}

            {threadDetails.closed && (
                <p className="mt-3 text-xs text-slate-500 italic">
                    This conversation is closed.
                </p>
            )}

        </div>
    );
}
