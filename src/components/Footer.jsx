export default function Footer() {
    return (
        <footer
            className="relative text-gray-200 mt-12"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative max-w-screen-xl mx-auto px-4 md:px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div>
                        <h2 className="text-lg font-semibold text-white mb-4">Short Break Hub</h2>
                        <p className="text-sm">
                            Discover the best travel itineraries and tips around the world.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-md font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="hover:text-yellow-300">Home</a></li>
                            <li><a href="/southeast-asia" className="hover:text-yellow-300">Southeast Asia</a></li>
                            <li><a href="#" className="hover:text-yellow-300">Europe</a></li>
                            <li><a href="/contact" className="hover:text-yellow-300">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-md font-semibold text-white mb-4">Follow Us</h3>
                        <div className="flex space-x-4 text-xl">
                            <a href="#" className="hover:text-yellow-300">🌐</a>
                            <a href="#" className="hover:text-yellow-300">🐦</a>
                            <a href="#" className="hover:text-yellow-300">📷</a>
                        </div>
                        <p className="text-xs mt-4">© {new Date().getFullYear()} Short Break Hub. All rights reserved.</p>
                    </div>

                </div>
            </div>
        </footer>
    );
}
