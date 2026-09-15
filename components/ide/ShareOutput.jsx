import React from "react";
import styles from "../../styles/ModalTemplate.module.scss";

function ShareOutput({ setShareOutput }) {
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "wholeAction") {
      setShareOutput(false)

    }
}

  return (
    <>
        <div className={styles.wholeAction} id="wholeAction" onClick={closeModel}>
          <div className={styles.mypic}>
            <div className={styles.upper_sec}>
              <p>
              Choose a language, write, and run your code before posting!
              </p>
            </div>
            {/* <div className={styles.icons_name} > */}
           
            {/* </div> */}
            <div
              className={styles.icons_name}
              onClick={() => {
                setShareOutput(false);
              }}
            >
              <div className={styles.name}>
                <p>Okay</p>
              </div>
            </div>
          </div>{" "}
        </div>
     
    </>
  );
}

export default ShareOutput;
