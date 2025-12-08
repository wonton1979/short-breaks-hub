import React, {useMemo, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from "../assets/logo-icon.png"
import { toast } from 'react-toastify';
import {Auth} from "../auth.js";
import {FaUserCircle} from "react-icons/fa";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeScroll, setActiveScroll] = useState("home");

    const links = useMemo(() => {
        const base = [
            { id: 'home',    label: 'Home',    type: 'scroll' },
            { id: 'explore', label: 'Explore', type: 'scroll' },
            { id: '/contact', label: 'Contact', type: 'route' },
            { id: '/live-weather', label: 'Live Weather', type: 'route' },
            { id: '/community-itineraries/region',label: 'Community Trips',type: 'route' },
        ];
        if (Auth.isLoggedIn()) {
            base.push({ id: 'logout', label: 'Logout', type: 'logout' });
        } else {
            base.push({ id: '/login', label: 'Login', type: 'route' });
        }
        return base;
    }, [location.key]);


    const go = (item) => {
        setOpen(false);

        if (item.type === 'route') {
            navigate(item.id);
            return;
        }

        const doScroll = () => {
            const el = document.getElementById(item.id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(doScroll, 50);
        } else {
            doScroll();
        }

        if (item.type === 'logout') {
            Auth.clear();
            navigate('/');
            window.location.reload();
            toast.success(`You have logged out successfully.`);
        }

    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
            <nav className="max-w-screen-xl mx-auto h-14 px-4 md:px-6 flex items-center justify-between">
                <a href="/" className="flex items-center space-x-2">
                    <img
                        src={Logo}
                        alt="Travel Explorer Logo"
                        className="hidden sm:block h-28 w-auto"
                    />
                </a>
                <ul className="hidden md:flex gap-6">
                    {links.map((l) => (
                        <li key={l.label}>
                            <button
                                onClick={() =>
                                {
                                    if(l.type === 'scroll') {
                                        setActiveScroll(l.id);
                                    }
                                    go(l)
                                }
                                }
                                className={`inline-block text-left py-3 text-gray-700 text-sm font-medium cursor-pointer 
                                ${
                                    l.type === 'route' &&
                                    ((l.id === '/' && location.pathname === '/') ||
                                        (l.id !== '/' && location.pathname.startsWith(l.id)))
                                        ? 'text-blue-600 border-b-[2px] border-blue-600 pb-1'
                                        : ''

                                } ${
                                    l.type === 'scroll' && location.pathname === '/' && activeScroll === l.id
                                        ? 'text-blue-600 border-b-[2px] border-blue-600 pb-1'
                                        : l.type === 'scroll'
                                            ? 'text-gray-700 hover:text-gray-900'
                                            : ''
                                }                              
                                        `}
                            >
                                {l.label}
                            </button>
                        </li>
                    ))}
                    {Auth.isLoggedIn() && (
                        <button
                            onClick={() => navigate("/profile")}
                            className="flex items-center text-gray-700 hover:text-gray-900 mx-10 cursor-pointer"
                        >
                            <FaUserCircle size={28} />
                        </button>
                    )}
                </ul>

                <button className="md:hidden border rounded px-2 py-1 cursor-pointer" onClick={() => setOpen(v => !v)}>
                    ☰
                </button>
            </nav>

            {open && (
                <div className="md:hidden border-t bg-white">
                    {links.map((l) => (
                        <button
                            key={l.label}
                            onClick={() => go(l)}
                            className={`inline-block text-left py-3 text-gray-700 text-sm font-medium cursor-pointer 
                                ${
                                l.type === 'route' &&
                                ((l.id === '/' && location.pathname === '/') ||
                                    (l.id !== '/' && location.pathname.startsWith(l.id)))
                                    ? 'text-blue-600 border-b-[2px] border-blue-600 pb-1'
                                    : ''

                            } ${
                                l.type === 'scroll' && location.pathname === '/' && activeScroll === l.id
                                    ? 'text-blue-600 border-b-[2px] border-blue-600 pb-1'
                                    : l.type === 'scroll'
                                        ? 'text-gray-700 hover:text-gray-900'
                                        : ''
                            }                              
                                        `}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            )}
        </header>
    );
}
