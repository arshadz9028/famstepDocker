import React from "react";
import styles from "../../styles/Ide.module.scss";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

function IdeSettings({ setSettings, settings, userTheme, setUserTheme }) {
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "Ide_settingAction__xpTMo") {
      setSettings(false);
    }
  };
  return (
    <>
      {settings && <div
        className={styles.settingAction}
        id="Ide_settingAction__xpTMo"
        onClick={closeModel}
      >
        <div className={styles.messageAction}>
          <div
            className={styles.lightThem}
            onClick={() => {
              setUserTheme("vs-light");
              setSettings(false);
            }}
          >
            <MdLightMode
              style={{
                color: userTheme === "vs-light" ? "#08529B" : "#ffffff",
              }}
              className={styles.icons_name}
            />
            <p>Light Mode</p>
          </div>
          <div
            className={styles.darkThem}
            onClick={() => {
              setUserTheme("vs-dark");
              setSettings(false);
            }}
          >
            <MdDarkMode
              style={{ color: userTheme === "vs-dark" ? "#08529B" : "#ffffff" }}
              className={styles.icons_name}
            />
            <p>Dark Mode</p>
          </div>
        </div>
      </div>}
    </>
  );
}

export default IdeSettings;
