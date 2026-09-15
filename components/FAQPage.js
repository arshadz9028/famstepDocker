import React from 'react';
import styles from '../styles/faq.module.scss';
import Navbar from '../layouts/Navbar';
import { useSession } from 'next-auth/react';
import { FaExclamationCircle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

function FAQPage() {
    const { data: session } = useSession();

    return (
        <>
            <Navbar select="FAQ" session={session} />
            <div className={styles.faqContainer}>
                <h1>Frequently Asked Questions</h1>

                <div className={styles.faqSection}>
                    <h2>General Questions</h2>

                    <div className={styles.faqItem}>
                        <h3>What is Famstep?</h3>
                        <p>Famstep is a platform that connects professionals for collaboration on projects, sharing ideas, and building networks.</p>
                        <div className={styles.emphasizedItem}>
                            <FaInfoCircle className={styles.emphasizedIcon} />
                            <p>Our platform is designed to make collaboration seamless and efficient.</p>
                        </div>
                    </div>

                    <div className={styles.faqItem}>
                        <h3>How do I create an account?</h3>
                        <p>You can create an account by clicking on the &quot;Sign Up&quot; button and following the registration process. You&apos;ll need to provide your email, name, and create a password.</p>
                        <div className={styles.emphasizedItem}>
                            <FaCheckCircle className={styles.emphasizedIcon} />
                            <p>Creating an account is free and takes less than 2 minutes!</p>
                        </div>
                    </div>

                    <div className={styles.faqItem}>
                        <h3>Is Famstep free to use?</h3>
                        <p>Famstep offers both free and premium features. Basic usage is free, while premium features may require a subscription.</p>
                        <div className={styles.emphasizedItem}>
                            <FaExclamationCircle className={styles.emphasizedIcon} />
                            <p>All core collaboration features are available in the free tier.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.faqSection}>
                    <h2>Collaboration Features</h2>

                    <div className={styles.faqItem}>
                        <h3>How do I start a collaboration?</h3>
                        <p>To start a collaboration, go to the &quot;Collab&quot; section, click on the collaboration icon, and fill out the project details. You can then invite others to collaborate.</p>
                        <div className={styles.emphasizedItem}>
                            <FaInfoCircle className={styles.emphasizedIcon} />
                            <p>You can set project visibility, deadlines, and assign roles to team members.</p>
                        </div>
                    </div>

                    <div className={styles.faqItem}>
                        <h3>How do I manage project tasks?</h3>
                        <p>You can manage project tasks by navigating to the project page, where you can assign tasks, set deadlines, and track progress.</p>
                        <div className={styles.emphasizedItem}>
                            <FaCheckCircle className={styles.emphasizedIcon} />
                            <p>Our task management system helps you stay organized and meet deadlines.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.faqSection}>
                    <h2>Account & Privacy</h2>

                    <div className={styles.faqItem}>
                        <h3>How do I update my profile?</h3>
                        <p>You can update your profile by going to your profile page and clicking on the edit button. You can update your information, profile picture, and preferences.</p>
                        <div className={styles.emphasizedItem}>
                            <FaInfoCircle className={styles.emphasizedIcon} />
                            <p>A complete profile increases your chances of finding collaboration opportunities.</p>
                        </div>
                    </div>

                    <div className={styles.faqItem}>
                        <h3>How is my data protected?</h3>
                        <p>We take data protection seriously. Your personal information is encrypted and stored securely. We never share your data with third parties without your consent.</p>
                        <div className={styles.emphasizedItem}>
                            <FaExclamationCircle className={styles.emphasizedIcon} />
                            <p>Your privacy and security are our top priorities.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FAQPage; 