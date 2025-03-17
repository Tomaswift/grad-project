import SlotMachine from "../components/SlotMachine";

const RespinJoker81 = () => {
    return (
        <div className="game-detail-container">
            <h1>Respin Joker 81</h1>
            <div className="game-demo">
                <SlotMachine />
            </div>
            <div className="game-info">
                <h2>About This Game</h2>
                <p>Respin Joker 81 is a classic fruit-themed slot machine featuring a joker wild symbol. This educational demo shows how slot machines work without using real money.</p>

                <h2>How Slot Machines Work</h2>
                <p>Slot machines use Random Number Generators (RNGs) to determine outcomes. Each spin is independent of previous spins, and the outcome is determined the moment you hit the spin button. The visual reels are merely an entertaining display of a predetermined result.</p>

                <h2>The Reality of RTP (Return to Player)</h2>
                <p>Slot machines advertise their RTP (Return to Player) percentage, typically between 88% and 96%. This is a theoretical figure calculated over millions of spins, meaning that for every $100 wagered, the machine will return $88-$96 on average. In the short term, results can vary dramatically, and most players won't play enough spins to experience the theoretical return.</p>

                <h2>Understanding the Volatility</h2>
                <p>The Respin Joker 81 slot is considered a medium volatility game. This means it offers a balance between frequency of wins and size of payouts. High volatility games pay out less frequently but with larger amounts, while low volatility games offer more frequent but smaller wins.</p>

                <h2>The Gambler's Fallacy</h2>
                <p>Many players believe that after a series of losses, a win is "due" or more likely to happen. This is known as the Gambler's Fallacy. In reality, each spin is independent, and the machine has no memory of previous outcomes. A machine that hasn't paid out in hours is no more likely to pay out on your next spin than one that just awarded a jackpot.</p>

                <h2>The House Edge</h2>
                <p>All gambling games, including slot machines, have a built-in mathematical advantage for the casino known as the "house edge." This ensures that over time, the casino will always profit. In slot machines, this edge is reflected in the RTP being less than 100%. The longer you play, the more likely you are to lose money.</p>
            </div>
        </div>
    );
};

export default RespinJoker81;