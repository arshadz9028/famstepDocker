import React, { useEffect, useState, useContext, useRef } from "react";
import styles from "../../styles/EditProfile.module.scss";
import Image from "next/image";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiChevronLeft } from "react-icons/bi";
import { resizeImage } from '../../utils/resizeImage';
import axios from "axios";
import { mutate } from "swr";

function CreateGroup({ setEdit,groupData,edit  }) {

  // Initialize state variables with user data
  const [name, setName] = useState(groupData.groupName);
  const [desc, setDesc] = useState(groupData.description);
  const groupId = groupData._id
  /* code to handle profile image */
  const [selectImage, setselectImage] = useState( groupData.image);
  const [SelectedFile, setSelectedFile] = useState();
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
  const [BgImage, setBgImage] = useState(groupData.background);

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
  const fetchAndConvertImage = async () => {
    if (SelectedFile) {
      try {
        const form = new FormData();
        form.append("image", SelectedFile);
        form.append("groupId", groupId);
        const res = await axios.post("/api/group/update/profileImage", form);
      } catch (error) {
        console.log(error);
      }
    } else {
      setSelectedFile('');
    }
  };

  const fetchBackgroundImg = async () => {
    if (selectBackground) {
      try {
        const form = new FormData();
        form.append("backgroundImage", selectBackground);
        form.append("groupId", groupId);
        const res = await axios.post(
          "/api/group/update/backgroundImage",
          form
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      setselectBackground(null);
    }
  };

  useEffect(() => {
    if (selectBackground) {
      fetchBackgroundImg();
    }
  }, [selectBackground]);

  useEffect(() => {
    if (selectImage) {
      fetchAndConvertImage();
    }
  }, [selectImage]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name: name,
        desc: desc,
        groupId
      };

      setName(name);
      setDesc(desc);


      await axios.put("/api/group/update/updateGroups", userData);
      mutate(`/api/group/groupFetch`)
    } catch (error) {
      console.log(error.response?.data);
    }
    setEdit(false)
  };
  const closeModel = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "EditProfile_main__Zo98X") {
      setEdit(false);
    }
  };
  
  

  return (
    <>

      <div className={styles.main} id="EditProfile_main__Zo98X" onClick={closeModel}>
        <div className={styles.fullEdit}>
          <div className={styles.closeButton}>
            <BiChevronLeft
              className={styles.leftArrowButton}
              onClick={() =>  setEdit(false)}
            />
            <p className={styles.upper_sec}>Edit Group</p>
            <AiOutlineCloseCircle
              className={styles.CloseCircleButton}
              onClick={() => setEdit(false)}
            />
          </div>
          <div className={styles.upperPortion}>
            <div className={styles.instruction}>
              <p>Click below to chnage Group profile and background image.</p>
              <div className={styles.imageSection}>
                <div className={styles.profileImage} onClick={handleProfileImage}>
                  <Image
                    src={selectImage}
                     fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     style={{
                  objectFit: "cover"
                }}
                    alt="profImage"
                  />
                </div>
                <div className={styles.backgroundImage} onClick={handleBgImage}>
                  <Image
                    src={BgImage}
                     fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     style={{
                  objectFit: "cover"
                }}
                    alt="backGroundImage"
                  />
                </div>
                <div className={styles.background}></div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.input_bx}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required="required"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <span className={styles.label}>
                  Group name*
                </span>
              </div>

              <div className={styles.inputDesc}>
                <textarea
                  className={styles.textArea}
                  type="text"
                  value={desc}
                  id="description"
                  name="description"
                  required="required"
                  rows={4}
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                />
                <span className={styles.labelInputDesc}>Description*</span>
              </div>

              <div className={styles.input_bxButton} >
                <button
                  style={{
                    backgroundColor: (desc && name) ? '#08529B' : 'rgba(10, 102, 194, 0.5)',
                    cursor: "default",
                    textShadow: "none",
                  }}
                  type="submit"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
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
