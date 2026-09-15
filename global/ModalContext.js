import React, { createContext, useContext, useState, useEffect } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children, session}) {
    const [updateProfile, setUpdateProfile] = useState(false);
    const [updateFeedback, setUpdateFeedback] = useState(false);
    const [updateDetails, setUpdateDetails] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login');
    const [authModalActionType, setAuthModalActionType] = useState(null);
    
    const userExist = session?.user
    // Handle body scroll when modals are open
    useEffect(() => {
        if (updateProfile || updateFeedback || showAuthModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            document.body.style.overflowX = "hidden";
        }
    }, [updateProfile, updateFeedback, showAuthModal]);

    // Profile update modal timer
    // useEffect(() => {
    //     console.log("its running context 2",userExist?.updateProfile && userExist?.userFeedback)
    //     if (userExist?.updateProfile && userExist?.userFeedback) {
    //         console.log("Starting profile update timer");
    //         const timer = setTimeout(() => {
    //             if (!updateFeedback) {
    //                 setUpdateProfile(true);
    //                 setUpdateDetails(true);
    //             }
    //         }, 60 * 1000);

    //         return () => {
    //             clearTimeout(timer);
    //             console.log("Cleaning up profile timer");
    //         };
    //     }
    // }, [updateProfile, userExist]);

    // Feedback modal timer
    useEffect(() => {
        if (userExist?.userFeedback) {
            const timer = setTimeout(() => {
                if (!updateProfile) {
                    setUpdateFeedback(true);
                }
            }, 120 * 1000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [updateFeedback, userExist]);

    // Function to open auth modal with specific mode and action type
    const openAuthModal = (mode = 'login', actionType = null) => {
        setAuthModalMode(mode);
        setAuthModalActionType(actionType);
        setShowAuthModal(true);
    };

    const value = {
        updateProfile,
        setUpdateProfile,
        updateFeedback,
        setUpdateFeedback,
        updateDetails,
        setUpdateDetails,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        authModalActionType,
        openAuthModal
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
} 