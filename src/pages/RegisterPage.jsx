import {useState, useMemo, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { postUserRegister } from "../api";

// Simple validators
const isEmailValid = (email) => /^([a-z0-9.-_]+)@([a-z0-9_-])+\.[a-z]{2,10}(.[a-z]{2,8})?$/i.test(email);
const hasUpper = (s) => /[A-Z]/.test(s);
const hasLower = (s) => /[a-z]/.test(s);
const hasDigit = (s) => /\d/.test(s);
const hasSpecial = (s) => /[^A-Za-z0-9]/.test(s);
const minLen = (s, n = 8) => s.length >= n;
const isValidDisplayName = (name) => {
    const trimmed = name.trim();
    const regex = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;
    return trimmed.length >= 2 && trimmed.length <= 30 && regex.test(trimmed);
};
const isPasswordMatch = (confirmPassword, password) => confirmPassword === password



export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [out, setOut] = useState(null);
    const [touchedEmail, setTouchedEmail] = useState(false);
    const [touchedPwd, setTouchedPwd] = useState(false);
    const [touchedConfirmation, setTouchedConfirmation] = useState(false);
    const [touchedDisplayName, setTouchedDisplayName] = useState(false);
    const navigate = useNavigate();
    const [redirectIn, setRedirectIn] = useState(5);
    const [showPwd, setShowPwd] = useState(false)

    useEffect(() => {
        if (!out?.success) return;
        const id = setInterval(() => setRedirectIn(s => (s > 1 ? s - 1 : 1)), 1000);
        return () => clearInterval(id);
    }, [out?.success]);


    const checks = useMemo(() => ({
        email:isEmailValid(email),
        len: minLen(password),
        upper: hasUpper(password),
        lower: hasLower(password),
        digit: hasDigit(password),
        special: hasSpecial(password),
        displayName: isValidDisplayName(displayName),
        passwordMatch: isPasswordMatch(passwordConfirm,password),
    }), [password,email,displayName,passwordConfirm]);

    const allOk = checks.len && checks.upper && checks.lower
        && checks.digit && checks.special && checks.displayName && checks.email && checks.passwordMatch;

    const submit = (e) => {
        e.preventDefault();
        setOut(null);

        postUserRegister(email, password, displayName)
            .then((res) => {
                setOut({ success: "Registration successful ! Redirecting to login..." });
                setTimeout(() => navigate("/login"), 5000);
            }).catch((err) => {

            const status = err?.response?.status;
            const dataMsg = err?.response?.data?.message || err?.response?.data?.error;
            let message;

            if (status === 409) {
                message = "Email Already Registered";
            } else if (status) {
                message = dataMsg || `Request failed with status ${status}`;
            } else {
                message = "Network error. Please try again.";
            }

            setOut({ ok: false, message });
            console.error("register failed:", { status, data: err?.response?.data, err });
        });
    };

    const item = (ok, label) => (
        <li style={{ color: ok ? "green" : "crimson" }}>
            {ok ? "✓" : "✗"} {label}
        </li>
    );

    return (
        <div className="container mx-auto max-w-md p-4">
            <h1 className="text-2xl font-semibold mb-4">Register</h1>

            {out && out.success ? (
                <div
                    role="status"
                    aria-live="polite"
                    className="mb-6 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-800"
                >
                    <div className="flex items-start gap-3">
                        <svg
                            className="h-5 w-5 shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879A1 1 0 006.293 10.293l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <p className="font-medium">
                                {out.success}
                            </p>
                            <p className="mt-1 text-sm">
                                Redirecting to <span className="font-semibold">Login</span> in{" "}
                                <span className="font-semibold">{redirectIn}</span> seconds…
                                {" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="underline underline-offset-2 hover:text-green-900"
                                >
                                    Go now
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <form onSubmit={submit} className="space-y-3">
                        <div>
                            <label className="block mb-1">Email</label>
                            <input
                                className="w-full border p-2 rounded-md"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setTouchedEmail(true)}
                                required
                            />
                            {
                                touchedEmail && !checks.email && (
                                    <ul style={{ marginTop: 8, fontSize: 14, lineHeight: 1.4 }}>
                                        {item(checks.email, "Please enter a valid email address.")}
                                    </ul>
                                )
                            }
                            {
                                out?.message ? (
                                    <p className="text-red-500 mt-2 text-[14px]">{out.message}</p>
                                ):null
                            }
                        </div>

                        <div>
                            <label className="block mb-1">Password</label>
                            <div className="relative">
                                <input
                                    className="w-full border p-2 pr-10 rounded-md"  // pr-10 gives space for the eye button
                                    type={showPwd ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => setTouchedPwd(true)}
                                    required
                                    aria-label="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute inset-y-0 right-2 flex items-center"
                                    aria-label={showPwd ? "Hide password" : "Show password"}
                                    title={showPwd ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                >
                                    {showPwd ? (
                                        // Eye-off
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor"
                                             className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c1.598 0 3.111-.37 4.444-1.035M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.066 7.5a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228L21 21" />
                                        </svg>
                                    ) : (
                                        // Eye
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor"
                                             className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.183.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>

                                    )}
                                </button>
                            </div>

                            {(touchedPwd || (!allOk && out?.error)) && (
                                <ul style={{ marginTop: 8, fontSize: 14, lineHeight: 1.4 }}>
                                    {item(checks.len, "At least 8 characters")}
                                    {item(checks.upper, "At least one uppercase letter (A–Z)")}
                                    {item(checks.lower, "At least one lowercase letter (a–z)")}
                                    {item(checks.digit, "At least one digit (0–9)")}
                                    {item(checks.special, "At least one special character")}
                                </ul>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 ">Confirm Password</label>
                            <input
                                className="w-full border p-2 rounded-md"
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                onBlur={() => setTouchedConfirmation(true)}
                                required
                            />

                            {(touchedConfirmation && passwordConfirm !== password) && (
                                <p className="text-red-500 mt-2 text-[14px]">✗ Password Not Match.</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1">Display name</label>
                            <input
                                className="w-full border p-2 rounded-md"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                onBlur={()=>setTouchedDisplayName(true)}
                                required
                            />
                        </div>
                        {
                            (touchedDisplayName && !checks.displayName) && (
                                <ul style={{ marginTop: 8, fontSize: 14, lineHeight: 1.4 }}>
                                    {item(checks.displayName, "Please enter a display name. No special characters.")}
                                </ul>
                            )
                        }

                        <button
                            className="bg-black text-white px-4 py-2 rounded disabled:opacity-60 cursor-pointer mt-2"
                            disabled={!allOk}
                        >
                            Create account
                        </button>
                    </form>

                    {out && out.error && (
                        <p className="text-red-500 mt-3">{out.error}</p>
                    )}
                </>
            )}
        </div>
    );
}

