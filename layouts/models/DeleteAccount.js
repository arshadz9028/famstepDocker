import React, { useContext, useEffect } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { useRouter } from "next/router";
import axios from "axios";
import { ContextProvider } from "../../global/context";
import useSWR ,{mutate} from "swr";

function DeleteAccount({
  setdialogDelete,
  dialogDelete,
 
}) {
  const { setMessagesend } = useContext(ContextProvider);

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
  const response = await axios.delete('/api/user/deleteUser')
   
    setdialogDelete(false);
    if(response.success === 'true'){
        router.push(`/`)
    }
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
            <p>Please confirm for initiating deletion process</p>
          </div>

          <div className={styles.icons_name} onClick={handleDelete}>
            <div className={styles.name}>
              <p style={{ color: "red" }}>Confirm</p>
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

export default DeleteAccount;
