const Quitting = () => {
    return (
        <div className="quitting-container">
            <div className="quitting-hero">
                <h1>Quitting Gambling</h1>
                <p>Resources and strategies for overcoming gambling addiction</p>
            </div>

            <div className="quitting-content">
                <section className="quitting-section">
                    <h2>Recovery Steps</h2>
                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Acknowledge the Problem</h3>
                            <p>Recognize that gambling has become problematic in your life. This is often the most difficult step but is essential for recovery. Take a self-assessment quiz or speak with a mental health professional who specializes in addiction.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Seek Professional Help</h3>
                            <p>Reach out to addiction specialists, therapists, or counselors who have experience with gambling disorders. They can provide personalized treatment plans that may include cognitive-behavioral therapy, which has shown effectiveness for gambling addiction.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Join Support Groups</h3>
                            <p>Connect with others who understand what you're going through. Gamblers Anonymous and other support groups provide community, accountability, and practical recovery strategies from those with lived experience.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">4</div>
                            <h3>Block Access to Gambling</h3>
                            <p>Create barriers between yourself and gambling opportunities. Install blocking software on your devices, self-exclude from gambling venues, close online gambling accounts, and consider giving financial control temporarily to a trusted person.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">5</div>
                            <h3>Address Financial Issues</h3>
                            <p>Work with a financial counselor to create a plan for dealing with gambling debt. This may include consolidation, bankruptcy in severe cases, or structured payment plans. Be transparent with family members about the situation.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">6</div>
                            <h3>Rebuild Relationships</h3>
                            <p>Gambling addiction damages relationships through lies, financial strain, and broken trust. Family therapy can help heal these wounds. Making amends and demonstrating consistent change over time is essential for rebuilding trust.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">7</div>
                            <h3>Develop Healthy Coping Skills</h3>
                            <p>Learn to manage stress, boredom, and negative emotions without gambling. Meditation, exercise, creative hobbies, and social activities can provide healthy alternatives and new sources of fulfillment.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">8</div>
                            <h3>Create a Relapse Prevention Plan</h3>
                            <p>Work with your therapist to identify triggers and high-risk situations. Develop specific strategies for each potential trigger and establish a support network you can reach out to when urges arise.</p>
                        </div>
                    </div>
                </section>

                <section className="quitting-section resources-section">
                    <h2>Helpful Resources</h2>
                    <div className="resources-grid">
                        <div className="resource-card">
                            <h3>National Helplines</h3>
                            <ul>
                                <li><strong>National Problem Gambling Helpline:</strong> 1-800-522-4700 (24/7 confidential support)</li>
                                <li><strong>Gamblers Anonymous:</strong> www.gamblersanonymous.org</li>
                                <li><strong>National Council on Problem Gambling:</strong> www.ncpgambling.org</li>
                            </ul>
                        </div>

                        <div className="resource-card">
                            <h3>Self-Exclusion Programs</h3>
                            <p>Most states offer self-exclusion programs that ban you from casinos and online gambling sites. Contact your state's gaming commission or visit their website for information on how to enroll.</p>
                        </div>

                        <div className="resource-card">
                            <h3>Financial Resources</h3>
                            <ul>
                                <li><strong>National Foundation for Credit Counseling:</strong> www.nfcc.org</li>
                                <li><strong>Debtors Anonymous:</strong> www.debtorsanonymous.org</li>
                            </ul>
                        </div>

                        <div className="resource-card">
                            <h3>Blocking Software</h3>
                            <ul>
                                <li><strong>Gamban:</strong> Blocks gambling sites and apps across all devices</li>
                                <li><strong>Betblocker:</strong> Free gambling site blocking tool</li>
                                <li><strong>Net Nanny:</strong> Parental controls that can be used to block gambling content</li>
                            </ul>
                        </div>

                        <div className="resource-card">
                            <h3>Books on Recovery</h3>
                            <ul>
                                <li>"Overcoming Gambling" by Philip Mawer</li>
                                <li>"The Addiction Recovery Workbook" by Paula Shierly</li>
                                <li>"Gambling Addiction: The Problem, The Pain, and The Path to Recovery" by Dr. Andrew Greene</li>
                            </ul>
                        </div>

                        <div className="resource-card">
                            <h3>Mobile Apps</h3>
                            <ul>
                                <li><strong>Gambling Recovery:</strong> Tracks clean days, triggers, and progress</li>
                                <li><strong>Addiction AVERT:</strong> Helps manage urges in the moment</li>
                                <li><strong>Mindfulness Coach:</strong> Teaches meditation techniques useful in recovery</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="quitting-section success-stories">
                    <h2>Recovery Success Stories</h2>
                    <div className="story-card success-story">
                        <h3>"Five Years Clean"</h3>
                        <p>"After losing $200,000 and almost my marriage, I finally admitted I needed help. Combining therapy, GA meetings, and a complete lifestyle change, I've been gambling-free for five years. It wasn't easy, especially dealing with the financial aftermath, but life gets better. My relationship with my wife is stronger than ever, and I've found joy in simple pleasures that gambling had numbed me to."</p>
                        <p className="story-author">- James, 38</p>
                    </div>

                    <div className="story-card success-story">
                        <h3>"It's Never Too Late"</h3>
                        <p>"I started gambling at 60 after my husband died. Within three years, I'd gone through my retirement savings. My daughter intervened and helped me find a therapist who specialized in grief and addiction. I learned that my gambling was an escape from grief. Through therapy and reconnecting with my community, I rebuilt my life. At 70, I volunteer counseling other seniors with gambling problems."</p>
                        <p className="story-author">- Eleanor, 70</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Quitting;