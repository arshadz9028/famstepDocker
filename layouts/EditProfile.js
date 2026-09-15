import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/EditProfile.module.scss";
import Image from "next/image";
import EditPhoto from "./models/EditPhoto";
import EditBGphoto from "./models/EditBGphoto";
import { ContextProvider } from "../global/context";
import axios from "axios";
import { useRouter } from "next/router";
import ClosePart from "../components/profileComp/ClosePart";
import { message } from "antd";
function EditProfile({
  editDetail,
  setEditDetail,
  userData,
  mutateuserFetchData,
}) {
  const {
    selectBackground,
    selectedFile,
    selectImage,
    setselectImage,
    BgImage,
    setBgImage,
  } = useContext(ContextProvider);
  const Router = useRouter();
  const [editPhot, seteditPhot] = useState(false);
  const [editBgPhoto, seteditBgPhoto] = useState(false);
  // const [username1, setUsername] = useState("");
  const [resError, setResError] = useState("none");
  const [bioError, setBioError] = useState("none");
  const [usernameError, setUsernameError] = useState("");

  // Initialize state variables with user data
  const [name, setName] = useState(userData?.name);
  const [username1, setUsername] = useState(userData?.username);
  const [userBio, setUserBio] = useState(userData?.userBio);
  const [designation, setDesignation] = useState(userData?.designation);
  const [location, setLocation] = useState(userData?.location);
  const [finalImage, setFinalImage] = useState(null);
  const [BackgroundImage, setBackgroundImage] = useState(null);
  const [result, setResult] = useState();
  const [height, setHeight] = useState(false);
  const [disableButton, setdisableButton] = useState(false);
  const userId = userData?._id;

  const usernameCheck = async () => {
    try {
      const response = await axios.post("/api/auth/signup/username_check", {
        username1,
      });
      setResError("green");
      setUsernameError("");
    } catch (error) {
      setUsernameError(error.response.data.error);

      if (error.response.data.error != "Already existed") {
        setdisableButton(false);
        setResError("red");
      } else {
        setResError("green");
      }
    }
  };
  const removeError = () => {
    setHeight(false);
    setResult("");
  };

  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "main") {
      setEditDetail(false);
    }
  };
  const fetchAndConvertImage = async () => {
    
    if (selectedFile) {
      try {
        const form = new FormData();
        form.append("image", selectedFile);
        const res = await axios.post("/api/profile/update/profileImage", form);

      } catch (error) {
        console.log( error);
      }
    } else {
      setFinalImage(null);
    }
  };

  const fetchBackgroundImg = async () => {
    if (selectBackground) {
      try {
        const form = new FormData();
        form.append("backgroundImage", selectBackground);
        const res = await axios.post(
          "/api/profile/update/backgroundImage",
          form
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      setBackgroundImage(null);
    }
  };

  useEffect(() => {
    setBgImage(userData?.background);
  }, [userData?.background]);

  useEffect(() => {
    if (selectBackground) {
      fetchBackgroundImg();
    }
  }, [selectBackground]);

  useEffect(() => {
    setselectImage(userData?.image);
  }, [userData?.image]);

  useEffect(() => {
    if (selectImage) {
      fetchAndConvertImage();
    }
  }, [selectImage]);

  const userBioFunc = (e) => {
    setUserBio(e.target.value);
    handleOnchange(e);
    setUploading(true);

    if (e.target.value.length > 145) {
      setBioError("red");
      setdisableButton(false);
    } else {
      setBioError("#B0B0B0");
    }
  };
  const handleProfileImage = () => {
    seteditPhot(!editPhot);
  };

  const handleBgImage = () => {
    seteditBgPhoto(!editBgPhoto);
  };
  const [uploading, setUploading] = useState(true);

  const handleSubmit = async (e) => {
    setUploading(false);
    e.preventDefault();
    try {
      const userData = {
        name: name,
        username: username1,
        designation: designation,
        location: location,
        userBio: userBio,
      };

    
      if (uploading) {
      const res = await axios.put("/api/profile/update/updateProfile", userData);
        if(res.data.success){
           message.success('Profile Edited successfully')
        }
      setUploading(true);
      setdisableButton(true);
      }
      setEditDetail(false);

      // mutateuserFetchData()
    } catch (error) {
      setResult(error.response.data.error);
      if (error.response.data.error) {
        setdisableButton(false);
        setEditDetail(true);
        
      }
    }
  };

  // control submit button
  const handleOnchange = async (e) => {
    const newValue = e.target.value;

    // Check if any value changes
    if (
      newValue !== name ||
      newValue !== username1 ||
      newValue !== designation ||
      newValue !== location ||
      newValue !== userBio
    ) {
      setdisableButton(true);
    }
  };
  return (
    <>
       {editPhot && <EditPhoto editPhot={editPhot} seteditPhot={seteditPhot}/>}
       {editBgPhoto && <EditBGphoto editBgPhoto={editBgPhoto} seteditBgPhoto={seteditBgPhoto}/>}

      <div className={styles.main} id="main" onClick={closeModel}>
        <div className={styles.fullEdit}>
          <ClosePart title={"Edit Profile"} CloseTheModal={setEditDetail} />
          <div className={styles.upperPortion}>
            <div className={styles.instruction}>
              <p style={{color:"#08529B", fontWeight:"500"}} >Click on image to change your profile and Background image </p>
              <div className={styles.imageSection}>
                <div
                  className={styles.profileImage}
                  onClick={handleProfileImage}
                >
                 { selectImage && <Image
                    src={selectImage}
                     fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     style={{
                  objectFit: "cover"
                }}
                    alt="profImage"
                  />}
                </div>
                <div className={styles.backgroundImage} onClick={handleBgImage}>
                 {BgImage && <Image
                    src={BgImage}
                     fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                  objectFit: "contain"
                }}
                    alt="backGroundImage"
                  />}
                </div>
                <div className={styles.background}></div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  paddingTop: "1.5rem",
                  color: "red",
                  fontSize: "1.5rem",
                }}
              >
                {result}
              </div>
              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required="required"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    handleOnchange(e);
                    setUploading(true);
                    setResult("");
                  }}
                />
                <span className={styles.label}>
                  Full Name (First & Last Name)
                </span>
              </div>

              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="username"
                  autoComplete="username"
                  name="username"
                  // maxLength="30"
                  required="required"
                  value={username1}
                  onClick={removeError}
                  onBlur={usernameCheck}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    handleOnchange(e);
                    setUploading(true);

                  }}
                  style={{ outline: `1px solid ${resError}` }}
                />
                <span className={styles.label}>Username</span>
                {usernameError != "Already existed" && (
                  <div className={styles.errorLine}>{usernameError}</div>
                )}
              </div>
              <div className={styles.inputDesc}>
                <textarea
                  className={styles.textArea}
                  type="text"
                  id="userBio"
                  name="userBio"
                  rows={1}
                  // required="required"
                  value={userBio}
                  onChange={userBioFunc}
                  style={{ outline: `1px solid ${bioError}` }}
                />
                <span className={styles.labelInputDesc}>Bio</span>
                <div className={styles.maxCharBio}>{userBio?.length}/145 </div>
              </div>
              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  required="required"
                  value={designation}
                  onChange={(e) => {
                    setDesignation(e.target.value);
                    handleOnchange(e);
                    setUploading(true);
                    setResult("");
                  }}
                />
                <span className={styles.label}>Current Designation/Aspiring Role.</span>
              </div>
              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required="required"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    handleOnchange(e);
                    setUploading(true);
                    setResult("");

                  }}
                />
                <span className={styles.label}>Location</span>
              </div>

              <div className={styles.input_bxButton}>
                <button
                  disabled={!disableButton}
                  style={
                    !disableButton
                      ? {
                          backgroundColor: "rgba(10, 102, 194, 0.5)",
                          cursor: "default",
                          textShadow: "none",
                        }
                      : {}
                  }
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
