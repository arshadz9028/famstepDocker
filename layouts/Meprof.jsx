import React, { useContext } from "react";
import styles from "../styles/Navbar.module.scss";
import Link from "next/link";
import { VscSignOut } from "react-icons/vsc";
import { signOut } from "next-auth/react";
import { ContextProvider } from "../global/context";
import axios from "axios";
//write a code sum of two number

function Meprof({ setMeproficon, session, userData }) {
  const { switchAccount, setSwitchAccount } = useContext(ContextProvider);

  const SignOut = async () => {

    const timestamp = new Date(); // Capture the current time
    try {
      await axios.put("/api/user/userStatus", {
        isActive: false,
        timestamp,
        userId: session?.user?.id,
      });
      await axios.put("/api/auth/signup/trueUpdateProfile")
      signOut();

    } catch (error) {
      signOut();

    }

  }
  return (
    <>
      <div className={styles.mypic}>
        <Link href={userData?._id === '67f7c821696aed22412e4b06' ? `/me/famstep` : "/me"}>
          <div className={styles.icons_name}>
            <div className={styles.icons}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={styles.profIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {(userData?.designation === "" ||
                userData?.location === "" ||
                userData?.skills.length === 0) && (
                  <div className={styles.UnfinishedDot1} />)}
            </div>
            <div className={styles.name}>
              <p>Profile</p>
            </div>

          </div>
        </Link>
        <Link href={"/me/project"}>
          <div className={styles.icons_name}>
            <div className={styles.icons}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className={styles.profIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                />
              </svg>
            </div>

            <div className={styles.name}>
              <p>Projects</p>
            </div>
          </div>
        </Link>
        {/* <Link href={''}>
                    <div className={styles.icons_name}  >
                        <div className={styles.icons}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={styles.profIcon}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                            </svg>

                        </div>

                        <div className={styles.name}>
                            <p>Unit Questions</p>
                        </div>
                    </div>
                </Link> */}
        {/* <Link href={"/me/earnings"}>
          <div className={styles.icons_name}>
            <div className={styles.icons}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className={styles.profIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div className={styles.name}>
              <p>My earnings</p>
            </div>
          </div>
        </Link> */}
        {/* <Link href={"/me/projects"}>
          <div className={styles.icons_name}>
            <div className={styles.icons}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className={styles.profIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div className={styles.name}>
              <p>My Projects</p>
            </div>
          </div>
        </Link> */}
        {/* <div
          className={styles.icons_name}
          onClick={() => {
            setSwitchAccount(!switchAccount);
            setMeproficon(false);
          }}
          style={{ borderBottom: "1px solid #F1F0ED" }}
        >
          <div className={styles.icons}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className={styles.profIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
          </div>

          <div className={styles.name}>
            <p>Switch to business</p>
          </div>
        </div> */}
        <Link href={"/me/settings"}>
          <div className={styles.icons_name}>
            <div className={styles.icons}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className={styles.profIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            <div className={styles.name}>
              <p>Settings</p>
            </div>
          </div>
        </Link>
        <div
          className={styles.icons_name}
          onClick={SignOut}
        >
          <div className={styles.icons}>
            <VscSignOut style={{ width: "100%", height: "100%" }} />
          </div>

          <div className={styles.name}>
            <p>Sign Out</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Meprof;
