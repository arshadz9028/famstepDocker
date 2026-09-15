import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/EditProfile.module.scss";
import Image from "next/image";
import { ContextProvider } from "../global/context";
import axios from "axios";
import { useRouter } from "next/router";
import { ImCheckboxChecked } from "react-icons/im";
import { ImCheckboxUnchecked } from "react-icons/im";
import { RxCrossCircled } from "react-icons/rx";
import ClosePart from "../components/profileComp/ClosePart";

function EditSocial({
  editSocial,
  setEditSocial,
  userAbout,
  mutateuserFetchData,
}) {
  const { selectImage, setselectImage, BgImage, setBgImage } =
    useContext(ContextProvider);

  const [facebook, setfacebook] = useState(userAbout?.social?.facebook);
  const [linkdIn, setlinkdIn] = useState(userAbout?.social?.linkdIn);
  const [github, setgithub] = useState(userAbout?.social?.github);
  const [twitter, settwitter] = useState(userAbout?.social?.twitter);
  const [Instagram, setInstagram] = useState(userAbout?.social?.Instagram);

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "main") {
      setEditSocial(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/user/addSocial", {
        twitter,
        linkdIn,
        facebook,
        github,
        Instagram,
      });
    } catch (error) {}

    setEditSocial(false);
    mutateuserFetchData();
  };
  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (editSocial) {
      document.body.style.overflow = "hidden";
      setEditSocial(true);
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [editSocial]);
  return (
    <>
      {editSocial && (
        <div className={styles.main} id="main" onClick={closeModel}>
          <div className={styles.fullEditSocial} >
          <ClosePart  title={"Link Socialmedia Accounts" } CloseTheModal={setEditSocial}  />

            <form className={styles.upperPortion}>
              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="facebook"
                  name="facebook"
                  required="required"
                  value={facebook}
                  onChange={(e) =>{
                    const value = e.target.value;
                    if (value.startsWith("https://")) {
                      setfacebook(value)
                  } else {
                   setfacebook(`https://${value}`);

                  }
                   }}
                />
                <span className={styles.label}>Facebook</span>
                <div
                  className={styles.crossBtnContainer}
                  onClick={() => setfacebook("")}
                >
                  <RxCrossCircled className={styles.crossBtn} />
                </div>
              </div>

              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="linkdIn"
                  name="linkdIn"
                  required="required"
                  value={linkdIn}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith("https://")) {
                      setlinkdIn(e.target.value);
                    } else {
                      setlinkdIn(`https://${value}`);
                    }
                  }}
                />
                <span className={styles.label}>LinkdIn</span>
                <div
                  className={styles.crossBtnContainer}
                  onClick={() => setlinkdIn("")}
                >
                  <RxCrossCircled className={styles.crossBtn} />
                </div>
              </div>
              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="github"
                  name="github"
                  required="required"
                  value={github}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith("https://")) {
                      setgithub(e.target.value);
                    } else {
                      setgithub(`https://${value}`);
                    }
                  }}
                />
                <span className={styles.label}>Github</span>
                <div
                  className={styles.crossBtnContainer}
                  onClick={() => setgithub("")}
                >
                  <RxCrossCircled className={styles.crossBtn} />
                </div>
              </div>
              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="twitter"
                  name="twitter"
                  required="required"
                  value={twitter}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith("https://")) {
                      settwitter(e.target.value);
                    } else {
                      settwitter(`https://${value}`);
                    }
                  }}
                />
                <span className={styles.label}>Twitter</span>
                <div
                  className={styles.crossBtnContainer}
                  onClick={() => settwitter("")}
                >
                  <RxCrossCircled className={styles.crossBtn} />
                </div>
              </div>
              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="Instagram"
                  name="Instagram"
                  required="required"
                  value={Instagram}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith("https://")) {
                      setInstagram(value);
                    } else {
                      setInstagram(`https://${value}`);
                    }
                  }}
                />
                <span className={styles.label}>Instagram</span>
                <div
                  className={styles.crossBtnContainer}
                  onClick={() => setInstagram("")}
                >
                  <RxCrossCircled className={styles.crossBtn} />
                </div>
              </div>

              <div className={styles.input_bxButton}>
                <button onClick={onSubmit} type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default EditSocial;
