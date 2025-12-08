import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function VerifyEmailPage() {
    const [params] = useSearchParams();
    const [state, setState] = useState({ status: "loading", message: "Verifying..." });
    const token = params.get("token");

    useEffect(() => {
        if (!token) {
            setState({ status: "error", message: "Missing token." });
            return;
        }
        axios
            .get(`${API}/api/auth/verify-email`, { params: { token } })
            .then(() => setState({ status: "success", message: "Email verified! You can now log in." }))
            .catch((err) => {
                let msg = "Invalid or expired link.";
                if (err.response) {
                    const status = err.response.status;
                    if (status === 409) {
                        msg = "Your email address has already been verified.";
                        setState({ status: "warning", message: msg });
                    } else if (status === 410) {
                        msg = "This verification link has expired.";
                        setState({ status: "error", message: msg });
                    } else if (status === 400) {
                        msg = "Invalid verification link.";
                        setState({ status: "error", message: msg });
                    } else {
                        msg = err.response.data?.message || msg;
                        setState({ status: "error", message: msg });
                    }
                }

            });
    }, [token]);

    const border = state.status === "success" ? "border-green-300" :
        state.status === "error"   ? "border-red-300"   : "border-slate-400";
    const iconBg = state.status === "success" ? "bg-green-100" :
        state.status === "error"   ? "bg-red-100"     : "bg-slate-100";

    return (
        <div className="min-h-[30vh] flex items-center justify-center px-4">
            <div className={`w-full max-w-md rounded-xl border ${border} bg-white shadow-sm`}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`h-9 w-9 rounded-full ${iconBg} grid place-items-center`}>
                            {state.status === "loading" && (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25"/>
                                    <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            )}
                            {state.status === "success" && (
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.7a1 1 0 0 0-1.4-1.4L9 10.9 7.7 9.6a1 1 0 1 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" clipRule="evenodd"/>
                                </svg>
                            )}
                            {state.status === "warning" && (
                                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                            {state.status === "error" && (
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-1-5h2v2H9v-2Zm0-6h2v5H9V7Z" clipRule="evenodd"/>
                                </svg>
                            )}
                        </div>
                        <h1 className="text-lg font-semibold">
                            {state.status === "loading" ? "Verifying email…" :
                                state.status === "success" ? "Verification successful" :
                                    state.status === "warning" ? "Already Verified" : "Verification failed"}
                        </h1>
                    </div>

                    <p className="text-slate-700 mb-6">{state.message}</p>

                    <div className="flex gap-3">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
                        >
                            Back to home
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-90"
                        >
                            Go to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}