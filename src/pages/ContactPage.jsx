import {useMemo, useState} from "react";
import {postContact} from "../api.js";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [showSuccessContactSaveModal, setShowSuccessContactSaveModal] = useState(false);


    const isEmailValid = (email) => /^([a-z0-9.-_]+)@([a-z0-9_-]){2,}\.[a-z]{2,10}(.[a-z]{2,8})?$/i.test(email);
    const isValidName = (name) => {
        const trimmed = name.trim();
        const regex = /^[A-Za-z]{2,}(?: [A-Za-z]+)*$/;
        return trimmed.length >= 2 && trimmed.length <= 30 && regex.test(trimmed);
    };
    const isValidMessage = (message) => {
        return message && message.length > 50 && message.length <= 2000;
    }

    const checks = useMemo(() => ({
        email:isEmailValid(form.email),
        name: isValidName(form.name),
        message: isValidMessage(form.message),
    }), [form.email,form.name,form.message]);

    const allOk = checks.name && checks.email && checks.message;

    function onChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    function onSubmit(e) {
        e.preventDefault();
        if(allOk) {
            postContact(form).then(data => {
                setShowSuccessContactSaveModal(true);
            })
        }
        setForm({ name: "", email: "", message: "" });
    }

    return (
        <main className="min-h-[70vh] bg-gray-50">
            <section className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact</h1>
                <p className="text-gray-600 mb-8">
                    Questions, ideas, or partnership enquiries? Drop us a note.
                </p>

                <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1" htmlFor="name">Name</label>
                        <input
                            id="name" name="name" value={form.name} onChange={onChange}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Jane Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1" htmlFor="email">Email</label>
                        <input
                            id="email" name="email" type="email" value={form.email} onChange={onChange}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="jane@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1" htmlFor="message">Message</label>
                        <textarea
                            id="message" name="message" rows={5} value={form.message} onChange={onChange}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Tell us what you’re planning…"
                        />
                        <p className="text-xs text-slate-500 mt-1">Min 50 characters and keep it under 2000 characters please.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            disabled={!allOk}
                            type="submit"
                            className="rounded-lg bg-yellow-500 hover:bg-yellow-600 cursor-pointer
                            text-black font-semibold px-8 py-2 shadow disabled:bg-slate-300"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </section>

            {
                showSuccessContactSaveModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white max-w-md w-full mx-4 rounded-xl shadow-xl p-6 text-center">
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                                🟢 Message Sent Successfully
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Thanks for contact us!
                                <br />
                                We will get back to you soon.
                            </p>

                            <button
                                type="button"
                                onClick={() => setShowSuccessContactSaveModal(!showSuccessContactSaveModal)}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                )
            }
        </main>
    );
}
