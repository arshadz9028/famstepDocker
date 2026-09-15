import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import axios from "axios";
import DeleteDialoge from "../models/DeleteDialoge";
import BlockDialoge from "../models/BlockDialoge";
import UserReport from "../models/userReport";
import { useRouter } from "next/router";
function MessageAction({
  messageAction,
  setmessageAction,
  userData,
  messageId,
  blockedUser2,
  otherUserId,mutateuserFetchMsg
}) {
  const [dialogDelete, setdialogDelete] = useState(false);
  const [dialogBlock, setdialogBlock] = useState(false);
  const [dialogeReport, setdialogeReport] = useState(false);

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "messageModel") {
      setmessageAction(false);
    }
  };

  const Router = useRouter();
  const { message } = Router.query;
  const blockList = blockedUser2?.blockedIds.some(
    (user) => user.userId === otherUserId
  );

  const handleDelete = () => {
    setmessageAction(false);
    setdialogDelete(!dialogDelete);
  };

  /* handle block user */
  const handleBlock = () => {
    setmessageAction(false);
    setdialogBlock(!dialogBlock);
  };

  const handleunBlock = async () => {
    await axios.delete(`/api/profile/follow/blockUser?message=${otherUserId}`);
    setmessageAction(false);
    mutateuserFetchMsg()
    // Router.push({
    //   pathname: "/message/[message]",
    //   query: { message }, // Pass the query parameter to the new route
    // });
  };

  /* handle report */
  const handleReport = async () => {
    setdialogeReport(!dialogeReport);
    setmessageAction(false);
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (messageAction ||dialogBlock|| dialogeReport || dialogDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [messageAction, dialogeReport,dialogBlock, dialogDelete]);

  return (
    <>
      {dialogDelete && (
        <DeleteDialoge
          setdialogDelete={setdialogDelete}
          message={otherUserId}
        />
      )}

      {dialogBlock && (
        <BlockDialoge
          setdialogBlock={setdialogBlock}
          userData={userData}
          otherUserId={otherUserId}
          mutateuserFetchMsg={mutateuserFetchMsg}
        />
      )}

      {dialogeReport && (
        <UserReport setdialogeReport={setdialogeReport} messageId={messageId} otherUserId={otherUserId}/>
      )}

      {messageAction ? (
        <div
          className={styles.wholeAction}
          id="messageModel"
          onClick={closeModel}
        >
          <div className={styles.mypic}>
            <div className={styles.icons_name} onClick={handleDelete}>
              <div className={styles.name}>
                <p>Delete Chat</p>
              </div>
            </div>
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
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default MessageAction;
