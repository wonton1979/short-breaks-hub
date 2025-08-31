import React, {useRef} from "react";
import heroBg from "../assets/hero-bg.jpg";
import {Typewriter} from "react-simple-typewriter";
import {FaChevronDown} from "react-icons/fa";
import RegionCard from "../components/RegionCard.jsx";
import southeastImg from "../assets/southeast.jpg";
import eastAsiaImg from "../assets/eastasia.jpg";
import europeImg from "../assets/europe.jpg";
import {useNavigate} from "react-router-dom";


function HomePage() {
    const exploreRef = useRef(null);
    const scrollToExplore = () => {
        exploreRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const navigate = useNavigate();

    return (
        <>
            <section id="home" className="scroll-mt-20">
                <div
                    className="relative min-h-[65vh] bg-cover bg-center"
                    style={{ backgroundImage: `url('${heroBg}')` }}
                >

                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60 z-0"></div>


                    <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-4 h-screen">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                            Short Break Hub
                        </h1>
                        <h4 className="text-3xl mt-16 sm:text-4xl font-extrabold text-yellow-300 drop-shadow-lg text-center">
                            Explore&nbsp;
                            <span className="text-white">
                                <Typewriter
                                    words={['Asia', 'Europe', 'Tropical Paradise']}
                                    loop={true}
                                    cursor
                                    cursorStyle="_"
                                    typeSpeed={70}
                                    deleteSpeed={50}
                                    delaySpeed={1000}
                                />
                          </span>
                        </h4>
                        <button className="mt-28 cursor-pointer bg-yellow-400 hover:bg-yellow-100 text-gray-900 shadow-lg px-6 py-3 rounded-full transition-all duration-300">
                            Explore Now
                        </button>
                        {/* Desktop vertical ribbon */}
                        <div className="hidden lg:flex absolute right-3 lg:right-6 top-10 bottom-10 items-center">
                          <span
                              className="text-white/80 tracking-widest uppercase text-xs lg:text-sm
                                       pl-3 border-l-2 border-white/50"
                              style={{ writingMode: 'vertical-rl' }}
                          >
                            Explore the world · Your journey starts here
                          </span>
                        </div>

                        {/* Mobile horizontal tagline */}
                        <div className="block lg:hidden mt-16 text-center">
                          <span className="text-white/90 text-sm tracking-wide">
                            Explore the world · Your journey starts here
                          </span>
                        </div>


                        <div onClick={scrollToExplore} className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer">
                            <FaChevronDown className="animate-bounce text-white text-4xl" />
                        </div>
                    </div>
                </div>
            </section>
            <section id="explore" className="scroll-mt-20">
                <div ref={exploreRef} className="py-16 px-6 bg-white">
                    <h2 className="text-3xl font-bold text-center mb-10">Explore by Region</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Southeast Asia */}
                        <RegionCard
                            image={southeastImg}
                            title="Southeast Asia"
                            description="Tropical beaches, vibrant cultures, and delicious street food."
                            onClick={() => navigate("/southeast-asia")}
                        />
                        <RegionCard
                            image={eastAsiaImg}
                            title="East Asia"
                            description="Ancient temples, futuristic cities, and rich traditions."
                            onClick={() => console.log('Go to East Asia')}
                        />
                        <RegionCard
                            image={europeImg}
                            title="Europe"
                            description="Charming towns, iconic landmarks, and timeless elegance."
                            onClick={() => console.log('Go to Europe')}
                        />
                    </div>
                </div>
            </section>
            <footer id="contact" className="scroll-mt-20">
                {/* contact/footer */}
            </footer>
        </>
    );
}

export default HomePage;