import React, { useContext, useEffect } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { useRouter } from "next/router";
import { ContextProvider } from "../../global/context";
import axios from "axios";
import { mutate } from "swr";
function DeleteDialoge({
  setdialogDelete,
  dialogDelete,
  tDotId,
  mutateImageData,
  postQuery,
}) {
  const { setmodel } = useContext(ContextProvider);

  const router = useRouter();
  const { message } = router.query;
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "deleteModel") {
      setdialogDelete(false);
    }
  };
  const messagePath = router.pathname.split("/")[1];
  const handleDelete = async () => {
    try {
      if (messagePath === "message") {

        await axios.delete(`/api/message/deleteMessage?message=${message}`);
        
        router.push(`/message`);
      } else if (postQuery === "postDelete") {
        await axios.delete(`/api/home/post/${tDotId}`);
        // mutate((index) => `/api/home/imageGallery?page=${index + 1}&limit=5`);
        mutateImageData();
      }
    } catch (error) {
      console.error(error);
    }
    setdialogDelete(false);
    setmodel(false);
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (dialogDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [dialogDelete]);

  return (
    <>
      <div className={styles.wholeAction} id="deleteModel" onClick={closeModel}>
        <div className={styles.mypic}>
          <div className={styles.upper_sec}>
            <p>Are you sure you want to delete?</p>
          </div>

          <div className={styles.icons_name} onClick={handleDelete}>
            <div className={styles.name}>
              <p style={{ color: "red" }}>Delete</p>
            </div>
          </div>

          <div
            className={styles.icons_name}
            onClick={() => {
              setdialogDelete(false);
            }}
          >
            <div className={styles.name}>
              <p>Cancel</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteDialoge;
