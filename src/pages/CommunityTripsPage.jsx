import southeastAsiaCommunityImg from "../assets/southeast-community.jpg";
import eastAsiaCommunityImg from "../assets/eastasia-community.jpg";
import europeCommunityImg from "../assets/europe-community.jpg";
import americasCommunityImg from "../assets/americas-community.jpg";
import anzCommunityImg from "../assets/anz-community.jpg";
import africaCommunityImg from "../assets/africa-community.jpg"
import {useNavigate} from "react-router-dom";
import RegionCard from "../components/RegionCard.jsx";
import {useRef} from "react";


export default function CommunityTripsPage() {

    const exploreRef = useRef(null);


    const navigate = useNavigate();

    const regions = [
        {
            title: "Southeast Asia",
            description: "Real traveler journeys through beaches,night markets and vibrant cultural cities",
            image: southeastAsiaCommunityImg,
            onClick: "southeast-asia",
        },
        {
            title: "East Asia",
            description: "Traveler-shared trips showcasing modern skylines ancient sites, and scenic landscapes",
            image: eastAsiaCommunityImg,
            onClick: "east-asia-community",
        },
        {
            title: "Europe",
            description: "User-crafted routes through historic towns,cafe streets and iconic European scenery",
            image: europeCommunityImg,
            onClick: "EUROPE",
        },
        {
            title: "Americas",
            description: "Community adventures from coastlines to big cities - road trips,nature and culture.",
            image: americasCommunityImg,
            onClick: "americas-community",
        },
        {
            title: "Australia & New Zealand",
            description: "Nature-focused escapes shared by travelers - coastal derives,wildlife and mountain trials",
            image: anzCommunityImg,
            onClick: "anz-community",
        },
        {
            title: "Africa",
            description: "Golden deserts, wild savanna landscapes and diverse cultures shaped by ancient traditions",
            image: africaCommunityImg,
            onClick: "africa-community",
        },
    ];

    return (
        <>
            <section id="explore" className="scroll-mt-20">
                <div ref={exploreRef} className="py-16 px-6 bg-white">
                    <h2 className="text-3xl font-bold text-center mb-10">Explore by Region</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        { regions.map((item, index) => (
                            <RegionCard
                                key={index}
                                image={item.image}
                                title={item.title}
                                description={item.description}
                                onClick={() => navigate(item.onClick)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}