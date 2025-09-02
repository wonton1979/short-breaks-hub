import {Routes, Route, BrowserRouter} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SoutheastAsia from "./pages/SoutheastAsia.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ItineraryPage from "./pages/ItineraryPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import ContactPage from "./pages/ContactPage.jsx";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="southeast-asia" element={<SoutheastAsia />} />
                <Route path="/itinerary/:slug" element={<ItineraryPage />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
            <Footer />
        </>
    )
}

export default App;
