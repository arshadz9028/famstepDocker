import React, { useState, useContext, useRef, useEffect } from "react";
import styles from "../../styles/Post.module.scss";
import { ContextProvider } from "../../global/context";
import Image from "next/image";
import { LiaUserTagSolid } from "react-icons/lia";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/router";
import AddTag from "../../layouts/post/AddTag";
import { FaDotCircle } from "react-icons/fa";
import { message } from "antd";
function PostInnerForm({
  ImageData,
  userdp,
  name,
  handleEmojiModal,
  toggle,
  setToggle,
  textareaRef,
  inputCheck,
  setinputCheck,
  showEmojis,
  setShowEmojis,
  emojiRef,
  closeForm,
  syntaxCode,
  mutateImageData,
  outputCode,
}) {
  const {
    editPost,
    seteditPost,
    taggedUser,
    setTaggedUser,
    isGrpPost,
    setSelectedImage,
    selectedFile,
    setSelectedFile,
    setCreatepost,
    setIsFormOpen,
    GrpId,
    setZoomphoto,
    setSelectedImageMultiple,
    createId,
    ProgramingLanguage,
    setProgramingLanguage,
  } = useContext(ContextProvider);

  const [addTagOpen, setAddTagOpen] = useState(false);
  const [uploading, setUploading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState(
    editPost ? ImageData?.tag : []
  );
  const [detectedLink, setDetectedLink] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setinputCheck(value);
  
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = value.match(urlRegex);
    if (match) {
      setDetectedLink(match[0]); // Store the first detected link
    } else {
      setDetectedLink(null); // Reset if no link is found
    }
  };
  const Router = useRouter();

  const handleUpload = async (e) => {
    e.preventDefault();

    if (Router.pathname === "/ide") {
      try {
        const res = await axios.post("/api/code/practiceIde", {
          syntaxCode,
          inputCheck,
          GrpId,
          isGrpPost,
          taggedUser,
          outputCode,
          ProgramingLanguage,
        });
        if (res.data.success) {
          message.success("Your code has been shared successfully!");
          setProgramingLanguage("");
        }
      } catch (error) {
        console.error("Error making PUT request", error);
      }
    } else if (!selectedFile) {
      return;
    } else if (uploading && !editPost) {
      const form = new FormData();
      selectedFile.forEach((imageObj) => form.append("images", imageObj.file));
      form.append("content", inputCheck);
      form.append("isGrpPost", isGrpPost);
      form.append("GrpId", GrpId);
      form.append("taggedUser", taggedUser);

      try {
        const res = await axios.post("/api/home/post", form);
        if (res.data.success) {
          message.success("Your post has been uploaded successfully!");
          mutateImageData();
        }
      } catch (error) {
        console.log(error.response?.data);
      }
    } else if (editPost) {
      try {
        const res = await axios.put(`/api/home/post/${createId}`, {
          inputCheck,
          taggedUser,
        });
        if (res.data.success) {
          message.success("Your post has been edited successfully!");
          if (!ImageData.pracsUrl) {
            setZoomphoto({
              images: ImageData?.images,
              dp: ImageData.userid?.image,
            });
          }
          mutateImageData();
        }
      } catch (error) {
        console.log(error.response?.data);
      }
    }

    // Resetting states in a single batch to improve performance
    setTaggedUser([]);
    setCreatepost(false);
    seteditPost(false);
    setSelectedImage([]);
    setSelectedImageMultiple([]);
    setSelectedFile("");
    setinputCheck("");
    setIsFormOpen(true);
    setSelectedUsers([]);
    mutateImageData();

  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (emojiRef.current && !emojiRef.current.contains(event.target)) {
          setShowEmojis(false);
          setToggle("");
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showEmojis]);

  return (
    <>
      {addTagOpen && (
        <AddTag
          setAddTagOpen={setAddTagOpen}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          setToggle={setToggle}
          mutateImageData={mutateImageData}
        />
      )}
      <div className={styles.middle_screen}>
        <div className={styles.user_id}>
          <div className={styles.userInfo}>
            <div className={styles.circle_img}>
              <Image
                src={userdp}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                }}
                alt="userImage"
              />
            </div>
            <div className={styles.attributes}>
              <p>{name}</p>
            </div>
          </div>
          <div
            id="closeCircle"
            className={styles.closeCircle}
            onClick={closeForm}
          >
            <AiOutlineCloseCircle className={styles.closeCircleInner} />
          </div>
        </div>

        {ProgramingLanguage !== "" && (
          <div className={styles.langugeButton}>
            <FaDotCircle />
            {ProgramingLanguage}
          </div>
        )}

        <form className={styles.belowPart_form} onSubmit={handleUpload}>
          <textarea
            autoFocus
            ref={textareaRef}
            className={styles.typing_area}
            rows={1} // Start with 1 row (single line)
            value={inputCheck}
            placeholder="What's happening?"
            onChange={handleInputChange}
          />
          
          {detectedLink && (
            <div className={styles.detectedLink}>
              <span>Link detected: </span>
              <a 
                href={detectedLink} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#1890ff', textDecoration: 'underline' }}
              >
                {detectedLink}
              </a>
            </div>
          )}

          <div className={styles.icons}>
            <div className={styles.shift_icon}>
              <div className={styles.tooltip}>
                <LiaUserTagSolid
                  className={styles.icon}
                  onClick={() => {
                    setToggle("Tag");
                    setAddTagOpen(true);
                  }}
                  style={{
                    ...(toggle === "Tag" || taggedUser.length > 0 ? { backgroundColor: "#08529B", fill: "white" } : {})
                  }}

                />
                <p className={styles.tooltiptext}>Tag a person</p>
              </div>

              <div className={styles.tooltip}>
                <BsEmojiSmile
                  id="emoji-open"
                  className={styles.icon}
                  onClick={handleEmojiModal}
                  style={
                    toggle === "emoji"
                      ? { backgroundColor: "#08529B", fill: "white" }
                      : {}
                  }
                />
                <p className={styles.tooltiptext}>Open emojis keyboard</p>
              </div>
            </div>
          </div>

          <div className={styles.arrangeMent_button}>
            {Router.pathname === "/ide" ? (
              <input type="submit" value={"Post"} className={styles.button} />
            ) : (
              <input
                type="submit"
                value={!editPost ? "Post" : "Save"}
                className={
                  selectedFile == "" ? styles.buttonDim : styles.button
                }
              />
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default PostInnerForm;
