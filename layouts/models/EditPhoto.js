import React, { useRef, useContext } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { ContextProvider } from "../../global/context";
import defaultpic from "../../public/default.png";
import { resizeImage } from "../../utils/resizeImage";
import axios from "axios";
function EditPhoto({ editPhot, seteditPhot, fetchAndConvertImage }) {
  const { setSelectedFile, selectImage, setselectImage, selectedFile } =
    useContext(ContextProvider);
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "EditProfile_mainAction__ciZsC") {
      seteditPhot(false);
    }
  };

  const fileInputRef = useRef(null);

  const handleProfileImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxWidth = 400; // Set the desired maximum width
      const maxHeight = 400; // Set the desired maximum height
      const resizedImage = await resizeImage(file, maxWidth, maxHeight);

      // Update the state with the resized image
      setselectImage(URL.createObjectURL(resizedImage));
      setSelectedFile(resizedImage);
      seteditPhot(false);
    }
  };

  const handleRemoveImage = async () => {
    setselectImage(defaultpic);
    setSelectedFile(defaultpic);
    seteditPhot(false);
    try {
      await axios.delete("/api/profile/delete/deleteProfileImage");
    } catch (error) {
      console.log('error', error)
    }
  };

  return (
    <>
      <div
        className={styles.wholeAction}
        id="EditProfile_mainAction__ciZsC"
        onClick={closeModel}
      >
        <div className={styles.mypic}>
          <div className={styles.icons_name} onClick={handleProfileImage}>
            <div className={styles.name}>
              <p>Change Profile Image</p>
            </div>
          </div>
          <div className={styles.icons_name} onClick={handleRemoveImage}>
            <div className={styles.name}>
              <p>Remove Profile Image</p>
            </div>
          </div>
          <div className={styles.icons_name} onClick={() => seteditPhot(false)}>
            <div className={styles.name}>
              <p>Cancel</p>
            </div>
          </div>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </>
  );
}

export default EditPhoto;
