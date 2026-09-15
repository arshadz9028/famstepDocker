import React, { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import styles from '../styles/ModalTemplate.module.scss';
import { FaUser, FaLock, FaEnvelope, FaUserTag } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import { IoCloseCircleSharp } from "react-icons/io5";
import { useRouter } from "next/router";
import axios from 'axios';

const AuthModal = ({ isOpen, onClose, mode = 'login', actionType = null }) => {
    const [activeTab, setActiveTab] = useState(mode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [username1, setUsername1] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [resError, setResError] = useState('none');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameValid, setUsernameValid] = useState(false);
    const router = useRouter();

    // Use a ref to store the current username value
    const usernameRef = useRef('');

    // Update the ref whenever username1 changes
    useEffect(() => {
        usernameRef.current = username1;
    }, [username1]);

    // Username check function
    const usernameCheck = async () => {
        const currentUsername = usernameRef.current;

        if (!currentUsername) {
            setUsernameError('');
            setResError('none');
            setUsernameValid(false);
            return;
        }

        setIsCheckingUsername(true);
        setUsernameValid(false);

        try {
            const response = await axios.post('/api/auth/signup/username_check', {
                username1: currentUsername,
            });
            setResError('green');
            setUsernameError('');
            setUsernameValid(true);
        } catch (error) {
            setResError('red');
            setUsernameError(error.response.data.error);
            setUsernameValid(false);
        } finally {
            setIsCheckingUsername(false);
        }
    };

    // Handle username change with debounce
    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername1(value);
        setUsernameValid(false);

        // Use setTimeout for debouncing
        setTimeout(() => {
            if (value) {
                usernameCheck();
            }
        }, 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (activeTab === 'login') {
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (result.error) {
                    setError('Invalid email or password');
                } else {
                    onClose();
                }
            } else {
                // Check if username is valid before submitting
                if (!usernameValid) {
                    setError('Please enter a valid username');
                    setLoading(false);
                    return;
                }

                // Handle signup logic using axios
                const response = await axios.post('/api/auth/signup', {
                    values: {
                        email,
                        fullname: name,
                        password
                    },
                    username1
                });

                if (response.data.error) {
                    setError(response.data.error);
                } else {
                    // Store the auth token in sessionStorage for automatic login after verification
                    if (response.data.authToken) {
                        sessionStorage.setItem('authToken', response.data.authToken);
                    }

                    // Auto login after successful signup
                    onClose();
                    router.push(`/emailVerify/?user=${username1}`);
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        signIn(provider, { callbackUrl: window.location.href });
    };

    const getActionMessage = () => {
        if (!actionType) return null;

        switch (actionType) {
            case 'like':
                return 'Please login to like this post';
            case 'reply':
                return 'Please login to reply to this post';
            case 'threeDots':
                return 'Please login to access this feature';
            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.wholeAction} onClick={(e) => {
            if (e.target.className === styles.wholeAction) {
                onClose();
            }
        }}>
            <div className={styles.mypic}>

                {actionType && (
                    <div className={styles.actionMessage}>
                        <div className={styles.close_full_Section} onClick={onClose}>
                            <IoCloseCircleSharp />
                        </div>
                        <p>{getActionMessage()}</p>
                    </div>
                )}

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'signup' ? styles.active : ''}`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>

                    <div className={styles.inputGroup}>
                        <FaEnvelope className={styles.inputIcon} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {activeTab === 'signup' && (
                        <>
                            <div className={styles.inputGroup}>
                                <FaUser className={styles.inputIcon} />
                                <input
                                    type="text"
                                    placeholder="Full Name (First & Last Name)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup} style={{ position: 'relative' }}>
                                <FaUserTag className={styles.inputIcon} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username1}
                                    onChange={handleUsernameChange}
                                    style={{ outline: `1px solid ${resError}` }}
                                    required
                                />
                                <div style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '0',
                                    bottom: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {isCheckingUsername && (
                                        <div className={styles.spinner}></div>
                                    )}
                                    {usernameValid && !isCheckingUsername && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" width="20" height="20">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            {usernameError && (
                                <div style={{ color: 'red', fontSize: '1.2rem', margin: '-10px 0rem 0rem .5rem' }}>
                                    {usernameError}
                                </div>
                            )}
                        </>
                    )}


                    <div className={styles.inputGroup}>
                        <FaLock className={styles.inputIcon} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : activeTab === 'login' ? 'Login' : 'Sign Up'}
                    </button>

                    <div className={styles.divider}>
                        <span>OR</span>
                    </div>

                    <div className={styles.socialButtons}>
                        <button
                            className={styles.socialButton}
                            onClick={() => handleSocialLogin('google')}
                        >
                            <FcGoogle /> Continue with Google
                        </button>
                        <button
                            className={styles.socialButton}
                            onClick={() => handleSocialLogin('github')}
                        >
                            <BsGithub /> Continue with GitHub
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthModal; 