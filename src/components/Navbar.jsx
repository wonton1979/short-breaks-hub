// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from "../assets/logo-icon.png"

const links = [
    { id: 'home', label: 'Home', type: 'scroll' },
    { id: 'explore', label: 'Explore', type: 'scroll' },
    { id: '/southeast-asia', label: 'Southeast Asia', type: 'route' }, // route
    { id: 'contact', label: 'Contact', type: 'scroll' },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const go = (item) => {
        setOpen(false);

        if (item.type === 'route') {
            // navigate to a different page
            navigate(item.id);
            return;
        }

        // scroll on the current page
        // if we are not on "/", go home first, then scroll after a tick
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
                    <img
                        src={Logo}
                        alt="Travel Explorer"
                        className="block sm:hidden h-28 w-auto"
                    />
                </a>

                <ul className="hidden md:flex gap-6">
                    {links.map((l) => (
                        <li key={l.label}>
                            <button
                                onClick={() => go(l)}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                            >
                                {l.label}
                            </button>
                        </li>
                    ))}
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
                            className="block w-full text-left px-4 py-3 text-gray-700"
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            )}
        </header>
    );
}
