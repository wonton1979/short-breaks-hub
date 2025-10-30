import {useEffect, useState} from "react";
import { postUserLogin } from "../api.js";
import {Auth} from "../auth.js";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';
import {showToast} from "../utils/toast.js";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [out, setOut] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const reason = params.get('reason');
        const msg = localStorage.getItem('auth:toast');


        if (reason === 'unauthorized' || reason === 'expired') {
            showToast(msg || (reason === 'expired' ? 'Session expired. Please log in again' : 'Unauthorized. Please log in first'),{
                variant: 'error',
                duration: 3500,
            });
            localStorage.removeItem('auth:toast');
        }
    }, [location.search]);

    const submit = (e) => {
        e.preventDefault();
        setOut(null);
        postUserLogin(email, password).then((res) => {
            Auth.save(res.token);
            setOut({ ok: true, user: res.user });
            toast.success(`Welcome back, ${res?.displayName || 'traveler'} !`);
            navigate("/");
            window.location.reload();
        }).catch((err) => {
            setOut(err.response?.data ? { error: "Incorrect Email Or Password" } : null);
        });
    };

    return (
        <div className="container mx-auto max-w-md p-4">
            <h1 className="text-2xl font-semibold mb-4">Login</h1>
            <form onSubmit={submit} className="space-y-3">
                <div>
                    <label className="block mb-1">Email</label>
                    <input
                        className="w-full border p-2"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Password</label>
                    <input
                        className="w-full border p-2"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="bg-black text-white px-4 py-2 rounded">Login</button>
            </form>

            <p className="mt-4 text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                    Register here
                </Link>
            </p>
            {out && out.error ? (
                <p className="text-red-500 mt-3 text-[14px]">{out.error}</p>
            ): null}
        </div>
    )
}
