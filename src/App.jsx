import {Routes, Route, BrowserRouter} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SoutheastAsia from "./pages/SoutheastAsia.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="southeast-asia" element={<SoutheastAsia />} />
            </Routes>
            <Footer />
        </>
    )
}

export default App;
