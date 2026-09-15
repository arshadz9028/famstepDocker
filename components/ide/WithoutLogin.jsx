import React from "react";
import styles from "../../styles/ModalTemplate.module.scss";
import Link from "next/link";

function WithoutLogin({ setNoSessionPost }) {
    const closeModel = (e) => {
        const className = e.target.getAttribute("id");
        if (className === "wholeAction") {
            setNoSessionPost(false)

        }
    }

    return (
        <>
            <div className={styles.wholeAction} id="wholeAction" onClick={closeModel}>
                <div className={styles.mypic}>
                    <div className={styles.upper_sec}>
                        <p>
                            Unlock your potential! Log in or sign up to share your code with the world.
                        </p>
                    </div>
                    {/* <div className={styles.icons_name} > */}

                    {/* </div> */}
                    <Link href="/signup" className={styles.icons_name} >
                        <div className={styles.name}>
                            <p>Sign Up</p>
                        </div>
                    </Link>
                    
                    <div
                        className={styles.icons_name}
                        onClick={() => {
                            setNoSessionPost(false);
                        }}
                    >
                        <div className={styles.name}>
                            <p>Cancel</p>
                        </div>
                    </div>
                </div>{" "}
            </div>

        </>
    );
}

export default WithoutLogin;
