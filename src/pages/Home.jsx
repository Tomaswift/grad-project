import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import bgpic1 from "../assets/bgpic1.jpg";
import bgpic2 from "../assets/bgpic2.jpg";
import bgpic3 from "../assets/bgpic3.jpg";

const Home = () => {
    const [textVisible, setTextVisible] = useState(false);

    // Detect scroll for text animation
    useEffect(() => {
        const handleScroll = () => {
            const section = document.querySelector(".black-section");
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    setTextVisible(true);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="home-container">
            <div className="hero-section">
            </div>

            <div className="black-section">
                <div className="container">
                    <p className={`centered-paragraph ${textVisible ? "visible" : ""}`}>
                        Gambling addiction affects millions worldwide, causing financial devastation, broken
                        relationships, and mental health issues.
                        Our mission is to provide transparent information about gambling mechanics, risks, and recovery
                        paths.
                        By understanding how gambling works and its psychological effects, we help individuals make
                        informed choices
                        and find support when struggling with addiction. ANTI Gambling is dedicated to education,
                        prevention, and recovery,
                        challenging the gambling industry's glamorized portrayal with reality.
                    </p>
                </div>
            </div>

            <div className="portfolio-section">
                <h2 className="section-title">How We Help Gambling</h2>
                <p className="section-description">Discover our resources to understand gambling mechanics, risks, and
                    support for recovery</p>

                <div className="portfolio-grid">
                    <div className="portfolio-card">
                        <Image src={bgpic1}/>
                        <div className="portfolio-overlay">
                            <h3>GAMES</h3>
                            <Link to="/games" className="portfolio-link">View</Link>
                        </div>
                    </div>

                    <div className="portfolio-card">
                        <Image src={bgpic2}/>
                        <div className="portfolio-overlay">
                            <h3>STUDIES</h3>
                            <Link to="/studies" className="portfolio-link">View</Link>
                        </div>
                    </div>

                    <div className="portfolio-card">
                        <Image src={bgpic3}/>
                        <div className="portfolio-overlay">
                            <h3>QUITTING</h3>
                            <Link to="/quitting" className="portfolio-link">View</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="features-section">
                <h2 className="section-title">What We Bring To The Table</h2>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">⚠️</div>
                        <h3>Risk Awareness</h3>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🎮</div>
                        <h3>Game Transparency</h3>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Research Data</h3>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Support Resources</h3>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🧠</div>
                        <h3>Psychological Insights</h3>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🤝</div>
                        <h3>Recovery Paths</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;