import { useState } from "react";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");

    function onChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    function onSubmit(e) {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            setStatus("Please fill in all fields.");
            return;
        }
        setStatus("Thanks! Your message has been recorded locally.");

        const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
        window.open(`mailto:hello@shortbreakshub.com?subject=Enquiry from ${encodeURIComponent(form.name)}&body=${body}`, "_blank");
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
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            className="rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 shadow"
                        >
                            Send
                        </button>
                        {status && <span className="text-sm text-gray-600">{status}</span>}
                    </div>

                    <p className="text-xs text-gray-400 pt-2">
                        No backend yet — we open your email client with your message prefilled.
                    </p>
                </form>
            </section>
        </main>
    );
}
