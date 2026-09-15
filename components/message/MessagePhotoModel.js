import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import Image from "next/image";
import { ContextProvider } from "../../global/context";
import { imageAspectRatio } from "../../utils/imageAspectRatio";
import { IoCloseCircleSharp } from "react-icons/io5";

function MessagePhotoModel({ }) {

    const { messagePhotoUrl, setMessagePhoto } = useContext(ContextProvider)

    const closeModel = (e) => {
        const className = e.target.getAttribute("id");
        if (className === "messageModel") {
            setMessagePhoto(false);
        }
    };


    // useEffect(() => {
    //     // Prevent BODY from scrolling when a modal is opened
    //     if (messageAction || dialogBlock || dialogeReport || dialogDelete) {
    //         document.body.style.overflow = "hidden";
    //     } else {
    //         document.body.style.overflow = "unset";
    //         document.body.style.overflowX = "hidden";
    //     }
    // }, [messageAction, dialogeReport, dialogBlock, dialogDelete]);

    const [imageHeight, setImageHeight] = useState({
        width: "",
        height: "",
    });

    const useWidth = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width < 280) {
                useWidth.current = 250;
            } else if (width <= 429) {
                useWidth.current = 380;
            } else if (width <= 472) {
                useWidth.current = 430;
            } else if (width <= 680) {
                useWidth.current = 520;
            } else if (width <= 970) {
                useWidth.current = 600;
            } else if (width < 1193) {
                useWidth.current = 700;
            } else {
                useWidth.current = 800; // Default width if none of the conditions are met
            }
        };

        const callAsyncFunc = async () => {
            handleResize();
            window.addEventListener("resize", handleResize);
            const AspectRatio = await imageAspectRatio(
                messagePhotoUrl,
                550,
                useWidth.current
            );
            setImageHeight({ width: AspectRatio.width, height: AspectRatio.height });
        };

        callAsyncFunc();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [messagePhotoUrl]);

    return (
        <>
            <div
                className={styles.wholeActionPhoto}
                id="messageModel"
                onClick={closeModel}
            >
                <IoCloseCircleSharp
                    className={styles.close_full_Section}
                    onClick={() => {
                        setMessagePhoto(false);
                    }}
                />

                <div className={styles.mypicOpen}
                    style={{
                        width: `${imageHeight.width}px`,
                        height: `${imageHeight.height}px`,

                    }}
                >

                    <Image
                        src={messagePhotoUrl}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                            objectFit: "contain",
                        }}
                        alt="SharedImages"

                    />

                </div>
            </div>

        </>
    );
}
export default MessagePhotoModel;