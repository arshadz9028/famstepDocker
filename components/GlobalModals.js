import React from 'react';
import { useModal } from '../global/ModalContext';
import UpdateusProfile from '../layouts/Network/UpdateusProfile';
import FeedBackModel from '../layouts/Network/FeedbackModel';
import AuthModal from './AuthModal';

export default function GlobalModals() {
    const { 
        updateProfile, 
        updateFeedback, 
        updateDetails, 
        setUpdateFeedback, 
        setUpdateProfile,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        authModalActionType
    } = useModal();
    
    return (
        <>
            {/* {updateProfile && (
                <UpdateusProfile
                    setUpdateProfile={setUpdateProfile}
                    page={"network"}
                    updateDetails={updateDetails}
                />
            )} */}
            {updateFeedback && (
                <FeedBackModel
                    setUpdateProfile={setUpdateFeedback}
                    page={"network"}
                    updateDetails={updateFeedback}
                />
            )}
            
            <AuthModal 
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                mode={authModalMode}
                actionType={authModalActionType}
            />
        </>
    );
} 