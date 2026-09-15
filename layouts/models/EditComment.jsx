import React, { useState, useContext } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { ContextProvider } from "../../global/context";
import { useRouter } from "next/router";
import ReportDialoge from "./userReport";

function EditComment({
  userName,
  sessionUser,
  modelPosition,
  userCommentId,
  mutateImageData,
  commentFetch
  
}) {
  const { CommentId, zoomId, dialogeReport, setdialogeReport, showEditComment, setshowEditComment } = useContext(ContextProvider);
  const Router = useRouter();
  const { userPostId } = Router.query;
  const commMap = commentFetch?.map((value) => value);
  const filteredCommentUser = commMap?.filter((cc) => cc._id === CommentId)[0];
  const commentOrReply = commentFetch?.find(
    (val) =>
      val._id === CommentId ||
      val.reply.some((reply) => reply._id === CommentId)
  );
  const replyToReply = commentOrReply?.reply.find(
    (reply) => reply._id === CommentId
  );
  const deleteCmment = async (e) => {
    e.preventDefault();

    try {
      if (replyToReply) {
        await axios.delete(
          `/api/home/comment/commentReply?createId=${zoomId}&userCommentId=${CommentId}`
        );
      } else {
        await axios.delete(`/api/home/comment/commentPost?createId=${zoomId}&userCommentId=${CommentId}`
        );
      }

      // Update the SWR cache directly
     

      setshowEditComment(false);
    } catch (error) {
      console.error(error);
    }
    mutateImageData()
  };

  const CloseModel = (e) => {
    const id = e.target.getAttribute("id");
    if (id === "editComment") {
      setshowEditComment(false);
    }
  };
 
  const handleRComent = () => {
    setshowEditComment(false);
    setdialogeReport(true);
  };

  return (
    <>
     {dialogeReport && (
     <ReportDialoge
        setdialogeReport={setdialogeReport}
        dialogeReport={dialogeReport}
        // userData={userData}
        messageId={zoomId}
      />)}
      {showEditComment && (
        <div className={styles.wholeAction} id='editComment' onClick={CloseModel}>
          {
            userName === filteredCommentUser?.user.username ||
          userName === replyToReply?.ReplyUser.username ||
          userName === commentFetch.map((user) => user.username) ? (
              <div className={styles.mypic} onClick={CloseModel} >
                <div className={styles.icons_name} onClick={deleteCmment}>
                  <div className={styles.name}>
                    <p>Delete</p>
                  </div>
                </div>

                <div
                  className={styles.icons_name}
                  onClick={() => {
                    setshowEditComment(false);
                  }}
                >
                  <div className={styles.name}>
                    <p>Cancel</p>
                  </div>
                </div>
              </div>
          ) : (
              <div className={styles.mypic}>
                <div className={styles.icons_name} onClick={handleRComent}>
                  <div className={styles.name}>
                    <p>Report</p>
                  </div>
                </div>
                <div
                  className={styles.icons_name}
                  onClick={() => {
                    setshowEditComment(false);
                  }}
                >
                  <div className={styles.name}>
                    <p>Cancel</p>
                  </div>
                </div>
              </div>
          )}
        </div>
      )}
    </>
  );
}

export default EditComment;
