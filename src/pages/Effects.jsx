const Effects = () => {
    return (
        <div className="effects-container">
            <div className="effects-hero">
                <h1>Gambling Side Effects</h1>
                <p>Understanding the physical, psychological, financial, and social consequences of gambling addiction</p>
            </div>

            <div className="effects-content">
                <div className="effects-grid">
                    <div className="effect-card">
                        <div className="effect-icon">🧠</div>
                        <h3>Psychological Effects</h3>
                        <ul>
                            <li>Depression and anxiety disorders</li>
                            <li>Increased risk of suicide (15-20x higher than general population)</li>
                            <li>Substance abuse as a coping mechanism</li>
                            <li>Sleep disorders and chronic stress</li>
                            <li>Feelings of shame, guilt, and helplessness</li>
                            <li>Distorted thinking patterns that persist outside of gambling</li>
                        </ul>
                    </div>

                    <div className="effect-card">
                        <div className="effect-icon">💰</div>
                        <h3>Financial Effects</h3>
                        <ul>
                            <li>Overwhelming debt (average $40,000-$70,000)</li>
                            <li>Bankruptcy (affects 20-30% of problem gamblers)</li>
                            <li>Loss of assets (homes, cars, retirement funds)</li>
                            <li>Predatory lending cycles with high-interest loans</li>
                            <li>Stealing or fraud to fund gambling</li>
                            <li>Long-term financial instability affecting future generations</li>
                        </ul>
                    </div>

                    <div className="effect-card">
                        <div className="effect-icon">👨‍👩‍👧‍👦</div>
                        <h3>Relationship Effects</h3>
                        <ul>
                            <li>Divorce and family breakdown</li>
                            <li>Loss of trust due to lying and deception</li>
                            <li>Neglect of family responsibilities</li>
                            <li>Social isolation from friends and family</li>
                            <li>Increased risk of domestic violence</li>
                            <li>Children developing insecurity and behavioral problems</li>
                        </ul>
                    </div>

                    <div className="effect-card">
                        <div className="effect-icon">💼</div>
                        <h3>Professional Effects</h3>
                        <ul>
                            <li>Decreased productivity and focus at work</li>
                            <li>Job loss due to gambling at work or absenteeism</li>
                            <li>Career stagnation or regression</li>
                            <li>Workplace theft to fund gambling</li>
                            <li>Difficulty finding new employment with poor credit</li>
                            <li>Long gaps in employment history</li>
                        </ul>
                    </div>

                    <div className="effect-card">
                        <div className="effect-icon">❤️</div>
                        <h3>Physical Health Effects</h3>
                        <ul>
                            <li>Stress-related conditions (hypertension, heart disease)</li>
                            <li>Compromised immune system from chronic stress</li>
                            <li>Malnutrition and weight changes</li>
                            <li>Self-neglect and poor personal hygiene</li>
                            <li>Sleep disorders and related health issues</li>
                            <li>Alcohol and substance abuse related health problems</li>
                        </ul>
                    </div>

                    <div className="effect-card">
                        <div className="effect-icon">⚖️</div>
                        <h3>Legal Consequences</h3>
                        <ul>
                            <li>Criminal charges from theft, fraud, or embezzlement</li>
                            <li>Legal costs from divorce and bankruptcy</li>
                            <li>Child custody issues</li>
                            <li>Criminal record affecting future employment</li>
                            <li>Immigration status complications</li>
                            <li>Loss of professional licenses</li>
                        </ul>
                    </div>
                </div>

                <div className="personal-stories">
                    <h2>Personal Testimonies</h2>
                    <div className="story-card">
                        <h3>"I Lost Everything"</h3>
                        <p>"I started gambling occasionally at 25. By 30, I had lost my house, my wife left me, and I was $120,000 in debt. I thought I could control it, but it controlled me. What started as entertainment became an obsession that destroyed my life. It took me 5 years of therapy and Gamblers Anonymous to rebuild some semblance of normalcy."</p>
                        <p className="story-author">- Michael, 42</p>
                    </div>

                    <div className="story-card">
                        <h3>"The Impact on My Children"</h3>
                        <p>"The worst part wasn't losing our savings or even our home. It was seeing the look in my daughter's eyes when she realized she couldn't go to the college she'd worked so hard to get into because I had gambled away her education fund. That moment of devastating her future haunts me daily. Children are the hidden victims of gambling addiction."</p>
                        <p className="story-author">- Sarah, 51</p>
                    </div>
                </div>

                <div className="warning-signs">
                    <h2>Warning Signs of Problem Gambling</h2>
                    <ul className="warning-list">
                        <li>Gambling with increasing amounts of money to feel excitement</li>
                        <li>Feeling restless or irritable when trying to cut down on gambling</li>
                        <li>Making repeated unsuccessful efforts to control or stop gambling</li>
                        <li>Thinking about gambling frequently (reliving past gambling experiences, planning next ventures)</li>
                        <li>Gambling when feeling distressed (anxious, depressed, guilty)</li>
                        <li>Returning to gamble after losing money ("chasing losses")</li>
                        <li>Lying to conceal the extent of gambling</li>
                        <li>Jeopardizing relationships, job, or opportunities because of gambling</li>
                        <li>Relying on others for money to relieve financial situations caused by gambling</li>
                    </ul>
                    <p className="warning-note">If you or someone you know shows 4 or more of these signs, it may indicate a gambling problem requiring professional help.</p>
                </div>
            </div>
        </div>
    );
};

export default Effects;