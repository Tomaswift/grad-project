import { useState, useEffect, useRef } from 'react';
import './SlotMachine.css';

// Updated symbols with correct payout values according to the images
const SYMBOLS = [
    { id: 'joker', value: 'J', payout: 0, image: '/joker.png', isWild: true },
    { id: 'bell', value: 'B', payout: 10, image: '/bell.png' },
    { id: 'watermelon', value: 'W', payout: 6, image: '/watermelon.png' },
    { id: 'grapes', value: 'G', payout: 6, image: '/grapes.png' },
    { id: 'plum', value: 'P', payout: 4, image: '/plum.png' },
    { id: 'orange', value: 'O', payout: 4, image: '/orange.png' },
    { id: 'lemon', value: 'L', payout: 2, image: '/lemon.png' },
    { id: 'cherry', value: 'C', payout: 2, image: '/cherry.png' },
];

// Define symbol weights for realistic RNG (based on typical slot machine distributions)
const SYMBOL_WEIGHTS = {
    'joker': 5,    // Rare
    'bell': 10,
    'watermelon': 15,
    'grapes': 15,
    'plum': 20,
    'orange': 20,
    'lemon': 25,
    'cherry': 25,  // Common
};

// Structure to define all 81 ways to win
// In a real "81 ways" slot, wins count matching symbols on adjacent reels
// (3^4 = 81 possible combinations across 4 reels with 3 rows)
const generateWayWins = () => {
    // This generates all possible positions on each reel for ways wins
    const wayWins = [];

    // For a "ways" slot, we consider all possible symbol positions
    // The 81 comes from 3^4 (3 possible positions on each of the 4 reels)
    return wayWins;
};

const SlotMachine = () => {
    const [reels, setReels] = useState([
        [SYMBOLS[2], SYMBOLS[7], SYMBOLS[4]], // First reel (leftmost)
        [SYMBOLS[7], SYMBOLS[0], SYMBOLS[0]], // Second reel
        [SYMBOLS[6], SYMBOLS[5], SYMBOLS[7]], // Third reel
        [SYMBOLS[4], SYMBOLS[4], SYMBOLS[4]], // Fourth reel (rightmost)
    ]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [credits, setCredits] = useState(137000);
    const [bet, setBet] = useState(10);
    const [winAmount, setWinAmount] = useState(0);
    const [message, setMessage] = useState('Place your bet and spin!');
    const [winningSymbols, setWinningSymbols] = useState([]);
    const [showWinMessage, setShowWinMessage] = useState(false);
    const [statistics, setStatistics] = useState({
        spins: 0,
        wins: 0,
        losses: 0,
        biggestWin: 0,
        totalWagered: 0,
        totalWon: 0,
        returnToPlayer: 0,
    });
    const [showStats, setShowStats] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [stickyWildColumns, setStickyWildColumns] = useState([]);
    const [respinMode, setRespinMode] = useState(false);
    const audioRef = useRef(null);
    const spinSoundRef = useRef(null);
    const winSoundRef = useRef(null);

    // Get weighted random symbol
    const getRandomSymbol = () => {
        let totalWeight = 0;
        Object.keys(SYMBOL_WEIGHTS).forEach(key => {
            totalWeight += SYMBOL_WEIGHTS[key];
        });

        const random = Math.random() * totalWeight;
        let weightSum = 0;

        for (const key of Object.keys(SYMBOL_WEIGHTS)) {
            weightSum += SYMBOL_WEIGHTS[key];
            if (random <= weightSum) {
                return SYMBOLS.find(symbol => symbol.id === key);
            }
        }

        return SYMBOLS[7]; // Fallback to cherry
    };

    // Function to check for winning combinations using the "ways" mechanic
    const checkWinnings = (newReels) => {
        let totalWin = 0;
        let winningLines = [];
        let winningPositions = [];
        let hasJoker = false;
        let jokerColumns = [];

        // Check each possible starting symbol on the first reel
        for (let startRow = 0; startRow < 3; startRow++) {
            const startSymbol = newReels[0][startRow];

            // Track matched positions as potential winning ways
            // For each starting position on reel 1, we'll track all matching paths
            let matchedPaths = [{
                positions: [startRow],
                symbol: startSymbol.id === 'joker' ? null : startSymbol.id
            }];

            // If we start with a joker, we need to track that specially
            if (startSymbol.id === 'joker') {
                hasJoker = true;
                if (!jokerColumns.includes(0)) {
                    jokerColumns.push(0);
                }
                matchedPaths[0].isWild = true;
            }

            // For each subsequent reel, extend all current paths
            for (let reel = 1; reel < 4; reel++) {
                const nextPaths = [];

                // For each current path, try to extend with symbols on the next reel
                for (const path of matchedPaths) {
                    const targetSymbol = path.symbol; // The symbol we're trying to match

                    // Try each position on the current reel
                    for (let row = 0; row < 3; row++) {
                        const currentSymbol = newReels[reel][row];

                        // Check if this symbol matches our path (or is wild, or path started with wild)
                        if (currentSymbol.id === 'joker' ||
                            currentSymbol.id === targetSymbol ||
                            targetSymbol === null) {

                            // Create a new path extending the current one
                            const newPath = {
                                positions: [...path.positions, row],
                                symbol: targetSymbol === null && currentSymbol.id !== 'joker'
                                    ? currentSymbol.id
                                    : targetSymbol,
                                isWild: path.isWild || currentSymbol.id === 'joker'
                            };

                            // If we found a joker on this reel
                            if (currentSymbol.id === 'joker') {
                                hasJoker = true;
                                if (!jokerColumns.includes(reel)) {
                                    jokerColumns.push(reel);
                                }
                            }

                            nextPaths.push(newPath);
                        }
                    }
                }

                // If no extensions were possible, this way can't win
                if (nextPaths.length === 0) {
                    break;
                }

                matchedPaths = nextPaths;
            }

            // Check if any of our paths made it all the way across (minimum 3 reels for a win)
            for (const path of matchedPaths) {
                if (path.positions.length >= 3 && path.symbol !== null) {
                    // We have a win!
                    const symbolObj = SYMBOLS.find(s => s.id === path.symbol);
                    if (!symbolObj) continue;

                    // Calculate payout based on the number of symbols and the symbol's value
                    // The paytable from the images shows different multipliers for 3 or 4 matches
                    const numSymbols = path.positions.length;
                    let multiplier = 0;

                    // Set multiplier based on paytable values from image 6
                    if (path.symbol === 'bell') {
                        multiplier = numSymbols === 3 ? 5 : 10;
                    } else if (path.symbol === 'watermelon' || path.symbol === 'grapes') {
                        multiplier = numSymbols === 3 ? 3 : 6;
                    } else if (path.symbol === 'plum' || path.symbol === 'orange') {
                        multiplier = numSymbols === 3 ? 2 : 4;
                    } else if (path.symbol === 'lemon' || path.symbol === 'cherry') {
                        multiplier = numSymbols === 3 ? 1 : 2;
                    }

                    const win = bet * multiplier;

                    // If we have a win, add it to our totals
                    if (win > 0) {
                        totalWin += win;

                        // Add winning positions to highlight
                        for (let i = 0; i < path.positions.length; i++) {
                            const posIndex = i * 3 + path.positions[i];
                            winningPositions.push(posIndex);
                        }

                        winningLines.push({
                            symbols: path.symbol,
                            count: path.positions.length,
                            win: win
                        });
                    }
                }
            }
        }

        return {
            totalWin,
            winningLines,
            winningPositions,
            hasJoker,
            jokerColumns
        };
    };

    // Function to play the spin sound
    const playSpinSound = () => {
        if (!isMuted && spinSoundRef.current) {
            spinSoundRef.current.currentTime = 0;
            spinSoundRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
    };

    // Function to play the win sound
    const playWinSound = () => {
        if (!isMuted && winSoundRef.current) {
            winSoundRef.current.currentTime = 0;
            winSoundRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
    };

    // Animation for spinning individual reels with delays
    const animateReels = async (columnsToSpin) => {
        const reelElements = document.querySelectorAll('.reel');

        // Add spinning class to the reels we're spinning
        for (let i = 0; i < reelElements.length; i++) {
            if (columnsToSpin.includes(i)) {
                reelElements[i].classList.add('spinning');
            }
        }

        // Sequential reel stopping
        for (let i = 0; i < reelElements.length; i++) {
            if (columnsToSpin.includes(i)) {
                // Wait for a short delay before stopping the current reel
                await new Promise(resolve => setTimeout(resolve, 300 + i * 200));
                // Stop the current reel
                reelElements[i].classList.remove('spinning');
            }
        }
    };

    // Function to spin the reels
    const spin = async (columnsToSpin = [0, 1, 2, 3]) => {
        if (isSpinning) return;

        const isRespin = columnsToSpin.length < 4;

        // Force reset respin mode if we're doing a full spin
        if (!isRespin) {
            setStickyWildColumns([]);
            setRespinMode(false);
        }

        if (!isRespin && credits < bet) {
            setMessage("Not enough credits to spin!");
            return;
        }

        // Reset any previous win state
        setWinningSymbols([]);
        setShowWinMessage(false);

        // Play spin sound
        playSpinSound();

        // Update statistics (only on main spins, not respins)
        if (!isRespin) {
            setStatistics(prev => ({
                ...prev,
                spins: prev.spins + 1,
                totalWagered: prev.totalWagered + bet
            }));

            // Deduct bet only on main spins
            setCredits(prevCredits => prevCredits - bet);
        }

        setWinAmount(0);
        setMessage("Spinning...");
        setIsSpinning(true);

        // Generate new random reels, but keep sticky wilds in place
        const newReels = [...reels];

        // For each reel that is spinning, generate new symbols
        for (let col of columnsToSpin) {
            for (let row = 0; row < 3; row++) {
                // Only change if it's not a sticky wild in respin mode
                if (!isRespin || !stickyWildColumns.includes(col)) {
                    newReels[col][row] = getRandomSymbol();
                }
            }
        }

        // Set the reels with new symbols
        setReels(newReels);

        // Animate the reels
        await animateReels(columnsToSpin);

        // Check for wins after animation
        const { totalWin, winningLines, winningPositions, hasJoker, jokerColumns } = checkWinnings(newReels);

        // Update winning positions for highlighting
        setWinningSymbols(winningPositions);

        // Determine if we need a respin
        let needsRespin = false;

        // If we have jokers and we're not already in a respin
        if (hasJoker && !isRespin) {
            needsRespin = true;
            setStickyWildColumns(jokerColumns);
            setRespinMode(true);
        } else if (isRespin) {
            // If this was a respin, check if we need another one
            if (hasJoker && jokerColumns.some(col => !stickyWildColumns.includes(col))) {
                // Found new jokers, update sticky columns
                const newStickyColumns = [...new Set([...stickyWildColumns, ...jokerColumns])];
                setStickyWildColumns(newStickyColumns);
                needsRespin = true;
            } else if (!hasJoker || jokerColumns.every(col => stickyWildColumns.includes(col))) {
                // No new jokers, prepare to end respin mode
                // We'll fully reset in the block below to ensure proper state management
                needsRespin = false;
            }
        }

        // Update game state with win results
        setIsSpinning(false);
        setWinAmount(totalWin);

        if (totalWin > 0) {
            setCredits(prevCredits => prevCredits + totalWin);
            setMessage(`You won ${totalWin} credits on ${winningLines.length} line(s)!`);
            setShowWinMessage(true);
            playWinSound();

            // Update statistics
            setStatistics(prev => ({
                ...prev,
                wins: prev.wins + 1,
                biggestWin: Math.max(prev.biggestWin, totalWin),
                totalWon: prev.totalWon + totalWin,
                returnToPlayer: ((prev.totalWon + totalWin) / (prev.totalWagered)) * 100
            }));

            // Hide win message after a delay
            setTimeout(() => {
                setShowWinMessage(false);
            }, 3000);
        } else {
            setMessage(isRespin ? "No additional win on respin." : "No win this time. Try again!");

            // Update statistics (only on main spins)
            if (!isRespin) {
                setStatistics(prev => ({
                    ...prev,
                    losses: prev.losses + 1,
                    returnToPlayer: (prev.totalWon / prev.totalWagered) * 100
                }));
            }
        }

        // Automatically trigger respin if needed
        if (needsRespin) {
            // Create an array of columns to spin (all except those with sticky wilds)
            const columnsToRespin = [0, 1, 2, 3].filter(col => !stickyWildColumns.includes(col));

            setMessage("Respin triggered by Joker! Wild symbols remain in place.");

            // Short delay before respin
            setTimeout(() => {
                spin(columnsToRespin);
            }, 1500);
        } else if (isRespin) {
            // This was the final respin in the sequence, properly reset respin mode
            setStickyWildColumns([]);
            setRespinMode(false);
            setMessage("Respin complete. Spin again to continue.");
        }
    };

    // Function to handle bet changes
    const changeBet = (amount) => {
        if (isSpinning) return;

        const newBet = Math.max(1, Math.min(500, bet + amount)); // Max bet from the game rules is 500 CZK
        setBet(newBet);
    };

    // Function to set max bet
    const setMaxBet = () => {
        if (isSpinning) return;
        setBet(Math.min(500, credits)); // Max bet is 500 according to the rules
    };

    // Auto-play mode
    const [autoPlay, setAutoPlay] = useState(false);

    useEffect(() => {
        let autoPlayTimer;
        if (autoPlay && !isSpinning && credits >= bet) {
            autoPlayTimer = setTimeout(() => {
                spin();
            }, 1500);
        }

        return () => {
            clearTimeout(autoPlayTimer);
        };
    }, [autoPlay, isSpinning, credits, bet]);

    // Music control
    useEffect(() => {
        const audio = audioRef.current;
        if (!isMuted && audio) {
            audio.volume = 0.3; // Lower volume
            audio.play().catch(e => console.log("Audio play failed:", e));
        }
        return () => {
            if (audio) {
                audio.pause();
            }
        };
    }, [isMuted]);

    // Add/reset credits function (for demo purposes)
    const resetCredits = () => {
        setCredits(137000);
        setMessage("Credits reset to 137000");
    };

    // Helper function to determine if a symbol is in a winning position
    const isWinningSymbol = (reelIndex, symbolIndex) => {
        const position = reelIndex * 3 + symbolIndex;
        return winningSymbols.includes(position);
    };

    // Helper function to determine if a symbol is a sticky wild
    const isStickyWild = (reelIndex, symbolIndex) => {
        if (!respinMode) return false;

        return stickyWildColumns.includes(reelIndex) &&
            reels[reelIndex][symbolIndex].id === 'joker';
    };

    return (
        <div className="slot-machine-container">
            <audio ref={audioRef} loop>
                <source src="/background-music.mp3" type="audio/mp3" />
            </audio>

            <audio ref={spinSoundRef}>
                <source src="/spin-sound.mp3" type="audio/mp3" />
            </audio>

            <audio ref={winSoundRef}>
                <source src="/win-sound.mp3" type="audio/mp3" />
            </audio>

            {/* Jackpot Display */}
            <div className="slot-header">
                <div className="jackpot-display">
                    <div className="jackpot blue">
                        <span className="jackpot-text">192 222.4</span>
                    </div>
                    <div className="jackpot gold">
                        <span className="jackpot-text">75 996.5</span>
                    </div>
                    <div className="jackpot silver">
                        <span className="jackpot-text">3 595.5</span>
                    </div>
                    <div className="jackpot bronze">
                        <span className="jackpot-text">1 234.5</span>
                    </div>
                </div>
            </div>

            {/* Game Title */}
            <div className="game-title">
                <h2>RESPIN JOKER 81</h2>
            </div>

            {/* Slot Machine Frame */}
            <div className="slot-frame">
                {/* Side Labels */}
                <div className="side-label left">
                    <div className="paylines-number">81</div>
                    <div className="paylines-text">W A Y S</div>
                </div>

                {/* Reels */}
                <div className="slot-reels">
                    {reels.map((reel, reelIndex) => (
                        <div key={reelIndex} className="reel">
                            {reel.map((symbol, symbolIndex) => (
                                <div
                                    key={`${reelIndex}-${symbolIndex}`}
                                    className={`symbol ${isWinningSymbol(reelIndex, symbolIndex) ? 'winning' : ''} ${isStickyWild(reelIndex, symbolIndex) ? 'sticky-wild' : ''}`}
                                >
                                    <img src={symbol.image} alt={symbol.value} className="symbol-img" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Side Labels */}
                <div className="side-label right">
                    <div className="paylines-number">81</div>
                    <div className="paylines-text">W A Y S</div>
                </div>

                {/* Win Message */}
                <div className={`win-message ${showWinMessage ? 'show' : ''}`}>
                    WIN! {winAmount} CREDITS
                </div>

                {/* Respin Message */}
                {respinMode && (
                    <div className="respin-message show">
                        JOKER RESPIN ACTIVE
                    </div>
                )}
            </div>

            {/* Controls Panel */}
            <div className="controls-panel">
                <div className="balance-display">
                    <div className="control-label">BALANCE IN CZK</div>
                    <div className="control-value">{credits.toFixed(2)}</div>
                </div>

                <div className="bet-controls">
                    <div className="control-label">BET IN CZK</div>
                    <div className="bet-control-group">
                        <button
                            className="bet-button decrease"
                            onClick={() => changeBet(-5)}
                            disabled={isSpinning || respinMode}
                        >-</button>
                        <div className="control-value">{bet.toFixed(2)}</div>
                        <button
                            className="bet-button increase"
                            onClick={() => changeBet(5)}
                            disabled={isSpinning || respinMode}
                        >+</button>
                    </div>
                </div>

                <div className="win-display">
                    <div className="control-label">WIN IN CZK</div>
                    <div className="control-value">{winAmount > 0 ? winAmount.toFixed(2) : ''}</div>
                </div>

                <button
                    className="max-bet-button"
                    onClick={setMaxBet}
                    disabled={isSpinning}
                >
                    MAX BET
                </button>

                <button
                    className="spin-button"
                    onClick={() => spin()}
                    disabled={isSpinning || credits < bet}
                >
                    <div className="spin-icon"></div>
                </button>

                <button
                    className="auto-spin-button"
                    onClick={() => setAutoPlay(!autoPlay)}
                    disabled={credits < bet || isSpinning}
                >
                    <div className="auto-spin-icon"></div>
                </button>

                <button
                    className="sound-button"
                    onClick={() => setIsMuted(!isMuted)}
                >
                    <div className={`sound-icon ${isMuted ? 'muted' : ''}`}></div>
                </button>
            </div>

            {/* Educational Info Toggle */}
            <div className="educational-toggle">
                <button onClick={() => setShowStats(!showStats)}>
                    {showStats ? 'Hide Educational Info' : 'Show Educational Info'}
                </button>
            </div>

            {/* Educational Information */}
            {showStats && (
                <div className="educational-panel">
                    <h3>Understanding Slot Machines</h3>

                    <div className="edu-section">
                        <h4>How This Machine Works</h4>
                        <p>
                            Respin Joker 81 is a fruit-themed slot with 4 reels and 3 rows, offering 81 ways to win.
                            Unlike traditional paylines, wins are calculated by matching symbols on adjacent reels
                            starting from the leftmost reel.
                        </p>
                        <p>
                            The Joker symbol is wild and triggers the Sticky Wild Respin feature. When a Joker appears
                            and is part of a winning combination, it remains in place for free respins until no new
                            Jokers appear.
                        </p>
                    </div>

                    <div className="edu-section">
                        <h4>The Math Behind Slots</h4>
                        <p>
                            Every spin uses a Random Number Generator (RNG) to determine outcomes.
                            The theoretical Return to Player (RTP) for this type of game is typically
                            between 88.03-98.05% (as stated in the rules), meaning that for every 100 CZK wagered,
                            the machine is designed to pay back 88-98 CZK on average over millions of spins.
                        </p>
                        <p>
                            Your current RTP: {statistics.returnToPlayer.toFixed(2)}% after {statistics.spins} spins
                        </p>
                    </div>

                    <div className="edu-section">
                        <h4>Statistics from Your Play</h4>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <p>Spins</p>
                                <h4>{statistics.spins}</h4>
                            </div>
                            <div className="stat-item">
                                <p>Wins</p>
                                <h4>{statistics.wins}</h4>
                            </div>
                            <div className="stat-item">
                                <p>Losses</p>
                                <h4>{statistics.losses}</h4>
                            </div>
                            <div className="stat-item">
                                <p>Win Rate</p>
                                <h4>{statistics.spins > 0 ? (statistics.wins / statistics.spins * 100).toFixed(1) : 0}%</h4>
                            </div>
                        </div>
                    </div>

                    <div className="edu-disclaimer">
                        <p>
                            This is an educational demonstration only. No real money is involved.
                            The purpose is to show how slot machines work and the mathematical principles behind gambling.
                        </p>
                    </div>
                </div>
            )}

            <div className="credits-reset">
                <button onClick={resetCredits}>Reset Credits</button>
            </div>
        </div>
    );
};

export default SlotMachine;