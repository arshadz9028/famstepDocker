import React from 'react';
import { useRouter } from 'next/router';
import styles from '../../pages/collab/gigs.module.scss';
import { RiUserSettingsLine } from 'react-icons/ri';

const IncompleteProfileModal = ({ isOpen, onClose, missingFields = [] }) => {
    const router = useRouter();

    if (!isOpen) return null;

    const handleCompleteProfile = () => {
        router.push('/me');
        onClose();
    };

    const getMissingFieldsMessage = () => {
        const formattedFields = missingFields.map(field => 
            field.charAt(0).toUpperCase() + field.slice(1)
        ).join(', ');

        return `Please complete the following in your profile: ${formattedFields}`;
    };

    return (
        <div className={styles.incompleteProfileModal} onClick={onClose}>
            <div className={styles.incompleteProfileContent} onClick={e => e.stopPropagation()}>
                <RiUserSettingsLine className={styles.incompleteProfileIcon} />
                <h2 className={styles.incompleteProfileTitle}>Complete Your Profile</h2>
                <p className={styles.incompleteProfileMessage}>
                    {getMissingFieldsMessage()}
                </p>
                <div className={styles.incompleteProfileButtons}>
                    <button 
                        className={styles.completeProfileBtn}
                        onClick={handleCompleteProfile}
                    >
                        Complete Profile
                    </button>
                    <button 
                        className={styles.cancelBtn}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncompleteProfileModal; 