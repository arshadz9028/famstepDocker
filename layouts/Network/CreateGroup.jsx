import React, { useEffect, useState, useContext, useRef } from "react";
import styles from "../../styles/EditProfile.module.scss";
import Image from "next/image";
import EditPhoto from "../models/EditPhoto";
import EditBGphoto from "../models/EditBGphoto";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiChevronLeft } from "react-icons/bi";
import AddImageIcon from "../../assets/newIcons/createImage.jpg";
import bgImageIcon from "../../assets/newIcons/bgIcons.jpg";
import { resizeImage } from "../../utils/resizeImage";
import axios from "axios";
import { useRouter } from "next/router";
import { mutate } from "swr";

function CreateGroup({ setScoreToggle, selected, mutateuserData }) {
  const router = useRouter();
  // Initialize state variables with user data
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [errorImage, seterrorImage] = useState("");
  /* code to handle profile image */
  const [selectImage, setselectImage] = useState(AddImageIcon);
  const [SelectedFile, setSelectedFile] = useState();
  const [data, setData] = useState({});
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxWidth = 400; // Set the desired maximum width
      const maxHeight = 400; // Set the desired maximum height
      const resizedImage = await resizeImage(file, maxWidth, maxHeight);

      // Update the state with the resized image
      setselectImage(URL.createObjectURL(resizedImage));
      setSelectedFile(resizedImage);
    }
  };
  const fileInputRef = useRef(null);
  const handleProfileImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /* code to handle background image */
  const [selectBackground, setselectBackground] = useState();
  const [BgImage, setBgImage] = useState(bgImageIcon);

  const handleBgChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxWidth = 800; // Set the desired maximum width
      const maxHeight = 800; // Set the desired maximum height
      const resizedImage = await resizeImage(file, maxWidth, maxHeight);

      // Update the state with the resized image
      setBgImage(URL.createObjectURL(resizedImage));
      setselectBackground(resizedImage);
    }
  };
  const fileBgRef = useRef(null);
  const handleBgImage = () => {
    if (fileBgRef.current) {
      fileBgRef.current.click();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === "") {
      seterrorImage("Please enter a group name");
    }
    if(desc === ''){
      seterrorImage("Please add some description");
    }
    try {
      const form = new FormData();

      form.append("image", SelectedFile);

      form.append("backgroundImage", selectBackground);

      form.append("name", name);
      form.append("desc", desc);

      if (selectBackground && SelectedFile) {
        const res = await axios.post("/api/group/createProfile", form);
        mutateuserData();
        setData(res.data);
        setScoreToggle(selected);
      } else {
        seterrorImage("please select profile & background image");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "EditProfile_main__Zo98X") {
      setScoreToggle(selected);
    }
  };
  return (
    <>
      <div
        className={styles.main}
        id="EditProfile_main__Zo98X"
        onClick={closeModel}
      >
        <div className={styles.fullEdit}>
          <div className={styles.closeButton}>
            <BiChevronLeft
              className={styles.leftArrowButton}
              onClick={() => setScoreToggle(selected)}
            />
            <p className={styles.upper_sec}>Create Group</p>
            <AiOutlineCloseCircle
              className={styles.CloseCircleButton}
              onClick={() => setScoreToggle(selected)}
            />
          </div>
          <form className={styles.upperPortion} onSubmit={handleSubmit}>
            <div className={styles.instruction}>
              <p>Click below to add Group profile and background image.</p>
              <div className={styles.imageSection}>
                <div
                  className={styles.profileImage}
                  onClick={handleProfileImage}
                >
                  <Image
                    src={selectImage}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: "cover",
                    }}
                    required="required"
                    alt="profImage"
                  />
                </div>
                <div className={styles.backgroundImage} onClick={handleBgImage}>
                  <Image
                    src={BgImage}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: "cover",
                    }}
                    required="required"
                    alt="backGroundImage"
                  />
                </div>
                <div className={styles.background}></div>
              </div>
            </div>
            <div style={{ color: "red", fontSize: "1.5rem" }}>{errorImage}</div>
            <div onSubmit={handleSubmit}>
              <div className={styles.input_bx}>
              <input
  type="text"
  id="name"
  name="name"
  // required
  value={name}
  onChange={(e) => {
    const newName = e.target.value;
    setName(newName);
    
    if (newName === "") {
      seterrorImage("Please enter a group name");
    } else {
      seterrorImage("");
    }
  }}
/>

                <span className={styles.label}>Group name*</span>
              </div>

              <div className={styles.inputDesc}>
                <textarea
                  className={styles.textArea}
                  type="text"
                  value={desc}
                  id="desc"
                  name="desc"
                  required="required"
                  rows={4}
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                />
                <span className={styles.labelInputDesc}>Description*</span>
              </div>

              <div className={styles.input_bxButton}>
                <button
                  style={{
                    backgroundColor:
                      desc && name ? "#08529B" : "rgba(10, 102, 194, 0.5)",
                    cursor: desc && name? "pointer" : "default",
                    textShadow: "none",
                  }}
                  type="submit"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileBgRef}
        onChange={handleBgChange}
      />
    </>
  );
}

export default CreateGroup;
