import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getMe, updateUser, postUserPhoto, updateUserPhoto,getMeFavorites} from '../api.js';
import {Auth} from '../auth.js';
import {showToast} from "../utils/toast.js";
import {toast} from "react-toastify";
import ItineraryCard from "../components/ItineraryCard.jsx";

export default function ProfilePage() {
    const [out, setOut] = useState({loading: true, data: null, error: null});
    const navigate = useNavigate();
    const [tab, setTab] = useState("overview");
    const [settings, setSettings] = useState({
        userId: undefined,
        displayName: "",
        location: "",
        bio: "",
        adults: 1,
        children: 0,
        avatarUrl: ""
    });
    const [saving, setSaving] = useState(false);
    const [favorites, setFavorites] = useState([]);


    useEffect(() => {
        if (!out?.data) return;
        const m = out.data;
        setSettings({
            userId: m.id || undefined,
            displayName: m.displayName || m.username || "",
            location: m.location || "",
            bio: m.bio || "",
            adults: m.adults || 1,
            children: m.children || 0,
            avatarUrl: m.avatarUrl || "",
        });
    }, [out?.data]);


    const tabClass = (name) =>
        `pb-3 text-sm font-medium border-b-2 transition
   ${tab === name ? "border-sky-600 text-sky-700"
            : "border-transparent text-slate-600 hover:text-slate-900"}`;


    useEffect(() => {
        if (!Auth.isLoggedIn()) {
            navigate('/login');
            return;
        }
        getMe()
            .then(data => {
                setOut({loading: false, data, error: null});
            })
            .catch(err => {
                setOut({loading: false, data: null, error: String(err)});
            });
    }, [navigate]);

    function onAvatarChange(e) {
        const file = e.target.files?.[0]
        if (!file) return;
        if (!file.type.startsWith("image/")) return showToast("Please choose an image",
            { variant: 'error', duration: 3500 });
        if (file.size > 3 * 1024 * 1024) return showToast("Max size is 3MB",
            { variant: 'error', duration: 3500 });
        postUserPhoto(file).then(data => {
            updateUserPhoto({avatarUrl: data}).then(data => {
                setOut({ ...out, data: { ...(out?.data || {}), ...data} });
                showToast('Avatar Photo Has Been Updated Successfully.');
            });
        })

    }

    useEffect(() => {
        getMeFavorites().then(data => {
            setFavorites(data.content)
        }).catch(err => {
            showToast("Sorry,But You Don't Have Any Favorites Yet!",
                {variant:"error",duration:4000})
        })
    }, []);


    if (out.loading) return <div className="p-4">Loading…</div>;

    if (out.error) {
        return (
            <div className="p-4 text-red-600">
                Failed to load profile: {out.error}
            </div>
        );
    }

    const me = out.data || {}; // { id, email, username, displayName, role, ... }

    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            {/* Header card */}
            <section className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
                {/* Avatar*/}
                <div className="h-16 w-16 rounded-full border bg-slate-100 overflow-hidden">
                    <img src={me.avatarUrl} alt="Avatar Picture" className="h-full w-full object-cover" />
                </div>

                <div>
                    <p className="text-xl font-semibold">
                        {me.displayName || me.username || "User"}
                    </p>
                    <p className="text-slate-600 text-sm">
                        {me.email || ""}
                    </p>
                </div>
            </section>
            {/* Tabs */}
            <nav className="mt-6 border-b">
                <div className="-mb-px flex gap-6">
                    <button className={tabClass("overview")}  onClick={() => setTab("overview")}>Overview</button>
                    <button className={tabClass("favorites")} onClick={() => setTab("favorites")}>Favorites</button>
                    <button className={tabClass("bookmarks")} onClick={() => setTab("bookmarks")}>Bookmarks</button>
                    <button className={tabClass("settings")}  onClick={() => setTab("settings")}>Settings</button>
                </div>
            </nav>

            <section className="mt-6">
                {tab === "overview" && (
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="text-base font-semibold">Overview</h2>

                        <div className="mt-3 space-y-3 text-slate-700">
                            <div>
                                <span className="font-medium">Display Name:</span> {me.displayName || me.username}
                            </div>
                            <div>
                                <span className="font-medium">Email:</span> {me.email}
                            </div>
                            <div>
                                <span className="font-medium">Travel Group:</span>{" "}
                                {(me.adults ?? 1)} adults · {(me.children ?? 0)} children
                            </div>


                            <div>
                                <span className="font-medium">Location:</span> {me.location || "—"}
                            </div>
                            <div>
                                <span className="font-medium">Bio:</span> {me.bio || "No bio yet"}
                            </div>
                        </div>
                    </div>
                )}


                {tab === "favorites" && (
                    <div className="rounded-lg border bg-white p-6 text-slate-700 shadow-sm">
                        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {favorites.map((it) => (
                                <ItineraryCard key={it.slug} it={it} showLikes={true} />
                            ))}
                        </ul>
                    </div>
                )}

                {tab === "bookmarks" && (
                    <div className="rounded-lg border bg-white p-6 text-slate-700 shadow-sm">
                        <h2 className="text-base font-semibold">Bookmarks</h2>
                        <p className="mt-2">
                            Itineraries you saved for later will appear here. (Coming soon)
                        </p>
                    </div>
                )}


                {tab === "settings" && (
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="text-base font-semibold">Settings</h2>
                        <div className="mt-4 grid max-w-md gap-4 text-slate-700">
                            {/* Avatar uploader */}
                            <div className="mt-2 flex items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <input
                                        id="avatar-file"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={onAvatarChange}
                                    />
                                    <label
                                        htmlFor="avatar-file"
                                        className="inline-flex cursor-pointer items-center gap-2 rounded border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
                                    >
                                        Upload Profile Picture
                                    </label>
                                    <p className="mt-1 text-xs text-slate-500">JPG/PNG, up to 3 MB.</p>
                                </div>
                            </div>

                            {/* Display name */}
                            <label className="block">
                                <span className="text-sm text-slate-700">Display Name</span>
                                <input
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    value={settings.displayName}
                                    onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                                    placeholder="Your display name"
                                />
                            </label>

                            {/* Location */}
                            <label className="block">
                                <span className="text-sm text-slate-700">Location</span>
                                <input
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    value={settings.location}
                                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                                    placeholder="e.g., Sheffield, UK"
                                />
                            </label>

                            {/* Bio */}
                            <label className="block">
                                <span className="text-sm text-slate-700">Bio</span>
                                <textarea
                                    rows={3}
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    value={settings.bio}
                                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                                    placeholder="A short intro about you"
                                />
                            </label>

                            {/* Travel group */}
                            <div className="block">
                                <span className="text-sm text-slate-700">Travel Group</span>
                                <div className="mt-2 flex gap-6">
                                    {/* Adults */}
                                    <div className="flex items-center gap-2">
                                        <span>Adults:</span>
                                        <button
                                            className="w-7 h-7 rounded border bg-slate-100 hover:bg-slate-200"
                                            onClick={() =>
                                                setSettings((s) => ({ ...s, adults: Math.max(1, s.adults - 1) }))
                                            }
                                        >−</button>
                                        <span className="w-6 text-center">{settings.adults}</span>
                                        <button
                                            className="w-7 h-7 rounded border bg-slate-100 hover:bg-slate-200"
                                            onClick={() =>
                                                setSettings((s) => ({ ...s, adults: s.adults + 1 }))
                                            }
                                        >+</button>
                                    </div>

                                    {/* Children */}
                                    <div className="flex items-center gap-2">
                                        <span>Children:</span>
                                        <button
                                            className="w-7 h-7 rounded border bg-slate-100 hover:bg-slate-200"
                                            onClick={() =>
                                                setSettings((s) => ({ ...s, children: Math.max(0, s.children - 1) }))
                                            }
                                        >−</button>
                                        <span className="w-6 text-center">{settings.children}</span>
                                        <button
                                            className="w-7 h-7 rounded border bg-slate-100 hover:bg-slate-200"
                                            onClick={() =>
                                                setSettings((s) => ({ ...s, children: s.children + 1 }))
                                            }
                                        >+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Save */}
                            <div className="pt-2">
                                <button
                                    disabled={saving}
                                    className={`rounded px-3 py-2 text-white ${saving ? "bg-slate-400" : "bg-sky-600 hover:bg-sky-700"}`}
                                    onClick={() => {
                                        setSaving(true);
                                        // shape your API expects; adjust field names if needed
                                        const payload = {
                                            displayName: settings.displayName,
                                            location: settings.location,
                                            bio: settings.bio,
                                            adults: settings.adults,
                                            children: settings.children,
                                        };
                                        updateUser(payload).then((data) => {
                                            console.log(data);
                                            setOut({ ...out, data: { ...(out?.data || {}), ...data} });
                                            showToast('Profile Updated Successfully.');
                                            }
                                        ).catch((err) => {
                                            showToast('Failed to save changes', { variant: 'error', duration: 3500 });
                                        })
                                        .finally(() => setSaving(false));
                                    }}
                                >
                                    {saving ? "Saving…" : "Save changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </section>

        </main>
    );
}

