import React, { useState, useContext, useEffect } from "react";
import styles from "../../../styles/earning.module.scss";
import Navbar from "../../../layouts/Navbar";
import SettingsLayout from "../../../layouts/settings/SettingsLayout";
import useSWR from "swr";
import axios from "axios";
import { getSession } from "next-auth/react";
import EditProfile from "../../../layouts/EditProfile";
import { ContextProvider } from "../../../global/context";
import { useRouter } from "next/router";
import EditPhoto from "../../../layouts/models/EditPhoto";
import EditBGphoto from "../../../layouts/models/EditBGphoto";
import ClosePart from "../../../components/profileComp/ClosePart";
import Image from "next/image";

async function fetchUsers(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
function Settings({ session }) {
  const {
    data: usersData,
    mutate: mutatefollowerData,
    error: followerError,
  } = useSWR("/api/profile/follow/userFetch", fetchUsers);
  const userData = usersData?.userDataS;
  const {
    selectBackground,
    selectedFile,
    selectImage,
    setselectImage,
    BgImage,
    setBgImage,
    earningToggle,
    setEarningToggle,
  } = useContext(ContextProvider);
  const Router = useRouter();
  const [editPhot, seteditPhot] = useState(false);
  const [editBgPhoto, seteditBgPhoto] = useState(false);
  // const [username1, setUsername] = useState("");
  const [resError, setResError] = useState("none");
  const [bioError, setBioError] = useState("none");
  const [usernameError, setUsernameError] = useState("");

  // Initialize state variables with user data
  const [name, setName] = useState("");
  const [username1, setUsername] = useState("");
  const [userBio, setUserBio] = useState("");
  const [designation, setDesignation] = useState("");
  const [location, setLocation] = useState("");
  const [finalImage, setFinalImage] = useState(null);
  const [BackgroundImage, setBackgroundImage] = useState(null);
  const [result, setResult] = useState();
  const [height, setHeight] = useState(false);
  const [disableButton, setdisableButton] = useState(false);
  const userId = userData?._id;

  // Update state when userData is available
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setUsername(userData.username || "");
      setUserBio(userData.userBio || "");
      setDesignation(userData.designation || "");
      setLocation(userData.location || "");
    }
  }, [userData]);
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

  const fetchAndConvertImage = async () => {
    if (selectedFile) {
      try {
        const form = new FormData();
        form.append("image", selectedFile);
        const res = await axios.post("/api/profile/update/profileImage", form);
      } catch (error) {
        console.log(error);
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
    if (e.target.value.length > 90) {
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
        alert(res.data.data)
        setdisableButton(false)
        setUploading(true);
      }

      // mutateuserFetchData()
    } catch (error) {
      setResult(error.response.data.error);
      if (error.response.data.error) {
        setdisableButton(false);
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
      <Navbar select={"Settings and Privacy"} session={session} border={"bottom"} />
      {editPhot && <EditPhoto editPhot={editPhot} seteditPhot={seteditPhot} />}
      {editBgPhoto && (
        <EditBGphoto
          editBgPhoto={editBgPhoto}
          seteditBgPhoto={seteditBgPhoto}
        />
      )}

      <div className={styles.main}>
        <div className={styles.center}>
          <SettingsLayout selected={"editProfile"} />
          <div
            className={styles.WrapperDisplay}
            style={earningToggle ? { display: "block" } : {}}
          >
            <div className={styles.sideBarMobHeader}>
              <ClosePart
                title={"Edit Profile"}
                CloseTheModal={setEarningToggle}
              />
            </div>
            <div className={styles.display}>
              <div className={styles.blockedUsers}>
                <div className={styles.blockedUsersContent}>
                  <p className={styles.blockedUsersHeader}>Edit profile</p>
                </div>
                <div className={styles.fullEdit}>
                  <div className={styles.upperPortion}>
                    <div className={styles.instruction}>
                      <p>
                        Click on image to change your profile and Background
                        image{" "}
                      </p>
                      <div className={styles.imageSection}>
                        <div
                          className={styles.profileImage}
                          onClick={handleProfileImage}
                        >
                          <Image
                            src={selectImage || "/noavatar.png"}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{
                              objectFit: "cover",
                            }}
                            alt="profImage"
                          />
                        </div>
                        <div
                          className={styles.backgroundImage}
                          onClick={handleBgImage}
                        >
                          <Image
                            src={BgImage || "/background.jpg"}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{
                              objectFit: "cover",
                            }}
                            alt="backGroundImage"
                          />
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
                          }}
                          style={{ outline: `1px solid ${resError}` }}
                        />
                        <span className={styles.label}>Username</span>
                        {usernameError != "Already existed" && (
                          <div className={styles.errorLine}>
                            {usernameError}
                          </div>
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
                        <div className={styles.maxCharBio}>
                          {userBio?.length}/90{" "}
                        </div>
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
                          }}
                        />
                        <span className={styles.label}>Designation</span>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { id, username, isNewUser } = session?.user;
  if (isNewUser) {
    return {
      redirect: {
        destination: "/getting-started",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
export default Settings;
