import React, { useContext } from "react";
import styles from "../../styles/contest.module.scss";
import { ContextProvider } from "../../global/context";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

const PendingCard = ({ codeData, session }) => {
    const { collabID, setOpenDetails, setIsEditCollab } = useContext(ContextProvider);
    const router = useRouter();

    const handleViewDetails = () => {
        router.push(`/collab/${codeData?.collabID}`);
    };
    const newSelected = codeData?.owner?._id
    const chatWithSelected = async () => {
        try {
            const res = await axios.post(`/api/message/chat`, { newSelected });
            await router.push(`/message/${res.data._id}`);

        } catch (error) {
            return <> Failed to load profile page. </>;
        }
    };

    return (
        <div className={`${styles.collabCard} ${styles.pendingCard}`}>
            <div className={styles.statusRibbon2}>Pending</div>
            <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{codeData?.title?.length > 27 ? codeData?.title.slice(0, 27) + '...' : codeData?.title}</h3>
            </div>
            <div className={styles.cardDetails}>
                <div className={styles.detailItem}>
                    <span>Status: Pending Acceptance</span>
                </div>
                <div className={styles.detailItem}>
                    <span>Submitted: {new Date(codeData.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.detailItem}>
                    <div className={styles.userInfo}>
                        <div className={styles.userImage}>
                            <Image
                                src={codeData?.owner?.image || "/default.png"}
                                alt={codeData?.owner?.name || "Owner"}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                        <span>Owner: {codeData?.owner?.name || "Unknown"}</span>
                    </div>
                </div>
            </div>
            <div className={styles.cardActions}>
                <button
                    className={`${styles.btn} ${styles.primaryBtn}`}
                    onClick={handleViewDetails}
                >
                    View Details
                </button>
                <button
                    className={`${styles.btn} ${styles.secondaryBtn}`}
                    onClick={chatWithSelected}
                >
                    Message Owner
                </button>
            </div>
        </div>
    );
};

export default PendingCard; 