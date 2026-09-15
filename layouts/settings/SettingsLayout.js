import React, { useContext } from "react";
import styles from "../../styles/earning.module.scss";
import Link from "next/link";
import ClosePart from "../../components/profileComp/ClosePart";
import { ContextProvider } from "../../global/context";
import { TbUserEdit, TbHelp } from "react-icons/tb";
import {
  MdDeleteOutline,
  MdOutlinePrivacyTip,
  MdOutlineBlock,
  MdOutlineFeedback
} from "react-icons/md";
import { VscSignOut } from "react-icons/vsc";
import { signOut } from "next-auth/react";

function SettingsLayout({ selected }) {
  const { earningToggle, setEarningToggle } = useContext(ContextProvider);
  const SignOut = async() =>{
  
    const timestamp = new Date(); // Capture the current time
    try {
      await axios.put("/api/user/userStatus", {
        isActive: false,
        timestamp,
        userId: session?.user?.id,
      });
      await axios.put("/api/auth/signup/trueUpdateProfile")
      signOut();
      
    } catch (error) {
      signOut();

    }
  
}
  return (
    <>
      <div
        className={styles.Wrapper}
        style={!earningToggle ? { display: "block" } : {}}
      >
        <div className={styles.sideBarMobHeader}>
          <ClosePart title={"Settings and privacy"} linkBar={"home"} />
        </div>
        <div className={styles.sideBar}>
          <Link href="/me/settings">
            <div
              className={
                selected === "editProfile"
                  ? styles.activeAnalytics
                  : styles.analytics
              }
              onClick={() => setEarningToggle(!earningToggle)}
            >
              <TbUserEdit className={styles.analyticsICons} />
              <p>Edit Profile</p>
            </div>
          </Link>

          <Link href="/me/settings/blockPage">
            <div
              className={
                selected === "blocked"
                  ? styles.activeAnalytics
                  : styles.analytics
              }
              onClick={() => setEarningToggle(!earningToggle)}
            >
              <MdOutlineBlock className={styles.analyticsICons} />
              <p>Blocked Users</p>
            </div>
          </Link>

          <Link target="blank" href="/feedback">
            <div
              className={
                selected === "feedback"
                  ? styles.activeAnalytics
                  : styles.analytics
              }
              onClick={() => setEarningToggle(!earningToggle)}
            >
              <MdOutlineFeedback className={styles.analyticsICons} />
              <p>Feedback</p>
            </div>
          </Link>

          {/* <Link href="/me/settings/deleteAcc">
            <div
              className={
                selected === "Delete"
                  ? styles.activeAnalytics
                  : styles.analytics
              }
              onClick={() => setEarningToggle(!earningToggle)}
            >
              <MdDeleteOutline className={styles.analyticsICons} />
              <p>Delete Account</p>
            </div>
          </Link> */}

          {/* <Link href="/me/settings/help">
            <div
              className={
                selected === "help" ? styles.activeAnalytics : styles.analytics
              }
              onClick={() => setEarningToggle(!earningToggle)}
            >
              <TbHelp className={styles.analyticsICons} />
              <p>Help Center</p>
            </div>
          </Link> */}
          {/* <Link href="/me/settings/privacyCenter">
            <div
              className={
                selected === "privacy"
                  ? styles.activeAnalytics
                  : styles.analytics
              }
              onClick={() => setEarningToggle(!earningToggle)}
            >
              <MdOutlinePrivacyTip className={styles.analyticsICons} />
              <p>User Privacy</p>
            </div>
          </Link> */}

          <div
            className={
              selected === "signout" ? styles.activeAnalytics : styles.analytics
            }
            onClick={SignOut}
          >
            <VscSignOut className={styles.analyticsICons} />
            <p>Sign Out</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsLayout;
