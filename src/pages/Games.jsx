import { Link } from "react-router-dom";

const Games = () => {
    return (
        <div className="games-container">
            <div className="games-hero">
                <h1>Our Games</h1>
                <p>Experience gambling mechanics without real money to understand how they work</p>
            </div>

            <div className="games-grid">
                <GameCard
                    name="Respin Joker 81"
                    image="/gamesrespinjoker81.png"
                    description="Try this fruit-themed slot machine demo to understand its mechanics and odds"
                    path="/games/respinjoker81"
                />
                {/* Add more game cards as needed */}
            </div>
        </div>
    );
};

const GameCard = ({ name, image, description, path }) => {
    return (
        <Link to={path} className="game-card">
            <img src={image} alt={name} />
            <div className="game-card-overlay">
                <h3>{name}</h3>
                <p>{description}</p>
            </div>
        </Link>
    );
};

export default Games;