import React from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import { useRouter } from "next/router";

function ExitCompiler({ exitCode, setExitcode,setsyntaxCode ,setSelectSkills}) {
  const router = useRouter()
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "wholeAction") {
      setExitcode(false)

    }
}
const handleExit = () => {
  router.push('/home') 
  setExitcode(false)
  setsyntaxCode('')
  localStorage.removeItem('selectedLanguage');

}
  return (
    <>
        {exitCode && <div className={styles.wholeAction} id="wholeAction" onClick={closeModel}>
          <div className={styles.mypic}>
            <div className={styles.upper_sec}>
              <p>
                Please make sure you have already submitted the code before
                exit.{" "}
              </p>
            </div>
            {/* <div className={styles.icons_name} > */}
            <div className={styles.icons_name} onClick={handleExit}>
              <div className={styles.name}>
                <p>Exit</p>
              </div>
            </div>
            {/* </div> */}
            <div
              className={styles.icons_name}
              onClick={() => {
                setExitcode(false);
              }}
            >
              <div className={styles.name}>
                <p>Cancel</p>
              </div>
            </div>
          </div>{" "}
        </div>}
    </>
  );
}

export default ExitCompiler;
