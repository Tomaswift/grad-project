import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Input from "./components/ui/input";

// Import page components
import Home from "./pages/Home";
import Games from "./pages/Games";
import RespinJoker81 from "./pages/RespinJoker81";
import Studies from "./pages/Studies";
import Effects from "./pages/Effects";
import Quitting from "./pages/Quitting";

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleProducts = () => {
        setProductsOpen(!productsOpen);
    };

    return (
        <Router>
            <div className="app-container">
                {/* Background Video */}
                <div className="video-container">
                    <video autoPlay loop muted onError={(e) => console.error("Video error:", e)}>
                        <source src="/Problem Gambling.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-left">
                        <button className="menu-button" onClick={toggleSidebar}>☰</button>
                    </div>
                    <Link to="/" className="logo">ANTI GAMBLING</Link>
                </nav>

                {/* Sidebar Navigation */}
                <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                    <div className="sidebar-logo">
                        <div className="relax-logo">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                        <button className="close-button" onClick={toggleSidebar}>✖</button>
                    </div>

                    <Link to="/" className="sidebar-link active">Home</Link>

                    <div className="sidebar-dropdown">
                        <div className="sidebar-dropdown-header" onClick={toggleProducts}>
                            <span>Games</span>
                            <span className={`dropdown-icon ${productsOpen ? "open" : ""}`}>▼</span>
                        </div>

                        {productsOpen && (
                            <div className="sidebar-dropdown-content">
                                <Link to="/games/overview" className="dropdown-link">Overview</Link>
                                <Link to="/games/respinjoker81" className="dropdown-link">Respin Joker 81</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/studies" className="sidebar-link">Studies</Link>
                    <Link to="/effects" className="sidebar-link">Gambling Side Effects</Link>
                    <Link to="/quitting" className="sidebar-link">Quitting</Link>
                    <Link to="/about" className="sidebar-link">About Us</Link>
                    <Link to="/contact" className="sidebar-link">Contact</Link>
                </aside>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/games/overview" element={<Games />} />
                    <Route path="/games/respinjoker81" element={<RespinJoker81 />} />
                    <Route path="/studies" element={<Studies />} />
                    <Route path="/effects" element={<Effects />} />
                    <Route path="/quitting" element={<Quitting />} />
                </Routes>
            </div>
        </Router>
    );
};

// SearchBar component definition
const SearchBar = () => {
    const [query, setQuery] = useState("");

    return (
        <div className="search-container">
            <Input
                type="text"
                placeholder="Search games..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-bar"
            />
            <button className="search-button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
    );
};

export default App;