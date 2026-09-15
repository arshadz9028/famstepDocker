import React, { useState, useContext, useEffect } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import axios from "axios";
import { ContextProvider } from "../../global/context";
import PostReport from "../post/PostReport";
import DeleteDialogeCollab from "../models/DeleteDialogeCollab";
import SendPost from "../../components/post/SendPost";
import { useRouter } from "next/router";
function EditCollab({
  setShowEditCollab,
  sessionUser,
  imageData,
  postId,
  mutateImageData,
  tDotId,
  showEditCollab,
  mutateComment,
  setOpenDetails,
  setIsEditCollab,
}) {
  const { EditCollabOpen, model, collabID, setcollabID } =
    useContext(ContextProvider);

  const [dialogDelete, setdialogDelete] = useState(false);
  const [dialogeReport, setdialogeReport] = useState(false);
  const [sendModel, setsendModel] = useState(false);
  const router = useRouter();
  const pathname = router.pathname.split("/")[1];
  const closeEditCollab = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "Home_wholeAction___mXMT") {
      setShowEditCollab(false);
      setdialogeReport(false);
    }
  };

  const OpenEditPhoto = (postId) => {
    setcollabID(postId);
    setOpenDetails(true);
    setIsEditCollab(true);
    setShowEditCollab(false);
  };

  const handleDelete = () => {
    setShowEditCollab(!showEditCollab);
    setdialogDelete(!dialogDelete);
  };

  const handleReport = () => {
    setShowEditCollab(!showEditCollab);
    setdialogeReport(!dialogeReport);
  };

  useEffect(() => {
    if (showEditCollab || dialogeReport || dialogDelete || sendModel || model) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [showEditCollab, dialogeReport, dialogDelete, sendModel, model]);

  const postQuery = "postDelete";
  return (
    <>
      {sendModel && <SendPost setsendModel={setsendModel} value={imageData} />}
      {dialogDelete && (
        <DeleteDialogeCollab
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

      {showEditCollab && (
        <div
          className={styles.wholeAction}
          id="Home_wholeAction___mXMT"
          onClick={closeEditCollab}
        >
          {sessionUser?.user?.id == imageData?.userid?._id ? (
            <div className={styles.mypic}>
              {pathname !== "message" && (
                <>
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
                </>
              )}

              {/* <div
                className={styles.icons_name}
                onClick={(e) => {setsendModel(true);setShowEditCollab(false);}}
              >
                <div className={styles.name}>
                  <p>Share</p>
                </div>
              </div> */}

              <div
                className={styles.icons_name}
                onClick={() => {
                  setShowEditCollab(false);
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
                  setShowEditCollab(false);
                }}
              >
                <div className={styles.name}>
                  <p>Copy Link</p>
                </div>
              </div> */}

              {/* <div
                className={styles.icons_name}
                onClick={(e) => {setsendModel(true);setShowEditCollab(false);}}
              >
                <div className={styles.name}>
                  <p>Share</p>
                </div>
              </div> */}
              <div
                className={styles.icons_name}
                onClick={() => {
                  setShowEditCollab(false);
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
export default EditCollab;
