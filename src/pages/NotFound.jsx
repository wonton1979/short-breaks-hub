export default function NotFound() {
    return (
        <main className="min-h-[60vh] flex items-center justify-center text-center p-8">
            <div>
                <h1 className="text-3xl font-extrabold">Page not found</h1>
                <p className="mt-2 text-gray-600">The page you’re looking for doesn’t exist.</p>
                <a href="/" className="mt-6 inline-block rounded bg-yellow-500 px-4 py-2 font-semibold hover:bg-yellow-600 text-black">
                    Back to home
                </a>
            </div>
        </main>
    );
}
