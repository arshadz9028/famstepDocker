import React, {useContext} from "react";
import styles from "../../styles/EditProfile.module.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoChevronBack } from "react-icons/io5";
import Link from "next/link";
import { ContextProvider } from "../../global/context";
function ClosePart({ CloseTheModal, title, linkBar }) {

 const {setZoom} = useContext(ContextProvider)

  const handleClose = () => {
    CloseTheModal(false);
    setZoom(true);
  }
  return (
    <>
      <div className={styles.closeButton}>
        {linkBar !== "" ? (
          <Link href={`/${linkBar}`}>
            <div className={styles.leftArrowButton}>
              <IoChevronBack className={styles.back_arrow} />
            </div>
          </Link>
        ) : (
          <div
            className={styles.leftArrowButton}
            onClick={handleClose}
          >
            <IoChevronBack className={styles.back_arrow} />
          </div>
        )}
        <p className={styles.upper_sec}>{title}</p>
        <AiOutlineCloseCircle
          className={styles.CloseCircleButton}
          onClick={handleClose}
        />
      </div>
    </>
  );
}

export default ClosePart;
