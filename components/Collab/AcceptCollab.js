import { React, useState } from "react";
import styles from "../../styles/Home.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import ViewProposal from "./ViewProposal";

function AcceptCollab({
  userData,
  followusername,
  collabID,
  session,
  setViewProp, setPropData,
  setShowMobileSidebar
}) {
  // const [viewProp, setViewProp] = useState(false);
  const router = useRouter();

  const followRequest = (e) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    setViewProp(true);
    setPropData(userData)
  };
  const reqIdd = userData?._id;


  const userId = userData?.userid._id;
  return (
    <>
      {/* {viewProp && <ViewProposal setViewProp={setViewProp} />} */}
      <div
        className={styles.userDetails}
       // Trigger only for clicks outside the button
      >
        <div className={styles.userImageSuggestion}>
          <Image
            src={userData?.userid.image}
            priority
            alt="userImage"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
        <div className={styles.userName_suggestion}>
          <div
            className={styles.userName_suggestionWrap}
          >
            <p className={styles.username}>
              {userData?.userid.name?.length >= 14
                ? `${userData?.userid.name.slice(0, 12)}...`
                : userData?.userid.name}
            </p>
            <p className={styles.designation}>
              {userData?.userid.designation?.length >= 18
                ? `${userData?.userid.designation?.slice(0, 17)}...`
                : userData?.userid.designation}
            </p>
          </div>
          {/* View Proposal Button */}
          {!userData?.IsAccepted ?
            <button onClick={(e) => { followRequest(e)
            // ,setShowMobileSidebar(false) //temp commented
            }}>View Proposal</button> :
            <button disabled>Accepted</button>
          }
        </div>
      </div>
    </>
  );
}

export default AcceptCollab;
