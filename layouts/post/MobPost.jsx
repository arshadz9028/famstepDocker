import { useState, React, useContext, useRef, useEffect } from "react";
import styles from "../../styles/createMobPost.module.scss";
import { LiaUserTagSolid } from "react-icons/lia";
import Image from "next/image";
import { BiChevronLeft } from "react-icons/bi";
import { ContextProvider } from "../../global/context";
import { useRouter } from "next/router";
import axios from "axios";
import AddTag from "../../layouts/post/AddTag";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierForestDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { imageAspectRatio } from "../../utils/imageAspectRatio";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaDotCircle } from "react-icons/fa";
import { message } from "antd";
function MobPost({
  imageData,
  syntaxCode,
  session,
  mutateImageData,
  outputCode,
  inputCheck,
  setinputCheck,
  code,
  setCode,
  setOutput,
  output
}) {

  const {
    setCreatepost,
    editPost,
    isGrpPost,
    GrpId,
    setSelectedImage,
    selectedImage,
    createId,
    seteditPost,
    setSelectedFile,
    setSelectedImageMultiple,
    selectedImageMultiple,
    setTaggedUser,
    taggedUser,
    setZoomphoto,
    ProgramingLanguage,
    setProgramingLanguage
  } = useContext(ContextProvider);

  const [addTagOpen, setAddTagOpen] = useState(false);
  const [toggle, setToggle] = useState("Photo");

  const textareaRef = useRef(null);
  const [initialHeight, setInitialHeight] = useState(inputCheck.length > 55 ? `calc(264px)` : "");
  const [imageHeight, setImageHeight] = useState({
    width: "",
    height: "",
  });

  const router = useRouter();
  const [selectedUsers, setSelectedUsers] = useState(editPost ? imageData?.tag : []);

  const mainImg = imageData?._id;
  const DeleteSelectedImages = async (id) => {
    if (editPost) {
      await axios.delete(
        `/api/home/post/deleteMapPost?postUpdate=${id}&mainImg=${mainImg}`
      );
      mutateImageData();
    }
    setSelectedFile((prev) => prev.filter((img) => img.id !== id));
    setSelectedImageMultiple((prev) => prev.filter((img) => img.id !== id));
    setInitialHeight(`calc(${parseFloat(textareaRef.current.scrollHeight)}px)`);
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    if (router.pathname === "/ide") {
      try {
        const res = await axios.post("/api/code/practiceIde", {
          syntaxCode,
          inputCheck,
          GrpId,
          isGrpPost,
          taggedUser,
          outputCode,
          ProgramingLanguage
        });

        if (res.data.success) {
           message.success("Your code has been shared successfully!");
          setProgramingLanguage("");
        }
      } catch (error) {
        console.error("Error making PUT request", error);
      }
    } else if (editPost) {
      try {
        const res = await axios.put(`/api/home/post/${createId}`, {
          inputCheck,
          taggedUser,
        });
        if (res.data.success) {
           message.success("Your post has been edited successfully!")
          if (!imageData.pracsUrl) {
            setZoomphoto({
              images: imageData?.images,
              dp: imageData.userid?.image,
            });
          }
          mutateImageData()

        }
      } catch (error) {
        console.log(error.response?.data);
      }

      mutateImageData();
    }
    setTaggedUser([]);
    setCreatepost(false);
    seteditPost(false);
    setSelectedImage([]);
    setSelectedImageMultiple([]);
    setSelectedFile("");
    setinputCheck("");
    setSelectedUsers([]);
    mutateImageData();

  };

  useEffect(() => {

    const callAsyncFunc = async () => {
      if (selectedImageMultiple?.length > 0) {
        const allAspectRatios = await Promise.all(
          selectedImageMultiple?.map((img) =>
            imageAspectRatio(img?.url, 200, 200)
          )
        );
        let minWidth = Math.min(...allAspectRatios.map((ar) => ar.width));
        let minHeight = Math.min(...allAspectRatios.map((ar) => ar.height));
        minWidth = Math.max(minWidth, 150);
        minHeight = Math.max(minHeight, 150);
        setImageHeight({ width: minWidth, height: minHeight });
      }
    };
    callAsyncFunc();
  }, [selectedImageMultiple]);

  const customCodeStyle = {
    fontFamily: "Zilla Slab, serif", // Set your custom font here
    fontSize: "2rem",
    wrapLines: "true", // Set your custom font size
  };


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
      {/* Mobile view */}
      <div className={styles.screen_mobModel} id="screen_mob">
        <form className={styles.middle_screen_mob} onSubmit={handleUpload}>
          <div className={styles.topbar}>
            <div
              className={styles.backArrowIcon}
              onClick={() => {
                setCreatepost(false);
                seteditPost(false);
                setSelectedImageMultiple([]);
              }}
            >
              <BiChevronLeft className={styles.icon1} />
            </div>

            <div className={styles.arrangeMent_button}>
              <input
                type="submit"
                value={editPost ? "Save" : "Post"}
                className={styles.button}
              />
            </div>
          </div>

          <div className={styles.topLine} />

          <div className={styles.user_id}>
            <div className={styles.circle_img}>
              {session?.user.image ? (
                <Image
                  src={session?.user?.image}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt="userImage"
                />
              ) : null}
            </div>

            <div className={styles.attributes}>
              <p>{session?.user?.name}</p>
            </div>
          </div>
          <div className={styles.belowPart_form}>
            {ProgramingLanguage !== "" &&
              <div className={styles.langugeButtonCover} >
                <div className={styles.langugeButton}>
                  <FaDotCircle />
                  {ProgramingLanguage}
                </div>
              </div>
            }
            <textarea
              autoFocus
              ref={textareaRef}
              className={styles.typing_area}
              rows={1} // Start with 1 row (single line)
              value={inputCheck}
              placeholder="What's happening?"
              onChange={(e) => {
                setinputCheck(e.target.value);
                setInitialHeight(
                  `calc(${parseFloat(textareaRef.current.scrollHeight)}px  )`
                );
              }}
              onInput={() => {
                if (textareaRef.current) {
                  textareaRef.current.style.height = "auto"; // Auto height to reset the textarea
                  textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Content ke hisab se height set karein
                }
              }}
              style={{
                height: textareaRef.current ? `${initialHeight}` : " ",
                maxHeight: selectedImage ? "20rem" : "25rem",
              }}
            />
            {/* {selectedImage && ( */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "0",
              }}
            >
              {router.pathname !== "/ide" ? (

                <div className={styles.selectedImage} >

                  {editPost && imageData?.images[0].image === "" ? (
                    <div className={styles.postCodeFullFrame}>
                      <div className={styles.postCodeFrame}>
                        <div className={styles.codeFrame}>
                          <SyntaxHighlighter
                            wrapLongLines={true}
                            language="python"
                            style={atelierForestDark}
                            codeTagProps={{ style: customCodeStyle }}
                            className={styles.code_section}
                            customStyle={{
                              whiteSpace: "pre-wrap", // Wrap the text
                              wordBreak: "break-all", // Break long words
                              wordWrap: "break-word",
                              overflowX: "hidden", // Hide horizontal overflow
                              padding: "2rem",
                              borderRadius: ".5rem",
                            }}
                          >
                            {code}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                      <div className={styles.moreImages} >
                        <pre
                          className={styles.multipleMagesCode}
                          style={{
                            color: "white", width: "100%",
                          }}
                        >
                          {output}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    selectedImageMultiple.map((val) => (
                      <div
                        key={val.id}
                        style={{
                          position: "relative",
                          width: `${imageHeight.width}px`,
                          height: `${imageHeight.height}px`,
                          margin: ".5rem",
                          borderRadius: ".5rem",
                          overflow: "hidden",
                          flexShrink: "0",
                          borderRadius: "1rem",
                          backgroundColor: "black"
                        }}
                      >
                        <Image
                          src={val.url}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{
                            objectFit: "contain",
                          }}
                          alt="post"
                          quality={2}
                          property="true"
                        />
                        <>
                          {imageData?.images ? (
                            imageData?.images[0]?._id !== val.id && (
                              <div onClick={() => DeleteSelectedImages(val.id)}>
                                <IoCloseCircleSharp
                                  className={styles.attachClose}
                                />
                              </div>
                            )
                          ) : (
                            <div
                              className={styles.attachClose}
                              onClick={() => DeleteSelectedImages(val.id)}
                            >
                              <IoCloseCircleSharp
                                className={styles.attachClose}
                              />
                            </div>
                          )}
                        </>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className={styles.postCodeFullFrame}>
                  <div className={styles.postCodeFrame}>
                    <div className={styles.codeFrame}>
                      <SyntaxHighlighter
                        wrapLongLines={true}
                        language="python"
                        style={atelierForestDark}
                        codeTagProps={{ style: customCodeStyle }}
                        className={styles.code_section}
                        customStyle={{
                          whiteSpace: "pre-wrap", // Wrap the text
                          wordBreak: "break-all", // Break long words
                          wordWrap: "break-word",
                          overflowX: "hidden", // Hide horizontal overflow
                          padding: "2rem",
                          borderRadius: ".5rem",
                        }}
                      >
                        {syntaxCode}
                      </SyntaxHighlighter>
                    </div>

                  </div>
                  <div className={styles.moreImages} >
                    <pre className={styles.multipleMagesCode} >
                      {outputCode}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            {/* )} */}
            <div className={styles.icons}>
              <div className={styles.shift_icon}
                onClick={() => {
                  setAddTagOpen(true);
                  setToggle("Tag");
                }}>
                <div className={styles.iconCover} style={{
                  ...(toggle === "Tag" || taggedUser.length > 0 ? { backgroundColor: "#08529B", color: "white" } : {})
                }}>
                  <LiaUserTagSolid
                    className={styles.icon}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
export default MobPost;
