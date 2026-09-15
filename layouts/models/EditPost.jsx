import React, { useState, useContext, useEffect } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import axios from "axios";
import { ContextProvider } from "../../global/context";
import PostReport from "../post/PostReport";
import DeleteDialoge from "../models/DeleteDialoge";
import SendPost from "../../components/post/SendPost";
import { useRouter } from "next/router";
function EditPost({
  setShowEditPost,
  sessionUser,
  imageData,
  postId,
  mutateImageData,
  tDotId,
  showEditPost,mutateComment
}) {
  const {
    EditpostOpen,
    model
  } = useContext(ContextProvider);
  const [dialogDelete, setdialogDelete] = useState(false);
  const [dialogeReport, setdialogeReport] = useState(false);
  const [sendModel, setsendModel] = useState(false);
  const router = useRouter();
  const pathname = router.pathname.split('/')[1]
  const disableComment = async () => {
    try {
      await axios.post(
        `/api/home/comment/disableCommenting?createId=${tDotId}`
      );
      if(!model){

        mutateImageData();
      }else{
        mutateComment()
      }
    } catch (error) {
      console.error(error);
    }
    setShowEditPost(false);
  };

  const closeEditPost = (e) => {
    // Check if e is undefined or null and provide a default value if needed
    const className = e.target.getAttribute("id");
    if (className === "Home_wholeAction___mXMT") {
      setShowEditPost(false);
      setdialogeReport(false);
    }
  };

  const OpenEditPhoto = (postId) => {
    // I removed the postId parameter as it's not being used here.
    EditpostOpen(postId);
    setShowEditPost(false);
  };
  
  const handleDelete = () => {

    setShowEditPost(!showEditPost);
    setdialogDelete(!dialogDelete);
  };

  /* handle report */
  const handleReport = () => {
    setShowEditPost(!showEditPost);
    setdialogeReport(!dialogeReport);
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (showEditPost || dialogeReport || dialogDelete || sendModel || model ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [showEditPost, dialogeReport, dialogDelete, sendModel, model]);

  const postQuery = "postDelete";
  return (
    <>
       
      {/* )} */}
      {dialogDelete && (
        <DeleteDialoge
          setdialogDelete={setdialogDelete}
          dialogDelete={dialogDelete}
          tDotId={tDotId}
          mutateImageData={mutateImageData}
          postQuery={postQuery}
        />
      )}

      {dialogeReport && (
        <PostReport
          userId={imageData.userid._id}
          setdialogeReport={setdialogeReport}
          tDotId={tDotId}
        />
      )}

      {showEditPost && (
        <div
          className={styles.wholeAction}
          id="Home_wholeAction___mXMT"
          onClick={closeEditPost}
        >
          {sessionUser?.user?.id == imageData?.userid?._id ? (
            <div className={styles.mypic}>
            {pathname !== 'message' && <>
                <div className={styles.icons_name} onClick={handleDelete}>
                  <div className={styles.name}>
                    <p>Delete</p>
                  </div>
                </div>
                
                 <div
                  className={styles.icons_name}
                  onClick={() => {
                    OpenEditPhoto(postId);
                  }}
                >
                  <div className={styles.name}>
                    <p>Edit</p>
                  </div>
                </div>
              </>}

              <div className={styles.icons_name} onClick={disableComment}>
                <div className={styles.name}>
                  {imageData?.commentsEnable === false ? (
                    <p>Enable commenting</p>
                  ) : (
                    <p>Disable commenting</p>
                  )}
                </div>
              </div>

              {/* <div
                className={styles.icons_name}
                onClick={() => {
                  handleCopy();
                  setShowEditPost(false);
                }}
              >
                <div className={styles.name}>
                  <p>Copy Link</p>
                </div>
              </div> */}

            
              <div
                className={styles.icons_name}
                onClick={() => {
                  setShowEditPost(false);
                }}
              >
                <div className={styles.name}>
                  <p>Cancel</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.mypic}>
              <div className={styles.icons_name} onClick={handleReport}>
                <div className={styles.name}>
                  <p>Report</p>
                </div>
              </div>
              {/* <div
                className={styles.icons_name}
                onClick={() => {
                  handleCopy();
                  setShowEditPost(false);
                }}
              >
                <div className={styles.name}>
                  <p>Copy Link</p>
                </div>
              </div> */}

              <div
                className={styles.icons_name}
                onClick={() => {
                  setShowEditPost(false);
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
export default EditPost;
