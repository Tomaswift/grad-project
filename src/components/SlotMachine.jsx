import { useState, useEffect, useRef } from 'react';
import './SlotMachine.css';

// Slot symbols with their respective values - adjusted to match Synot's Respin Joker 81
const SYMBOLS = [
    { id: 'joker', value: 'J', payout: 50, image: '/joker.png', isWild: true, isRespin: false },
    { id: 'respin', value: 'R', payout: 0, image: '/respin.png', isWild: false, isRespin: true },
    { id: 'star', value: 'S', payout: 20, image: '/star.png', isWild: false, isRespin: false },
    { id: 'bell', value: 'B', payout: 15, image: '/bell.png', isWild: false, isRespin: false },
    { id: 'watermelon', value: 'W', payout: 10, image: '/watermelon.png', isWild: false, isRespin: false },
    { id: 'grapes', value: 'G', payout: 8, image: '/grapes.png', isWild: false, isRespin: false },
    { id: 'plum', value: 'P', payout: 6, image: '/plum.png', isWild: false, isRespin: false },
    { id: 'orange', value: 'O', payout: 4, image: '/orange.png', isWild: false, isRespin: false },
    { id: 'lemon', value: 'L', payout: 3, image: '/lemon.png', isWild: false, isRespin: false },
    { id: 'cherry', value: 'C', payout: 2, image: '/cherry.png', isWild: false, isRespin: false },
];

// Symbol weights for each reel (to control frequency and RTP)
const REEL_WEIGHTS = [
    // Reel 1 (leftmost)
    [
        { symbol: 'joker', weight: 2 },
        { symbol: 'respin', weight: 5 },
        { symbol: 'star', weight: 4 },
        { symbol: 'bell', weight: 5 },
        { symbol: 'watermelon', weight: 6 },
        { symbol: 'grapes', weight: 7 },
        { symbol: 'plum', weight: 8 },
        { symbol: 'orange', weight: 9 },
        { symbol: 'lemon', weight: 10 },
        { symbol: 'cherry', weight: 12 },
    ],
    // Reel 2
    [
        { symbol: 'joker', weight: 2 },
        { symbol: 'respin', weight: 5 },
        { symbol: 'star', weight: 4 },
        { symbol: 'bell', weight: 5 },
        { symbol: 'watermelon', weight: 6 },
        { symbol: 'grapes', weight: 7 },
        { symbol: 'plum', weight: 8 },
        { symbol: 'orange', weight: 9 },
        { symbol: 'lemon', weight: 10 },
        { symbol: 'cherry', weight: 12 },
    ],
    // Reel 3
    [
        { symbol: 'joker', weight: 2 },
        { symbol: 'respin', weight: 5 },
        { symbol: 'star', weight: 4 },
        { symbol: 'bell', weight: 5 },
        { symbol: 'watermelon', weight: 6 },
        { symbol: 'grapes', weight: 7 },
        { symbol: 'plum', weight: 8 },
        { symbol: 'orange', weight: 9 },
        { symbol: 'lemon', weight: 10 },
        { symbol: 'cherry', weight: 12 },
    ],
    // Reel 4 (rightmost)
    [
        { symbol: 'joker', weight: 2 },
        { symbol: 'respin', weight: 5 },
        { symbol: 'star', weight: 4 },
        { symbol: 'bell', weight: 5 },
        { symbol: 'watermelon', weight: 6 },
        { symbol: 'grapes', weight: 7 },
        { symbol: 'plum', weight: 8 },
        { symbol: 'orange', weight: 9 },
        { symbol: 'lemon', weight: 10 },
        { symbol: 'cherry', weight: 12 },
    ],
];

// Paytable multipliers by symbol and number of matching symbols (3 or 4)
const PAYTABLE = {
    'joker': { 3: 5, 4: 50 },
    'star': { 3: 2, 4: 20 },
    'bell': { 3: 1.5, 4: 15 },
    'watermelon': { 3: 1, 4: 10 },
    'grapes': { 3: 0.8, 4: 8 },
    'plum': { 3: 0.6, 4: 6 },
    'orange': { 3: 0.4, 4: 4 },
    'lemon': { 3: 0.3, 4: 3 },
    'cherry': { 3: 0.2, 4: 2 },
};

// This simulates the 81 ways to win in a 3x4 grid
// In a "ways to win" game, we don't need to define specific paylines
// Instead, any combination of adjacent symbols from left to right counts as a win

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
    const [winningLines, setWinningLines] = useState([]);
    const [statistics, setStatistics] = useState({
        spins: 0,
        wins: 0,
        losses: 0,
        biggestWin: 0,
        totalWagered: 0,
        totalWon: 0,
        returnToPlayer: 0,
        respinCount: 0,
    });
    const [showStats, setShowStats] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [respinActive, setRespinActive] = useState(false);
    const [respinPositions, setRespinPositions] = useState([]);
    const [respinReels, setRespinReels] = useState([]);
    const [winHistory, setWinHistory] = useState([]);
    const audioRef = useRef(null);
    const spinSoundRef = useRef(null);
    const winSoundRef = useRef(null);
    const respinSoundRef = useRef(null);

    // Get weighted random symbol for the reels
    const getRandomSymbol = (reelIndex) => {
        const reelWeights = REEL_WEIGHTS[reelIndex];
        const totalWeight = reelWeights.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;

        for (const item of reelWeights) {
            random -= item.weight;
            if (random <= 0) {
                return SYMBOLS.find(s => s.id === item.symbol);
            }
        }
        return SYMBOLS[0]; // Default fallback
    };

    // Function to create a new set of reels
    const createNewReels = () => {
        return Array(4).fill(0).map((_, reelIndex) =>
            Array(3).fill(0).map(() => getRandomSymbol(reelIndex))
        );
    };

    // Function to check for winning combinations using the 81 ways mechanism
    const checkWinnings = (newReels) => {
        let totalWin = 0;
        let winningLines = [];
        let winningPositions = [];
        let respinFound = false;
        let respinPositionsFound = [];

        // Check all possible combinations (81 ways)
        // In "81 ways" each position on adjacent reels can form a winning combination

        // For each symbol position on the first reel
        for (let row1 = 0; row1 < 3; row1++) {
            const firstSymbol = newReels[0][row1];

            // Skip if the first symbol is a respin symbol (not part of a win)
            if (firstSymbol.isRespin) {
                respinFound = true;
                respinPositionsFound.push({reel: 0, row: row1});
                continue;
            }

            // Recursively check for winning paths starting from this position
            const checkPath = (currentReel, currentSymbol, path, positions) => {
                // If we've reached the end of the reels, evaluate the win
                if (currentReel >= newReels.length) {
                    // We need at least 3 matching symbols for a win
                    if (path.length >= 3) {
                        // Determine the base symbol for payout calculation
                        // If first symbol is wild (joker), use the second non-wild symbol as base
                        let baseSymbol = path[0];
                        let allWilds = true;

                        for (const sym of path) {
                            if (!sym.isWild) {
                                baseSymbol = sym;
                                allWilds = false;
                                break;
                            }
                        }

                        // All wilds is a special case - use joker paytable
                        if (allWilds) {
                            baseSymbol = SYMBOLS.find(s => s.id === 'joker');
                        }

                        // Calculate win based on the paytable
                        if (PAYTABLE[baseSymbol.id] && PAYTABLE[baseSymbol.id][path.length]) {
                            const lineWin = PAYTABLE[baseSymbol.id][path.length] * bet;
                            totalWin += lineWin;

                            winningLines.push({
                                symbols: path.map(s => s.id),
                                count: path.length,
                                win: lineWin
                            });

                            // Add these positions to winning positions for highlighting
                            winningPositions.push(...positions);
                        }
                    }
                    return;
                }

                // Check each position on the next reel
                for (let nextRow = 0; nextRow < 3; nextRow++) {
                    const nextSymbol = newReels[currentReel][nextRow];

                    // If we find a respin symbol, record it but don't count it in a win
                    if (nextSymbol.isRespin) {
                        respinFound = true;
                        respinPositionsFound.push({reel: currentReel, row: nextRow});
                        continue;
                    }

                    // If symbol matches or either is wild, extend the path
                    if (nextSymbol.id === currentSymbol.id ||
                        nextSymbol.isWild ||
                        currentSymbol.isWild) {

                        const newPath = [...path, nextSymbol];
                        const newPositions = [...positions, {reel: currentReel, row: nextRow}];

                        // Continue checking the next reel
                        checkPath(currentReel + 1, nextSymbol.isWild ? currentSymbol : nextSymbol, newPath, newPositions);
                    }
                }
            };

            // Start the path with the current first reel symbol
            checkPath(1, firstSymbol, [firstSymbol], [{reel: 0, row: row1}]);
        }

        return {
            totalWin,
            winningLines,
            winningPositions: winningPositions.map(pos => pos.reel * 3 + pos.row),
            respinFound,
            respinPositions: respinPositionsFound
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

    // Function to play the respin sound
    const playRespinSound = () => {
        if (!isMuted && respinSoundRef.current) {
            respinSoundRef.current.currentTime = 0;
            respinSoundRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
    };

    // Animation for spinning individual reels with delays
    const animateReels = async (reelsToSpin = [0, 1, 2, 3]) => {
        const reelElements = document.querySelectorAll('.reel');

        // Sequential reel spinning for specified reels
        for (let i of reelsToSpin) {
            // Add spinning class to current reel
            reelElements[i].classList.add('spinning');

            // Wait for a short delay before stopping the current reel
            await new Promise(resolve => setTimeout(resolve, 300 + i * 200));

            // Stop the current reel
            reelElements[i].classList.remove('spinning');
        }
    };

    // Function to handle respins
    const handleRespin = async () => {
        setRespinActive(true);
        playRespinSound();
        setMessage("RESPIN! Hold the other reels for a chance to win!");

        // Determine which reels need to be respun
        const reelsToRespin = Array.from(new Set(respinPositions.map(pos => pos.reel)));

        // Save the current state of the reels (both original and for respins)
        const newRespinReels = [...reels];

        // Generate new symbols only for the respun reels
        for (const reelIndex of reelsToRespin) {
            newRespinReels[reelIndex] = Array(3).fill(0).map(() => getRandomSymbol(reelIndex));
        }

        // Track both the original reels and respun reels separately
        setRespinReels(newRespinReels);
        setReels(newRespinReels);

        // Animate only the respun reels
        await animateReels(reelsToRespin);

        // Check for wins after respin
        const { totalWin, winningLines: newWinningLines, winningPositions, respinFound, respinPositions: newRespinPositions } = checkWinnings(newRespinReels);

        // Update winning lines state for display
        setWinningLines(newWinningLines);

        // Update statistics
        setStatistics(prev => ({
            ...prev,
            respinCount: prev.respinCount + 1
        }));

        // Handle wins from respin
        if (totalWin > 0) {
            setCredits(prevCredits => prevCredits + totalWin);
            setWinAmount(prevWinAmount => prevWinAmount + totalWin);
            setMessage(`Respin Win! Additional ${totalWin} credits on ${newWinningLines.length} line(s)!`);
            setWinningSymbols(winningPositions);
            setShowWinMessage(true);
            playWinSound();

            // Update win history
            setWinHistory(prev => [...prev.slice(-4), {
                time: new Date().toLocaleTimeString(),
                lines: newWinningLines,
                total: totalWin,
                isRespin: true
            }]);

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

                // Display the most valuable winning line info
                if (newWinningLines.length > 0) {
                    const bestWin = [...newWinningLines].sort((a, b) => b.win - a.win)[0];
                    const symbolNames = bestWin.symbols.map(id => {
                        const symbol = SYMBOLS.find(s => s.id === id);
                        return symbol ? symbol.value : id;
                    });
                    setMessage(`Best win: ${symbolNames.join(' → ')} - ${bestWin.win} credits!`);
                }
            }, 3000);
        } else {
            setMessage("No additional win from respin.");
        }

        // Check if we got more respins
        if (respinFound) {
            setRespinPositions(newRespinPositions);
            // Schedule another respin after a delay
            setTimeout(() => {
                handleRespin();
            }, 2000);
        } else {
            // End respin sequence
            setRespinActive(false);
            setRespinPositions([]);

            // After a delay, prompt for next spin
            setTimeout(() => {
                setMessage("Place your bet and spin!");
            }, 2000);
        }
    };

    // Function to spin the reels
    const spin = async () => {
        if (isSpinning || respinActive) return;
        if (credits < bet) {
            setMessage("Not enough credits to spin!");
            return;
        }

        // Reset any previous win state
        setWinningSymbols([]);
        setShowWinMessage(false);
        setRespinPositions([]);
        setWinningLines([]);

        // Play spin sound
        playSpinSound();

        // Update statistics
        setStatistics(prev => ({
            ...prev,
            spins: prev.spins + 1,
            totalWagered: prev.totalWagered + bet
        }));

        setCredits(prevCredits => prevCredits - bet);
        setWinAmount(0);
        setMessage("Spinning...");
        setIsSpinning(true);

        // Generate new random reels
        const newReels = createNewReels();

        // Set the reels with new symbols
        setReels(newReels);
        // Clear previous respin reels state
        setRespinReels([]);

        // Animate the reels
        await animateReels();

        // Check for wins after animation
        const { totalWin, winningLines: newWinningLines, winningPositions, respinFound, respinPositions: newRespinPositions } = checkWinnings(newReels);

        // Update winning lines state for display
        setWinningLines(newWinningLines);

        // Update game state with win results
        setIsSpinning(false);

        if (totalWin > 0) {
            setCredits(prevCredits => prevCredits + totalWin);
            setWinAmount(totalWin);
            setMessage(`You won ${totalWin} credits on ${newWinningLines.length} line(s)!`);
            setWinningSymbols(winningPositions);
            setShowWinMessage(true);
            playWinSound();

            // Update win history
            setWinHistory(prev => [...prev.slice(-4), {
                time: new Date().toLocaleTimeString(),
                lines: newWinningLines,
                total: totalWin,
                isRespin: false
            }]);

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

                // Display the most valuable winning line info
                if (newWinningLines.length > 0) {
                    const bestWin = [...newWinningLines].sort((a, b) => b.win - a.win)[0];
                    const symbolNames = bestWin.symbols.map(id => {
                        const symbol = SYMBOLS.find(s => s.id === id);
                        return symbol ? symbol.value : id;
                    });
                    setMessage(`Best win: ${symbolNames.join(' → ')} - ${bestWin.win} credits!`);
                }
            }, 3000);
        } else {
            setMessage("No win this time.");

            // Update statistics
            setStatistics(prev => ({
                ...prev,
                losses: prev.losses + 1,
                returnToPlayer: (prev.totalWon / prev.totalWagered) * 100
            }));
        }

        // Check if we got respin symbols
        if (respinFound) {
            setRespinPositions(newRespinPositions);
            // Initiate respin after a delay
            setTimeout(() => {
                handleRespin();
            }, 2000);
        }
    };

    // Function to handle bet changes
    const changeBet = (amount) => {
        if (isSpinning || respinActive) return;

        const newBet = Math.max(1, Math.min(100, bet + amount));
        setBet(newBet);
    };

    // Function to set max bet
    const setMaxBet = () => {
        if (isSpinning || respinActive) return;
        setBet(100); // Setting max bet to 100 for demo purposes
    };

    // Auto-play mode
    const [autoPlay, setAutoPlay] = useState(false);

    useEffect(() => {
        let autoPlayTimer;
        if (autoPlay && !isSpinning && !respinActive && credits >= bet) {
            autoPlayTimer = setTimeout(() => {
                spin();
            }, 1500);
        }

        return () => {
            clearTimeout(autoPlayTimer);
        };
    }, [autoPlay, isSpinning, respinActive, credits, bet]);

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

    // Helper function to determine if a symbol is a respin symbol currently in play
    const isActiveRespinSymbol = (reelIndex, symbolIndex) => {
        return respinPositions.some(pos => pos.reel === reelIndex && pos.row === symbolIndex);
    };

    // Helper function to display symbol names
    const getSymbolName = (symbolId) => {
        const symbolNames = {
            'joker': 'Joker',
            'respin': 'Respin',
            'star': 'Star',
            'bell': 'Bell',
            'watermelon': 'Watermelon',
            'grapes': 'Grapes',
            'plum': 'Plum',
            'orange': 'Orange',
            'lemon': 'Lemon',
            'cherry': 'Cherry',
        };
        return symbolNames[symbolId] || symbolId;
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

            <audio ref={respinSoundRef}>
                <source src="/respin-sound.mp3" type="audio/mp3" />
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

            {/* Game Message Display */}
            <div className="game-message">
                <p>{message}</p>
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
                                    className={`symbol ${isWinningSymbol(reelIndex, symbolIndex) ? 'winning' : ''} 
                                              ${isActiveRespinSymbol(reelIndex, symbolIndex) ? 'respin-active' : ''} 
                                              ${symbol.isRespin ? 'respin-symbol' : ''}`}
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
                <div className={`respin-message ${respinActive ? 'show' : ''}`}>
                    RESPIN!
                </div>
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
                        <button className="bet-button decrease" onClick={() => changeBet(-5)} disabled={isSpinning || respinActive}>-</button>
                        <div className="control-value">{bet.toFixed(2)}</div>
                        <button className="bet-button increase" onClick={() => changeBet(5)} disabled={isSpinning || respinActive}>+</button>
                    </div>
                </div>

                <div className="win-display">
                    <div className="control-label">WIN IN CZK</div>
                    <div className="control-value">{winAmount > 0 ? winAmount.toFixed(2) : ''}</div>
                </div>

                <button
                    className="max-bet-button"
                    onClick={setMaxBet}
                    disabled={isSpinning || respinActive}
                >
                    MAX BET
                </button>

                <button
                    className="spin-button"
                    onClick={spin}
                    disabled={isSpinning || respinActive || credits < bet}
                >
                    <div className="spin-icon"></div>
                </button>

                <button
                    className={`auto-spin-button ${autoPlay ? 'active' : ''}`}
                    onClick={() => setAutoPlay(!autoPlay)}
                    disabled={respinActive || credits < bet}
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
                            starting from the leftmost reel. The Joker is wild and substitutes for any symbol except Respin.
                        </p>
                        <p>
                            When a Respin symbol appears, it holds all other reels in place and respins itself.
                            This gives additional chances to win without placing a new bet.
                        </p>
                    </div>

                    <div className="edu-section">
                        <h4>The Math Behind Slots</h4>
                        <p>
                            Every spin uses a Random Number Generator (RNG) to determine outcomes.
                            The theoretical Return to Player (RTP) for this type of game is typically
                            between 95-96%, meaning that for every 100 CZK wagered, the machine is
                            designed to pay back 95-96 CZK on average over millions of spins.
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
                                <p>Respins</p>
                                <h4>{statistics.respinCount}</h4>
                            </div>
                            <div className="stat-item">
                                <p>Win Rate</p>
                                <h4>{statistics.spins > 0 ? (statistics.wins / statistics.spins * 100).toFixed(1) : 0}%</h4>
                            </div>
                        </div>
                    </div>

                    {/* Latest Win Details (uses winningLines) */}
                    {winningLines && winningLines.length > 0 && (
                        <div className="edu-section">
                            <h4>Latest Win Details</h4>
                            <ul className="win-breakdown">
                                {winningLines.map((line, index) => (
                                    <li key={index}>
                                        Combination #{index+1}: {line.symbols.map(id => getSymbolName(id)).join(' → ')} - {line.win.toFixed(2)} credits
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Win History Section */}
                    {winHistory.length > 0 && (
                        <div className="edu-section">
                            <h4>Recent Win History</h4>
                            <div className="win-history">
                                {winHistory.map((win, index) => (
                                    <div key={index} className="win-history-item">
                                        <div className="win-history-header">
                                            <span>{win.time}</span>
                                            <span className={win.isRespin ? 'respin-win' : ''}>
                                                {win.isRespin ? 'RESPIN' : 'SPIN'} - {win.total.toFixed(2)} credits
                                            </span>
                                        </div>
                                        <div className="win-history-details">
                                            {win.lines.length} winning combination{win.lines.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="edu-section">
                        <h4>Symbol Paytable (Multipliers of Your Bet)</h4>
                        <div className="paytable-grid">
                            <div className="paytable-item">
                                <img src="/joker.png" alt="Joker" className="paytable-symbol" />
                                <div>
                                    <p>3x: 5x bet</p>
                                    <p>4x: 50x bet</p>
                                </div>
                            </div>
                            <div className="paytable-item">
                                <img src="/star.png" alt="Star" className="paytable-symbol" />
                                <div>
                                    <p>3x: 2x bet</p>
                                    <p>4x: 20x bet</p>
                                </div>
                            </div>
                            <div className="paytable-item">
                                <img src="/bell.png" alt="Bell" className="paytable-symbol" />
                                <div>
                                    <p>3x: 1.5x bet</p>
                                    <p>4x: 15x bet</p>
                                </div>
                            </div>
                            <div className="paytable-item">
                                <img src="/watermelon.png" alt="Watermelon" className="paytable-symbol" />
                                <div>
                                    <p>3x: 1x bet</p>
                                    <p>4x: 10x bet</p>
                                </div>
                            </div>
                        </div>

                        <div className="paytable-grid">
                            <div className="paytable-item">
                                <img src="/grapes.png" alt="Grapes" className="paytable-symbol" />
                                <div>
                                    <p>3x: 0.8x bet</p>
                                    <p>4x: 8x bet</p>
                                </div>
                            </div>
                            <div className="paytable-item">
                                <img src="/plum.png" alt="Plum" className="paytable-symbol" />
                                <div>
                                    <p>3x: 0.6x bet</p>
                                    <p>4x: 6x bet</p>
                                </div>
                            </div>
                            <div className="paytable-item">
                                <img src="/orange.png" alt="Orange" className="paytable-symbol" />
                                <div>
                                    <p>3x: 0.4x bet</p>
                                    <p>4x: 4x bet</p>
                                </div>
                            </div>
                            <div className="paytable-item">
                                <img src="/lemon.png" alt="Lemon" className="paytable-symbol" />
                                <div>
                                    <p>3x: 0.3x bet</p>
                                    <p>4x: 3x bet</p>
                                </div>
                            </div>
                        </div>

                        <div className="paytable-note">
                            <p>Joker is WILD and substitutes for any symbol except Respin.</p>
                            <p>Respin symbol triggers a respin on its reel while holding others in place.</p>
                            <p>Wins are formed by matching symbols on adjacent reels from left to right.</p>
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