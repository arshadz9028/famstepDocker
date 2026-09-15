import React from "react";
import Image from "next/image";
import styles from "../../styles/network.module.scss";
import { IoIosCloseCircle, IoIosCheckmarkCircle } from "react-icons/io";
import axios from 'axios'
import { useRouter } from "next/navigation";
function Invitation({ invitations, index, follow,mutatefollowerData,group
}) {
const router = useRouter()
  const requestAccept = async (userid) => {
    try {
      await axios.post("/api/profile/follow/followrequestor", {
        followusername: userid,
      });

      mutatefollowerData();
    } catch (error) {
      console.error(error);
    }
    try {
      await axios.post("/api/profile/follow/reqAccept", {
        followusername: userid,
      });
      mutatefollowerData();
    } catch (error) {
      console.error(error);
    }
  };

  const requestReject = async (userid) => {
    try {
      await axios.delete(`/api/profile/follow/followRequest?userid=${userid}`);
      mutatefollowerData();
    } catch (error) {
      console.error(error);
    }
  };
  const handleProfileClick = (id) =>{
    router.push(`/profile/${id}`)
  }
  return (
    <>
      {!follow?.IsAccepted && <div className={invitations ? styles.MoreInvitations : styles.invitationCard}>
        <div className={styles.invitationFirstPart} onClick={() => handleProfileClick(follow?.userid?._id)}>
          <div className={styles.invitationImage}>
            <Image src={follow?.userid?.image} alt="userImage"  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  style={{
                  objectFit: "cover"
                }} />
          </div>
          <div className={styles.invitationDetails}>
            <p className={styles.fullName}>{follow?.userid?.name}</p>
            <p className={styles.designation}>{follow?.userid?.designation}</p>
          </div>
        </div>

        <div className={styles.invitationAccept}>
          <button className={`${styles.contestButton}  ${styles.contestButtonColor}`}
            onClick={() => requestReject(follow?.userid?._id)}
          >
            <input type="submit" value="Reject" />
          </button>
          <IoIosCloseCircle className={styles.closeInvitation} onClick={() => requestReject(follow.userid._id)}/>

          <button className={`${styles.contestButton}  ${styles.contestButtonColor1}`}
            onClick={() => requestAccept(follow?.userid?._id)}
          >
            <input type="button" value="Accept" />
          </button>
          <IoIosCheckmarkCircle className={styles.checkInvitation} onClick={() => requestAccept(follow.userid._id)}/>

        </div>
      </div>}
     
    </>
  );
}

export default Invitation;
