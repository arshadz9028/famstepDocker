import React, {  useState } from "react";
import styles from "../../styles/Ide.module.scss";
import Image from "next/image";
import folder from "../../assets/icons/folder.png";
import openfolder from "../../assets/icons/open-folder.png";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { FcQuestions } from "react-icons/fc";
import { useRouter } from "next/router";

function FileSystem({
  selectedLang,
  setprobClicked,
  setCodeClicked,
  userTheme,
  session,
  playHandle,
}) {
  const [arrowClick, setArrowClick] = useState(false);
  const handleArrow = () => {
    setArrowClick(!arrowClick);
  };
  const router = useRouter();
  const rQuery = router.pathname.split("/")[1];
  return (
    <div
      className={styles.list_view}
      style={{ background: userTheme === "vs-light" && "#d4d4d4" }}
    >
      <div
        className={styles.folder}
        style={{ color: userTheme === "vs-light" ? "#000000" : "#ffffff" }}
      >
        <div onClick={handleArrow} className={styles.arrow}>
          {!arrowClick ? (
            <FiChevronRight className={styles.down_arrow} />
          ) : (
            <FiChevronDown className={styles.down_arrow} />
          )}
        </div>

        <div
          className={styles.folder_name}
          style={{ color: userTheme === "vs-light" ? "#000000" : "#ffffff" }}
        >
          {!arrowClick ? (
            <div className={styles.cover_folderHandle}>
              <Image
                src={folder}
                className={styles.folder_handle}
                 fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                  objectFit: "contain"
                }}
                alt=""
              />
            </div>
          ) : (
            <div className={styles.cover_folderHandle}>
              <Image
                src={openfolder}
                className={styles.folder_handle}
                 fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                  objectFit: "contain"
                }}
                alt=""
              />
            </div>
          )}

          <p>{session ? session.user.username : "Guest"}</p>
        </div>
      </div>
      {arrowClick && (
        <div className={styles.files}>
          <div className={styles.verticleLine}></div>
          <div className={styles.file_handle}>
            {rQuery === "ideCode" && (
              <div
                className={styles.prob_file}
                style={{
                  color: userTheme === "vs-light" ? "#000000" : "#ffffff",
                }}
                onClick={() => {
                  setCodeClicked(false);
                  setprobClicked(true);
                }}
              >
                <FcQuestions className={styles.pp} />
                <p>problem</p>
              </div>
            )}
            {!playHandle && (
              <div
                className={styles.sol_file}
                style={{
                  color: userTheme === "vs-light" ? "#000000" : "#ffffff",
                }}
                onClick={() => {
                  setprobClicked(false);
                  setCodeClicked(true);
                }}
              >
                <BsFileEarmarkCodeFill className={styles.sf} />
                <p>main{selectedLang?.extension}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileSystem;
