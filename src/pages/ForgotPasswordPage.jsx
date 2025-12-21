import { useState } from "react";
import {postRestPasswordEmail} from "../api.js"
import {useNavigate} from "react-router-dom";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [showSuccessSendModal,setShowSuccessSendModal] = useState(false);
    const [showErrorSendModal,setShowErrorSendModal] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        postRestPasswordEmail(email).then(res => {
            setShowSuccessSendModal(true);
            setSuccess(true);
            setEmail("");
        }).catch(err => setShowErrorSendModal(true))
    }

    return (
        <div className="container mx-auto max-w-md p-4 my-10">
            <h1 className="text-2xl font-semibold mb-4">Reset password</h1>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    className="w-full border p-2 rounded-md"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Your email"
                />

                <button className="bg-black text-white px-4 py-2 rounded cursor-pointer">
                    Send Reset Link
                </button>

                {success && (
                        <button type={"button"} className="bg-black text-white px-4 py-2 rounded ml-5 cursor-pointer"
                                onClick={() => navigate("/login")}>
                            Login Now
                        </button>
                )}
            </form>

            {showSuccessSendModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white max-w-md w-full mx-4 rounded-xl shadow-xl p-6 text-center">
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            🟢 Reset Password Request
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Your reset password link has been sent.
                            <br />
                            You should receive it within few minutes if you have account with us.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowSuccessSendModal(!showSuccessSendModal)}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                        >
                            Ok
                        </button>
                    </div>
                </div>
            )}
            {showErrorSendModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white max-w-md w-full mx-4 rounded-xl shadow-xl p-6 text-center">
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            ⚠️ Reset Password Request Failed
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Duo to a technical problem, You request couldn't to be sent.
                            <br />
                            Please try it again later or contact us if problem persists.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowErrorSendModal(!showErrorSendModal)}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                        >
                            Ok
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
