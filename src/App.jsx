import {Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RegionPage from "./pages/RegionPage.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ItineraryPage from "./pages/ItineraryPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage";
import CreateItineraryPage from "./pages/CreateItineraryPage.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WeatherPage from "./pages/WeatherPage.jsx";
import useTokenCountdown from "./hooks/useTokenCountdown";
import BlockingSessionModal from "./components/BlockingSessionModal.jsx";
import {useState} from "react";
import {postUserRenewToken} from "./api.js";

function App() {

    const [secondsLeft, setSecondsLeft] = useState(null);


    function handleAlmostExpired(secondsRemaining) {
        if (secondsRemaining <= 120) {
            setSecondsLeft(secondsRemaining);
        } else {
            setSecondsLeft(null);
        }
    }

    function handleExpired() {
        localStorage.removeItem("authToken");
        localStorage.setItem("auth:toast", "Session expired. Please log in again.");
        window.location.replace("/login?reason=expired");
    }

    useTokenCountdown(handleAlmostExpired, handleExpired);

    function handleStaySignedIn() {
        setSecondsLeft(null);
        postUserRenewToken().then((data) => {
            localStorage.setItem("authToken", data);
            window.location.reload();
        })
    }

    function handleLogout() {
        localStorage.removeItem("authToken");
        window.location.reload();
    }

    const shouldShowModal =
        typeof secondsLeft === "number" && secondsLeft <= 120;


    return (
        <>
            <Navbar />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
            />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/:region" element={<RegionPage />} />
                <Route path="/itinerary/:slug" element={<ItineraryPage />} />
                <Route path="/browse/:country" element={<BrowsePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/create-itinerary" element={<CreateItineraryPage />} />
                <Route path="/live-weather" element={<WeatherPage />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
            <Footer />
            {shouldShowModal && (
                <BlockingSessionModal
                    secondsLeft={secondsLeft}
                    onStay={handleStaySignedIn}
                    onLogout={handleLogout}
                />
            )}
        </>
    )
}

export default App;
