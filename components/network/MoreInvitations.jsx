import React, { useState } from 'react'
import styles from "../../styles/EditProfile.module.scss";
import ClosePart from "../../components/profileComp/ClosePart";
import Invitation from "../../components/network/Invitation"
import InvitationGroups from "../../components/network/InvitationGroups";


function MoreInvitations({ setInvitations, invitations, followerData, mutatefollowerData }) {


  const closeModel = (e) => {
    if (e.target.id === 'main') {
      setInvitations(false);
    }
  };


  return (
    <>
      <div className={styles.main} id='main' onClick={closeModel}>
        <div className={`${styles.InvitationFullEdit} ${styles.fullEdit}`}  >
          <ClosePart title={'Invitations'} CloseTheModal={setInvitations} />
          <div className={styles.MoreCards}>

            {followerData?.data?.followRequests.map((req, index) => (

              <Invitation follow={req} index={index} key={req._id} mutatefollowerData={mutatefollowerData}
                followerData={followerData} followusername={req.userid} invitations={invitations}
              />
            ))}
            {followerData?.data?.groupInvites.map((req, index) => {
                return (
                  <>
                    {!req.IsAcctdInvite &&
                      <InvitationGroups
                        group={req}
                        grpindex={index}
                        key={req._id}
                        mutatefollowerData={mutatefollowerData}
                        followerData={followerData}
                        followusername={req.admin}
                      />
                    }
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </>
  )
}

export default MoreInvitations
