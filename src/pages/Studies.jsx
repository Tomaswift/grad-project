const Studies = () => {
    return (
        <div className="studies-container">
            <div className="studies-hero">
                <h1>Studies on Gambling Addiction</h1>
                <p>Research and statistics about gambling addiction and its impacts</p>
            </div>

            <div className="studies-content">
                <section className="study-section">
                    <h2>Prevalence of Gambling Addiction</h2>
                    <div className="study-card">
                        <h3>Global Statistics</h3>
                        <p>According to research, approximately 1-5% of adults globally meet the criteria for gambling disorder, with variations by region and availability of gambling.</p>
                        <ul>
                            <li>North America: 2-5% of adults</li>
                            <li>Europe: 0.5-3% of adults</li>
                            <li>Australia: Up to 2% of adults</li>
                            <li>Asia: Varies widely by country and legal status</li>
                        </ul>
                        <p className="source">Source: World Health Organization, 2023</p>
                    </div>

                    <div className="study-card">
                        <h3>Risk Factors</h3>
                        <p>Research has identified several factors that increase the risk of developing gambling addiction:</p>
                        <ul>
                            <li>Family history of addiction</li>
                            <li>Personal history of substance abuse</li>
                            <li>Certain personality traits (impulsivity, sensation-seeking)</li>
                            <li>Mental health conditions (depression, anxiety, ADHD)</li>
                            <li>Early exposure to gambling</li>
                            <li>Easy access to gambling opportunities</li>
                        </ul>
                        <p className="source">Source: American Psychiatric Association, 2022</p>
                    </div>
                </section>

                <section className="study-section">
                    <h2>Psychological Research</h2>
                    <div className="study-card">
                        <h3>Variable Reward Systems</h3>
                        <p>Gambling activates the brain's reward system through variable reinforcement schedules, which are more addictive than consistent rewards. This was demonstrated in Skinner's classic experiments, where animals pressed levers more persistently when rewards were unpredictable.</p>
                        <p>Modern brain imaging studies show that near-misses in gambling activate similar neural pathways as wins, despite being losses. This creates a cognitive distortion that keeps players engaged.</p>
                        <p className="source">Source: Journal of Behavioral Neuroscience, 2023</p>
                    </div>

                    <div className="study-card">
                        <h3>Cognitive Distortions</h3>
                        <p>Research has identified specific thinking errors that maintain problem gambling:</p>
                        <ul>
                            <li><strong>Gambler's Fallacy:</strong> Belief that random events become "due" (e.g., thinking red is due after seeing black 5 times in roulette)</li>
                            <li><strong>Illusion of Control:</strong> Overestimating one's ability to control random outcomes</li>
                            <li><strong>Selective Memory:</strong> Remembering wins vividly while minimizing or forgetting losses</li>
                            <li><strong>Chasing Losses:</strong> Believing one must continue playing to recover previous losses</li>
                        </ul>
                        <p className="source">Source: Cognitive Therapy and Research, 2021</p>
                    </div>
                </section>

                <section className="study-section">
                    <h2>Financial and Social Impact</h2>
                    <div className="study-card">
                        <h3>Economic Costs</h3>
                        <p>Problem gambling creates significant societal costs:</p>
                        <ul>
                            <li>Estimated annual cost to society: $5-7 billion in the US alone</li>
                            <li>Includes costs from bankruptcy, unemployment, healthcare, and criminal justice</li>
                            <li>Problem gamblers accumulate an average of $40,000-$70,000 in gambling debt</li>
                            <li>20-30% of problem gamblers file for bankruptcy</li>
                        </ul>
                        <p className="source">Source: National Council on Problem Gambling, 2023</p>
                    </div>

                    <div className="study-card">
                        <h3>Impact on Relationships</h3>
                        <p>Problem gambling severely affects families and relationships:</p>
                        <ul>
                            <li>Divorce rates 2-4 times higher among problem gamblers</li>
                            <li>65% report experiencing relationship conflicts due to gambling</li>
                            <li>Children of problem gamblers are at greater risk for depression, substance abuse, and gambling problems</li>
                            <li>Domestic violence rates are significantly higher in homes with problem gambling</li>
                        </ul>
                        <p className="source">Source: Journal of Family Psychology, 2022</p>
                    </div>
                </section>

                <section className="study-section">
                    <h2>Treatment Effectiveness</h2>
                    <div className="study-card">
                        <h3>Evidence-Based Approaches</h3>
                        <p>Several treatment approaches have shown effectiveness for gambling disorder:</p>
                        <ul>
                            <li><strong>Cognitive-Behavioral Therapy (CBT):</strong> 60-70% success rate at 1-year follow-up</li>
                            <li><strong>Motivational Interviewing:</strong> Especially effective in early stages</li>
                            <li><strong>Gamblers Anonymous:</strong> Similar structure to AA, shows modest effectiveness when combined with professional treatment</li>
                            <li><strong>Family Therapy:</strong> Addresses relationship damage and creates support system</li>
                        </ul>
                        <p className="source">Source: Journal of Clinical Psychology, 2023</p>
                    </div>

                    <div className="study-card">
                        <h3>Recovery Statistics</h3>
                        <p>Research on recovery from gambling addiction shows:</p>
                        <ul>
                            <li>Without treatment, only 7-12% achieve long-term recovery</li>
                            <li>With appropriate treatment, 60-80% show significant improvement</li>
                            <li>Relapse rates are highest in the first 6 months</li>
                            <li>Financial counseling alongside psychological treatment improves outcomes</li>
                        </ul>
                        <p className="source">Source: International Journal of Mental Health and Addiction, 2022</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Studies;