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

function App() {
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
                <Route path="*" element={<NotFound />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
            <Footer />
        </>
    )
}

export default App;
