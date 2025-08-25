import {Routes, Route, BrowserRouter} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SoutheastAsia from "./pages/SoutheastAsia.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ItineraryPage from "./pages/ItineraryPage.jsx";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="southeast-asia" element={<SoutheastAsia />} />
                <Route path="/itinerary/:slug" element={<ItineraryPage />} />
            </Routes>
            <Footer />
        </>
    )
}

export default App;
