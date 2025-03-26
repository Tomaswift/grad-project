import { useState, useEffect, useRef } from 'react';
import './SlotMachine.css';

// Slot symbols with their respective values
const SYMBOLS = [
    { id: 'joker', value: 'J', payout: 10, image: '/joker.png' },
    { id: 'bell', value: 'B', payout: 8, image: '/bell.png' },
    { id: 'watermelon', value: 'W', payout: 5, image: '/watermelon.png' },
    { id: 'grapes', value: 'G', payout: 4, image: '/grapes.png' },
    { id: 'plum', value: 'P', payout: 3, image: '/plum.png' },
    { id: 'orange', value: 'O', payout: 2, image: '/orange.png' },
    { id: 'lemon', value: 'L', payout: 2, image: '/lemon.png' },
    { id: 'cherry', value: 'C', payout: 1, image: '/cherry.png' },
];

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
    const [stickyJokers, setStickyJokers] = useState([]);
    const [respin, setRespin] = useState(false);
    const [respinsRemaining, setRespinsRemaining] = useState(0);
    const audioRef = useRef(null);
    const spinSoundRef = useRef(null);
    const winSoundRef = useRef(null);

    // Get random symbol for the reels
    const getRandomSymbol = () => {
        return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    };

    // Function to check for winning combinations
    const checkWinnings = (newReels) => {
        let totalWin = 0;
        let winningLines = [];
        let winningPositions = [];
        
        // For each symbol type, check if it appears on consecutive reels
        SYMBOLS.forEach(symbolToCheck => {
            // For each possible starting position on the first reel
            for (let firstReelPos = 0; firstReelPos < 3; firstReelPos++) {
                // Skip if this position doesn't have our symbol or a joker
                if (newReels[0][firstReelPos].id !== symbolToCheck.id && 
                    newReels[0][firstReelPos].id !== 'joker') {
                    continue;
                }
                
                // Track positions that are part of this win
                let currentWinPositions = [firstReelPos];
                
                // Track matching symbols per reel (for 81 ways calculation)
                let matchingPositions = [
                    [firstReelPos], // Positions on first reel
                    [], // Will store positions on second reel
                    [], // Will store positions on third reel
                    []  // Will store positions on fourth reel
                ];
                
                // Check second reel
                for (let secondReelPos = 0; secondReelPos < 3; secondReelPos++) {
                    if (newReels[1][secondReelPos].id === symbolToCheck.id || 
                        newReels[1][secondReelPos].id === 'joker') {
                        matchingPositions[1].push(secondReelPos);
                    }
                }
                
                // If no matches on second reel, skip
                if (matchingPositions[1].length === 0) continue;
                
                // Check third reel
                for (let thirdReelPos = 0; thirdReelPos < 3; thirdReelPos++) {
                    if (newReels[2][thirdReelPos].id === symbolToCheck.id || 
                        newReels[2][thirdReelPos].id === 'joker') {
                        matchingPositions[2].push(thirdReelPos);
                    }
                }
                
                // If no matches on third reel, we still have a 3-of-a-kind
                // Calculate win for 3 matching symbols if there are matches on reel 1 and 2
                if (matchingPositions[2].length === 0 && matchingPositions[1].length > 0) {
                    // We have a 3-of-a-kind
                    const winningWays = matchingPositions[1].length;
                    const baseSymbol = newReels[0][firstReelPos].id === 'joker' ? 
                        symbolToCheck : newReels[0][firstReelPos];
                    const lineWin = baseSymbol.payout * bet * 1; // 3-of-a-kind multiplier
                    
                    totalWin += lineWin * winningWays;
                    
                    // Add each way as a winning line for visualization
                    for (let way = 0; way < winningWays; way++) {
                        winningLines.push({
                            line: winningLines.length + 1,
                            symbols: 3,
                            win: lineWin
                        });
                        
                        // Add positions to highlight
                        const posFirstReel = firstReelPos;
                        const posSecondReel = matchingPositions[1][way % matchingPositions[1].length];
                        
                        winningPositions.push(posFirstReel);
                        winningPositions.push(3 + posSecondReel);
                    }
                    
                    continue; // Skip to next starting position
                }
                
                // Check fourth reel
                for (let fourthReelPos = 0; fourthReelPos < 3; fourthReelPos++) {
                    if (newReels[3][fourthReelPos].id === symbolToCheck.id || 
                        newReels[3][fourthReelPos].id === 'joker') {
                        matchingPositions[3].push(fourthReelPos);
                    }
                }
                
                // Calculate wins based on how many reels have matches
                if (matchingPositions[3].length > 0) {
                    // 5-of-a-kind: calculate total ways
                    const winningWays = 
                        matchingPositions[1].length * 
                        matchingPositions[2].length * 
                        matchingPositions[3].length;
                    
                    const baseSymbol = newReels[0][firstReelPos].id === 'joker' && 
                        matchingPositions[1].length > 0 && 
                        newReels[1][matchingPositions[1][0]].id !== 'joker' ? 
                        newReels[1][matchingPositions[1][0]] : newReels[0][firstReelPos];
                    
                    const lineWin = baseSymbol.payout * bet * 3; // 5-of-a-kind multiplier
                    
                    totalWin += lineWin * winningWays;
                    
                    // Store winning positions for all ways (just storing one representative path)
                    if (winningWays > 0) {
                        winningPositions.push(firstReelPos);
                        winningPositions.push(3 + matchingPositions[1][0]);
                        winningPositions.push(6 + matchingPositions[2][0]);
                        winningPositions.push(9 + matchingPositions[3][0]);
                        
                        winningLines.push({
                            line: winningLines.length + 1,
                            symbols: 4,
                            win: lineWin * winningWays,
                            ways: winningWays
                        });
                    }
                } 
                else if (matchingPositions[2].length > 0) {
                    // 4-of-a-kind: calculate total ways
                    const winningWays = matchingPositions[1].length * matchingPositions[2].length;
                    
                    const baseSymbol = newReels[0][firstReelPos].id === 'joker' && 
                        matchingPositions[1].length > 0 && 
                        newReels[1][matchingPositions[1][0]].id !== 'joker' ? 
                        newReels[1][matchingPositions[1][0]] : newReels[0][firstReelPos];
                    
                    const lineWin = baseSymbol.payout * bet * 2; // 4-of-a-kind multiplier
                    
                    totalWin += lineWin * winningWays;
                    
                    // Store winning positions for all ways
                    if (winningWays > 0) {
                        winningPositions.push(firstReelPos);
                        winningPositions.push(3 + matchingPositions[1][0]);
                        winningPositions.push(6 + matchingPositions[2][0]);
                        
                        winningLines.push({
                            line: winningLines.length + 1,
                            symbols: 3,
                            win: lineWin * winningWays,
                            ways: winningWays
                        });
                    }
                }
            }
        });
        
        return { totalWin, winningLines, winningPositions };
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
    const animateReels = async () => {
        const reelElements = document.querySelectorAll('.reel');

        // Sequential reel spinning
        for (let i = 0; i < reelElements.length; i++) {
            // Add spinning class to current reel
            reelElements[i].classList.add('spinning');

            // Wait for a short delay before stopping the current reel
            await new Promise(resolve => setTimeout(resolve, 300 + i * 200));

            // Stop the current reel
            reelElements[i].classList.remove('spinning');
        }
    };

    // Function to spin the reels
    const spin = async () => {
        if (isSpinning) return;
        if (credits < bet && !respin) {
            setMessage("Not enough credits to spin!");
            return;
        }

        // Reset any previous win state
        setWinningSymbols([]);
        setShowWinMessage(false);

        // Play spin sound
        playSpinSound();

        // Update statistics (only if this is not a respin)
        if (!respin) {
            setStatistics(prev => ({
                ...prev,
                spins: prev.spins + 1,
                totalWagered: prev.totalWagered + bet
            }));
            setCredits(prevCredits => prevCredits - bet);
        }

        setWinAmount(0);
        setMessage(respin ? "Respinning..." : "Spinning...");
        setIsSpinning(true);

        // Generate new random reels, keeping sticky Jokers in place
        const newReels = Array(4).fill(0).map((_, reelIndex) =>
            Array(3).fill(0).map((_, symbolIndex) => {
                // Check if this position has a sticky Joker
                const position = reelIndex * 3 + symbolIndex;
                if (stickyJokers.includes(position)) {
                    return SYMBOLS.find(s => s.id === 'joker');
                }
                return getRandomSymbol();
            })
        );

        // Set the reels with new symbols
        setReels(newReels);

        // Animate the reels
        await animateReels();

        // Check for wins after animation
        const { totalWin, winningLines, winningPositions } = checkWinnings(newReels);

        // Update game state with win results
        setIsSpinning(false);
        setWinAmount(totalWin);

        // Check for new Jokers to make sticky
        const newJokerPositions = [];
        newReels.forEach((reel, reelIndex) => {
            reel.forEach((symbol, symbolIndex) => {
                if (symbol.id === 'joker') {
                    const position = reelIndex * 3 + symbolIndex;
                    if (!stickyJokers.includes(position)) {
                        newJokerPositions.push(position);
                    }
                }
            });
        });

        if (newJokerPositions.length > 0 && !respin) {
            // New Jokers found - make them sticky and trigger respin
            setStickyJokers([...stickyJokers, ...newJokerPositions]);
            setRespinsRemaining(1); // Give 1 respin per new Joker(s)
            setRespin(true);
            setMessage("Joker symbols locked! You get a free respin!");
        } else if (respin && respinsRemaining > 0) {
            // Continue respins if we have some remaining
            setRespinsRemaining(respinsRemaining - 1);
        } else {
            // No more respins, reset sticky Jokers
            setStickyJokers([]);
            setRespin(false);
        }

        if (totalWin > 0) {
            setCredits(prevCredits => prevCredits + totalWin);
            setMessage(`You won ${totalWin} credits with ${winningLines.reduce((total, line) => total + (line.ways || 1), 0)} ways!`);
            setWinningSymbols(winningPositions);
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
           setMessage(respin ? "No additional win. " + (respinsRemaining > 0 ? "Respinning again!" : "Respins complete.") : "No win this time. Try again!");

           if (!respin) {
               // Only update loss statistics for regular spins, not respins
               setStatistics(prev => ({
                   ...prev,
                   losses: prev.losses + 1,
                   returnToPlayer: (prev.totalWon / prev.totalWagered) * 100
               }));
           }
       }
       
       // If we have respins remaining, automatically spin again after a delay
       if (respinsRemaining > 0 && respin) {
           setTimeout(() => {
               spin();
           }, 2000);
       }
   };

   // Function to handle bet changes
   const changeBet = (amount) => {
       if (isSpinning) return;

       const newBet = Math.max(1, Math.min(100, bet + amount));
       setBet(newBet);
   };

   // Function to set max bet
   const setMaxBet = () => {
       if (isSpinning) return;
       setBet(100); // Setting max bet to 100 for demo purposes
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

   // Function to render symbol with sticky effect if it's a joker
   const renderSymbol = (reelIndex, symbolIndex, symbol) => {
       const position = reelIndex * 3 + symbolIndex;
       const isSticky = stickyJokers.includes(position);
       
       return (
           <div className={`symbol ${isWinningSymbol(reelIndex, symbolIndex) ? 'winning' : ''} ${isSticky ? 'sticky-joker' : ''}`}>
               <img src={symbol.image} alt={symbol.value} className="symbol-img" />
               {isSticky && <div className="sticky-overlay">LOCKED</div>}
           </div>
       );
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
                                   className={`symbol-container ${isWinningSymbol(reelIndex, symbolIndex) ? 'winning' : ''}`}
                               >
                                   {renderSymbol(reelIndex, symbolIndex, symbol)}
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
                       <button className="bet-button decrease" onClick={() => changeBet(-5)}>-</button>
                       <div className="control-value">{bet.toFixed(2)}</div>
                       <button className="bet-button increase" onClick={() => changeBet(5)}>+</button>
                   </div>
               </div>

               <div className="win-display">
                   <div className="control-label">WIN IN CZK</div>
                   <div className="control-value">{winAmount > 0 ? winAmount.toFixed(2) : ''}</div>
               </div>

               <button className="max-bet-button" onClick={setMaxBet}>
                   MAX BET
               </button>

               <button
                   className="spin-button"
                   onClick={spin}
                   disabled={isSpinning || (credits < bet && !respin)}
               >
                   <div className="spin-icon"></div>
               </button>

               <button
                   className="auto-spin-button"
                   onClick={() => setAutoPlay(!autoPlay)}
                   disabled={credits < bet}
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
                           The Joker symbol acts as a 'sticky wild' - when it appears, it locks in place and gives you a free respin,
                           greatly increasing your chances of winning on the next spin.
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
