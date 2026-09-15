import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../../pages/collab/gigs.module.scss';
import { FaLink, FaFacebookF, FaWhatsapp, FaTwitter, FaLinkedinIn, FaInstagram, FaCheck, FaUserPlus } from "react-icons/fa";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from 'axios';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { message } from 'antd';
// Fetch follower data - reusing the same fetcher from navbarSWR.js
const fetchFollowerData = async (url) => {
    if (!url) {
        console.warn("No URL provided to fetchFollowerData");
        return { success: false, error: 'No URL provided' };
    }

    try {
        const response = await axios.get(url, {
            // Add headers if needed
            headers: {
                'Content-Type': 'application/json',
                // Add any auth headers here if required
            }
        });

        if (response.data) {
            return {
                success: true,
                data: response.data
            };
        }

        return {
            success: false,
            error: 'No data returned',
            status: response.status
        };

    } catch (error) {
        // Log detailed error information
        console.error("Follower fetch error:", {
            status: error.response?.status,
            message: error.message,
            url: url
        });

        return {
            success: false,
            error: error.response?.status === 404
                ? 'Follower data endpoint not found'
                : error.message,
            status: error.response?.status
        };
    }
};

const ShareModal = ({
    isOpen,
    onClose,
    shareData = {}, // Provide default empty object
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDefaultProfiles, setShowDefaultProfiles] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const profileContainerRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);
    const { data: session, status } = useSession()
    // Ensure shareData has valid values
    const safeShareData = {
        title: shareData?.title || 'Check out this collaboration',
        text: shareData?.text || 'A great collaboration opportunity',
        url: shareData?.url || (typeof window !== 'undefined' ? window.location.href : '')
    };
    // Fetch follower data using SWR with the correct endpoint
    const { data: followerData, error: followerError } = useSWR(
        isOpen ? '/api/profile/follow/followerFetch' : null,
        fetchFollowerData,
        { revalidateOnFocus: false }
    );

    // Format follower data into the format we need
    const [followingUsers, setFollowingUsers] = useState([]);

    useEffect(() => {
        if (followerData && followerData.success) {
            let formattedFollowing = [];
            // Try different data paths
            if (followerData.data?.following) {
                formattedFollowing = followerData.data.following.map(follow => ({
                    id: follow.userid?._id,
                    name: follow.userid?.name || 'User',
                    username: follow.userid?.username || 'user',
                    image: follow.userid?.image || '/noavatar.png'
                }));
            } else if (followerData.following) {
                formattedFollowing = followerData.following.map(follow => ({
                    id: follow.userid?._id,
                    name: follow.userid?.name || 'User',
                    username: follow.userid?.username || 'user',
                    image: follow.userid?.image || '/noavatar.png'
                }));
            } else if (followerData.dats?.following) {
                formattedFollowing = followerData.dats.following.map(follow => ({
                    id: follow.userid?._id,
                    name: follow.userid?.name || 'User',
                    username: follow.userid?.username || 'user',
                    image: follow.userid?.image || '/noavatar.png'
                }));
            }

            setFollowingUsers(formattedFollowing);
        }
    }, [followerData]);

    useEffect(() => {
        // Reset to default profiles when modal opens
        if (isOpen) {
            setIsClosing(false);
            setSearchTerm('');
            setSearchResults([]);
            setShowDefaultProfiles(true);
            setError('');
            setSelectedUsers([]);
        }
    }, [isOpen]);

    // Add mouse wheel horizontal scroll handling
    useEffect(() => {
        const handleWheel = (e) => {
            if (profileContainerRef.current) {
                e.preventDefault();
                profileContainerRef.current.scrollLeft += e.deltaY;
            }
        };

        const profileContainer = profileContainerRef.current;
        if (profileContainer) {
            profileContainer.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (profileContainer) {
                profileContainer.removeEventListener('wheel', handleWheel);
            }
        };
    }, [isOpen]);

    if (!isOpen && !isClosing) return null;

    const handleCloseWithAnimation = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300); // Match this to the animation duration
    };

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Show default profiles if search term is empty
        if (!value.trim()) {
            setSearchResults([]);
            setShowDefaultProfiles(true);
            setError('');
            return;
        }

        setLoading(true);
        setShowDefaultProfiles(false);

        try {
            const response = await axios.post("/api/auth/find/findSearch", {
                value,
            });

            setSearchResults(response.data.message);
            setError('');
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
            setError('No users found.');
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async (platform) => {
        try {
            // Log and use our safe data
            const { title, text, url } = safeShareData;

            // Only proceed if we have a URL at minimum
            if (!url) {
                console.error("Cannot share without a URL");
                if (typeof window !== 'undefined') {
                    message.error("Unable to share - missing URL");
                }
                return;
            }

            // Use navigator.share API if available and platform is 'native'
            if (platform === 'native' && typeof window !== 'undefined' && navigator.share) {
                try {
                    await navigator.share({
                        title,
                        text,
                        url
                    });
                    return;
                } catch (err) {
                    console.error('Error sharing:', err);
                    // Fall back to other methods if navigator.share fails
                }
            }

            // Only execute window operations on the client side
            if (typeof window !== 'undefined') {
                try {
                    switch (platform) {
                        case 'whatsapp':
                            // For WhatsApp, just send the URL directly without text
                            // This lets WhatsApp fetch the proper OG metadata instead
                            window.open(`https://wa.me/?text=${encodeURIComponent(url)}`);
                            break;
                        case 'facebook':
                            window.open(`https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`);
                            break;
                        case 'twitter':
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
                            break;
                        case 'linkedin':
                            window.open(`https://www.linkedin.com/sharing/share-offsite/?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`);
                            break;

                        case 'copy':
                            try {
                                await navigator.clipboard.writeText(url);
                                message.success("Link copied to clipboard!");
                            } catch (err) {
                                console.error('Failed to copy:', err);
                                // Fallback for clipboard copy
                                const textArea = document.createElement('textarea');
                                textArea.value = url;
                                document.body.appendChild(textArea);
                                textArea.focus();
                                textArea.select();
                                try {
                                    document.execCommand('copy');
                                    message.success("Link copied to clipboard!");
                                } catch (e) {
                                    console.error('Fallback copy failed:', e);
                                     message.error("Could not copy link. Please copy it manually: " + url);
                                }
                                document.body.removeChild(textArea);
                            }
                            break;
                        default:
                            console.error("Unknown sharing platform:", platform);
                    }
                } catch (windowErr) {
                    console.error("Error opening sharing window:", windowErr);
                    message.error(`Could not open ${platform} sharing. Please try another method.`);
                }
            }
        } catch (err) {
            console.error("Share handler error:", err);
            if (typeof window !== 'undefined') {
                message.error("There was an error sharing. Please try again later.");
            }
        }
        handleCloseWithAnimation();
    };

    const toggleSelectUser = (user) => {
        const userId = user.id || user._id;

        if (selectedUsers.some(selected => (selected.id || selected._id) === userId)) {
            // User is already selected, remove them
            setSelectedUsers(selectedUsers.filter(selected =>
                (selected.id || selected._id) !== userId
            ));
        } else {
            // User is not selected, add them
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const isUserSelected = (user) => {
        const userId = user.id || user._id;
        return selectedUsers.some(selected => (selected.id || selected._id) === userId);
    };

    const handleShareWithUsers = () => {
        if (selectedUsers.length === 0) {
            message.info("Please select at least one user to share with.");
            return;
        }

        // Here you would implement the logic to share with selected users
        message.success(`Sharing with ${selectedUsers.length} users`);

        // In a real implementation, you'd send this to your backend
        // For example:
        // axios.post('/api/share/withUsers', {
        //   users: selectedUsers.map(user => user.id || user._id),
        //   content: { ...shareData }
        // });

        handleCloseWithAnimation();
    };

    // Choose which profiles to display
    const displayProfiles = showDefaultProfiles ? followingUsers : searchResults;

    // Loading state while fetching follower data
    const isLoadingFollowers = isOpen && !followerData && !followerError;

    return (
        <div
            className={`${styles.shareModal} ${isClosing ? styles.fadeOut : ''}`}
            onClick={handleCloseWithAnimation}
        >
            <div
                className={`${styles.modernShareOptions} ${isClosing ? styles.slideDown : ''}`}
                onClick={e => e.stopPropagation()}
            >
                <div className={styles.shareHeader}>
                    <h3>Share</h3>
                    <AiOutlineCloseCircle
                        className={styles.closeShareBtn}
                        onClick={handleCloseWithAnimation}
                    />
                </div>

                {status === "authenticated" &&
                    <>

                        <div className={styles.searchShareContainer}>
                            <input
                                type="text"
                                placeholder="Search users..."
                                className={styles.searchShare}
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>

                        <div
                            className={styles.profileShareContainer}
                            ref={profileContainerRef}
                        >
                            {(loading || isLoadingFollowers) ? (
                                <div className={styles.noResults}>Loading...</div>
                            ) : followerError ? (
                                <div className={styles.noResults}>Error loading followers</div>
                            ) : (
                                <div className={styles.profileScroll}>
                                    {displayProfiles && displayProfiles.length > 0 ? (
                                        displayProfiles.map(profile => (
                                            <div
                                                key={profile.id || profile._id}
                                                className={`${styles.profileShareItem} ${isUserSelected(profile) ? styles.selectedProfile : ''}`}
                                                onClick={() => toggleSelectUser(profile)}
                                            >
                                                <div className={styles.profileShareAvatar}>
                                                    <div className={styles.imageWrapper}>
                                                        <Image
                                                            className={styles.profileShareAvatarImage}
                                                            src={profile.image}
                                                            alt={profile.name || profile.username}
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                    </div>
                                                    {isUserSelected(profile) && (
                                                        <div className={styles.checkmarkOverlay}>
                                                            <FaCheck />
                                                        </div>
                                                    )}
                                                </div>
                                                <span>{profile.name || profile.username}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.noResults}>{error || 'No users found'}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                }
                {selectedUsers.length > 0 && (
                    <div className={styles.selectedUsersBar}>
                        <p>Selected: {selectedUsers.length} users</p>
                        <button
                            className={styles.shareWithUsersBtn}
                            onClick={handleShareWithUsers}
                        >
                            Share with selected users
                        </button>
                    </div>
                )}

                <div className={styles.circleShareButtons}>
                    <button onClick={() => handleShare('copy')} className={styles.circleShareBtn}>
                        <span className={styles.circleIcon}><FaLink /></span>
                        <span className={styles.circleBtnLabel}>Copy link</span>
                    </button>
                    <button onClick={() => handleShare('facebook')} className={styles.circleShareBtn}>
                        <span className={styles.circleIcon}><FaFacebookF /></span>
                        <span className={styles.circleBtnLabel}>Facebook</span>
                    </button>
                    <button onClick={() => handleShare('whatsapp')} className={styles.circleShareBtn}>
                        <span className={styles.circleIcon}><FaWhatsapp /></span>
                        <span className={styles.circleBtnLabel}>WhatsApp</span>
                    </button>
                    <button onClick={() => handleShare('twitter')} className={styles.circleShareBtn}>
                        <span className={styles.circleIcon}><FaTwitter /></span>
                        <span className={styles.circleBtnLabel}>X</span>
                    </button>
                    <button onClick={() => handleShare('linkedin')} className={styles.circleShareBtn}>
                        <span className={styles.circleIcon}><FaLinkedinIn /></span>
                        <span className={styles.circleBtnLabel}>LinkedIn</span>
                    </button>


                </div>

                {typeof navigator !== 'undefined' && navigator.share && (
                    <button onClick={() => handleShare('native')} className={styles.nativeShareBtnModern}>
                        Use device sharing
                    </button>
                )}
            </div>
        </div>
    );
};

export default ShareModal;