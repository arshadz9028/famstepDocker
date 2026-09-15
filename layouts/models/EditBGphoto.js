import React, { useRef, useContext } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { ContextProvider } from "../../global/context";
import background from "../../public/background.jpg"
import axios from "axios";
import { resizeImage } from '../../utils/resizeImage';

function EditBGphoto({ seteditBgPhoto }) {
    const { setselectBackground, setBgImage } = useContext(ContextProvider);
    const closeModel = (e) => {
       const className = e.target.getAttribute("id");
        if (className === "EditProfile_mainAction") {
            seteditBgPhoto(false);
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
            const maxWidth = 1200; // Set the desired maximum width
            const maxHeight = 1200; // Set the desired maximum height
            const resizedImage = await resizeImage(file, maxWidth, maxHeight);

            // Update the state with the resized image
            setBgImage(URL.createObjectURL(resizedImage));
            setselectBackground(resizedImage);
            seteditBgPhoto(false);

        }
    };

    const handleRemoveImage = async () => {
        setBgImage(background);
        setselectBackground(background);
        seteditBgPhoto(false);
        try {
            await axios.delete('/api/profile/delete/deleteBackground')
            
        } catch (error) {
            
        }
    };

    return (
        <>

            <div className={styles.wholeAction} id='EditProfile_mainAction' onClick={closeModel}>
                <div className={styles.mypic}>
                    <div className={styles.icons_name} onClick={handleProfileImage}>
                        <div className={styles.name}>
                            <p>Change Background Image</p>
                        </div>
                    </div>
                    <div className={styles.icons_name} onClick={handleRemoveImage}>
                        <div className={styles.name}>
                            <p>Remove Background Image</p>
                        </div>
                    </div>
                    <div className={styles.icons_name} onClick={() => seteditBgPhoto(false)}>
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

export default EditBGphoto
