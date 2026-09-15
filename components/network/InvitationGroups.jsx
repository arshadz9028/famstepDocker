import React from "react";
import Image from "next/image";
import styles from "../../styles/network.module.scss";
import { IoIosCloseCircle, IoIosCheckmarkCircle } from "react-icons/io";
import axios from "axios";
import cap from "../../assets/newIcons/admin.png";

function InvitationGroups({
  invitations,
  mutatefollowerData,
  group,
}) {
  const requestAccept = async (grpId) => {
    try {
      await axios.put("/api/group/groupRequests", {
        grpId,
        admin: group.admin,
      });

      mutatefollowerData();
    } catch (error) {
      console.error(error);
    }
    try {
      await axios.post("/api/group/acceptFlag", {
        grpId,
      });
      mutatefollowerData();
    } catch (error) {
      console.error(error);
    }
  };

  const requestReject = async (grpId) => {
    try {
      await axios.delete(`/api/group/groupRequests?grpId=${grpId}`);
      mutatefollowerData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!group?.IsAcctdInvite && (
        <div
          className={
            invitations ? styles.MoreInvitations : styles.invitationCard
          }
        >
          <div className={styles.invitationFirstPart}>
            <div className={styles.invitationImage}>
              <Image
                src={group?.groupId?.image}
                alt="userImage"
                 fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 style={{
                  objectFit: "cover"
                }}
              />
            </div>
            <div className={styles.invitationDetails}>
              <p className={styles.fullName}>{group?.groupId?.groupName} (<span style={{color:'#08529B', fontWeight:"500"}} >Group</span>) </p>
              <div style={{display:"flex"}} >
                <p className={styles.designation}>
                  {group.admin.name}{" "}
                </p>
                  <div className={styles.adminCap}>
                    <Image
                      src={cap}
                      alt="cap"
                       fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                  objectFit: "contain"
                }}
                    />
                  </div>
              </div>
            </div>
          </div>

          <div className={styles.invitationAccept}>
            <button
              className={`${styles.contestButton}  ${styles.contestButtonColor}`}
              onClick={() => requestReject(group?.groupId?._id)}
            >
              <input type="submit" value="Reject" />
            </button>
            <IoIosCloseCircle className={styles.closeInvitation}  onClick={() => requestReject(group?.groupId?._id)}/>

            <button
              className={`${styles.contestButton}  ${styles.contestButtonColor1}`}
              onClick={() => requestAccept(group?.groupId?._id)}
            >
              <input type="button" value="Accept" />
            </button>
            <IoIosCheckmarkCircle className={styles.checkInvitation} onClick={() => requestAccept(group?.groupId?._id)}/>
          </div>
        </div>
      )}
    </>
  );
}

export default InvitationGroups;
