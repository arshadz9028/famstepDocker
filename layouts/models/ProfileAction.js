import React, { useState, useContext, useEffect } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import axios from "axios";
import BlockDialoge from "./BlockDialoge";
import UserReport from "./userReport";
import { useRouter } from "next/router";
import { ContextProvider } from "../../global/context";
import useSWR,{mutate} from "swr";
import Link from "next/link";
function ProfileAction({
  prfAction,
  setPrfAction,
  userData,
  blockedUser2,
  message,
  profileChatId,
}) {
  const { setToggle, handleChatClick, dialogeReport, setdialogeReport } =
  useContext(ContextProvider);
  const [dialogBlock, setdialogBlock] = useState(false);

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "Profile_wholeAction__tGitV") {
      setPrfAction(false);
    }
  };

  const Router = useRouter();
  const { profile } = Router.query;
  const blockList = blockedUser2?.blockedIds.some(
    (user) => user.userId === profile
  );
  /* handle block user */
  const handleBlock = () => {
    setPrfAction(false);
    setdialogBlock(!dialogBlock);
  };

  const handleunBlock = async () => {
    await axios.delete(`/api/profile/follow/blockUser?message=${message}`);
   mutate(`/api/message/messageFetch/?message=${message}`)
    // setisBlock(!isBlock)
    setPrfAction(false);
  };

  /* handle report */
  const handleReport = async () => {
    setdialogeReport(!dialogeReport);
    setPrfAction(false);
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (prfAction || dialogBlock || dialogeReport) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [prfAction, dialogeReport, dialogBlock]);
  const chatWithSelected = async () => {
    if (!profileChatId) {
      try {
        const res = await axios.post(`/api/message/chat`, {
          newSelected: profile,
        });
        await Router.push(`/message/${res.data._id}`);
        handleChatClick(res.data._id);
        // props.setNewmessage(false);
        setToggle(true);
      } catch (error) {
        return <> Failed to load profile page. </>;
      }
    }else{
      Router.push(`/message/${profileChatId}`);
    }
  };
  return (
    <>
      {dialogBlock && (
        <BlockDialoge
          setdialogBlock={setdialogBlock}
          userData={userData}
          otherUserId={message}
        />
      )}

      {dialogeReport && (
        <UserReport
          setdialogeReport={setdialogeReport}
          dialogeReport={dialogeReport}
          userData={userData}
          messageId={message}
        />
      )}

      {prfAction ? (
        <div
          className={styles.wholeAction}
          id="Profile_wholeAction__tGitV"
          onClick={closeModel}
        >
          <div className={styles.mypic}>
            <div className={styles.icons_name} onClick={handleReport}>
              <div className={styles.name}>
                <p>Report</p>
              </div>
            </div>

            {!blockList ? (
              <div className={styles.icons_name} onClick={handleBlock}>
                <div className={styles.name}>
                  <p>Block</p>
                </div>
              </div>
            ) : (
              <div className={styles.icons_name} onClick={handleunBlock}>
                <div className={styles.name}>
                  <p>Unblock</p>
                </div>
              </div>
            )}

            <div className={styles.icons_name} onClick={chatWithSelected}>
              <div className={styles.name}>
                <p>Message</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default ProfileAction;
