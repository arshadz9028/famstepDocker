import { useState, React, useContext, useRef, useEffect } from "react";
import styles from "../styles/createMobPost.module.scss";
import { FaImages } from "react-icons/fa6";;
import { LiaUserTagSolid } from "react-icons/lia";
import Image from "next/image";
import { BiChevronLeft } from "react-icons/bi";
import { ContextProvider } from "../global/context";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import axios from "axios";
import { mutate } from "swr";
import AddTag from "../layouts/post/AddTag";
import { resizeImage } from "../utils/resizeImage";
import { v4 as uuidv4 } from "uuid";
import { imageAspectRatio } from "../utils/imageAspectRatio";
import { message } from "antd";
function CreatePost({ session }) {
  const {
    isGrpPost,
    setisGrpPost,
    taggedUser,
    setTaggedUser,
    GrpId,
    selectedImageMultiple,
    setSelectedImageMultiple,
    selectedFile,
    setSelectedFile,
    setBoxes,
  } = useContext(ContextProvider);

  const [addTagOpen, setAddTagOpen] = useState(false);
  const [toggle, setToggle] = useState("Photo");
  const textareaRef = useRef(null);
  const [inputCheck, setinputCheck] = useState("");
  const [initialHeight, setInitialHeight] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [imageHeight, setImageHeight] = useState({
    width: "",
    height: "",
  });
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 767) {
        router.push("/home");
      }
    };

    handleResize();
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeForm = (e) => {
    const className = e.currentTarget.getAttribute("id");
    if (className === "screen") {
      setSelectedImageMultiple([]);
      setSelectedFile([]);
      setTaggedUser([])
      setinputCheck("");
      setBoxes(false)
      if (isGrpPost) {
        setisGrpPost(false);
        router.push(`/network/groups/${GrpId}`);
      } else {
        router.push("/home");
      }
    }
  };
  const handleUpload = async (e) => {

    e.preventDefault();
    if (selectedImageMultiple.length === 0) return;
    const form = new FormData();
    selectedFile.forEach((imageObj) => {
      form.append("images", imageObj.file);  // "images" should match the field name in multer
    });
    form.append("content", inputCheck);
    form.append("GrpId", GrpId);
    form.append("isGrpPost", isGrpPost);
    form.append("taggedUser", taggedUser);

    try {
      const res = await axios.post("/api/home/post", form);

      if (res.data.success) {
         message.success("Your post has been shared successfully!")
        mutate("/api/home/index");
        setTaggedUser([]);
        setSelectedImageMultiple([])
        setSelectedFile("");
        setinputCheck("");
        if (isGrpPost) {
          router.push(`/network/groups/${GrpId}`);
          setisGrpPost(false);

        } else {
          setBoxes(false);
          router.push(`/home`);
        }

      }
    } catch (error) {
      console.log(error.response?.data);
    }

    // CreatePostClose()
    // setUploading(true);
  };


  useEffect(() => {

    const callAsyncFunc = async () => {
      if (selectedImageMultiple.length > 0) {
        const allAspectRatios = await Promise.all(
          selectedImageMultiple?.map((img) => imageAspectRatio(img.url, 200, 200))
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

  const handleImageSelect = async (event) => {
    const files = event.target.files; // Access the selected files
    if (files && files.length > 0) {
      const newImages = await Promise.all(
        Array.from(files).map(async (file) => {
          const maxWidth = 800;
          const maxHeight = 800;

          const resizedImage = await resizeImage(file, maxWidth, maxHeight);

          return {
            id: uuidv4(), // Generate a unique ID
            file: resizedImage, // Resized image
            url: URL.createObjectURL(resizedImage), // Object URL for rendering
          };
        })
      );
      // Update your state with the new images

      setSelectedFile((prev) => [
        ...prev,
        ...newImages.slice(0, 10 - prev.length).map((img) => ({
          file: img.file,
          id: img.id,
        })),
      ]);

      // Store all images (up to 10) in `setSelectedImageMultiple` with their `id` and `url`
      setSelectedImageMultiple((prev) => [
        ...prev,
        ...newImages.slice(0, 10 - prev.length).map((img) => ({
          id: img.id,
          url: img.url,
        })),
      ]);

    }
    event.target.value = "";
  };

  return (
    <>
      {addTagOpen && (
        <AddTag
          setAddTagOpen={setAddTagOpen}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          setToggle={setToggle}
        />
      )}
      {/* Mobile view */}
      <div className={styles.screen_mob} id="screen_mob">
        <form className={styles.middle_screen_mob} onSubmit={handleUpload}>
          <div className={styles.topbar}>
            <div id="screen" className={styles.backArrowIcon} onClick={closeForm}>
              <BiChevronLeft className={styles.icon1} />
            </div>

            <div className={styles.arrangeMent_button}>
              <input type="submit" value="Post" className={styles.button} />
            </div>
          </div>

          <div className={styles.topLine} />

          <div className={styles.user_id}>
            <div className={styles.circle_img}>
              <Image src={session.user.image} fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="userImage" />
            </div>

            <div className={styles.attributes}>
              <p>{session.user.name}</p>
            </div>
          </div>

          <div className={styles.belowPart_form}>
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
                maxHeight: selectedImageMultiple.length > 0 ? "20rem" : "25rem",
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
              {selectedImageMultiple.length > 0 && (
                <div
                  className={styles.selectedImage}
                >
                  {selectedImageMultiple.map((val) => (
                    <div
                      key={val._id}
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
                      {val.url && (
                        <Image
                          src={val.url} // Ensure `val.url` is a valid string
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{
                            objectFit: "contain",
                          }}
                          alt="post"
                          quality={2}
                          property={true}
                        />
                      )}
                      <IoCloseCircleSharp
                        className={styles.attachClose}
                        onClick={() => {
                          setSelectedFile((prev) => prev.filter((file) => file.id !== val.id));
                          setSelectedImageMultiple((prev) => prev.filter((image) => image.id !== val.id));
                          setInitialHeight(
                            `calc(${parseFloat(textareaRef.current.scrollHeight)}px)`
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.icons}>
              <div className={styles.shift_icon}>
                <div className={styles.iconCover} style={{
                  ...(toggle === "Tag" || taggedUser.length > 0 ? { backgroundColor: "#08529B", color: "white" } : {})
                }}>
                  <LiaUserTagSolid
                    className={styles.icon}
                    onClick={() => {
                      setToggle("Tag");
                      setAddTagOpen(true);
                    }}

                  />
                </div>
                {selectedImageMultiple?.length <= 9 && (
                  <>
                    <div className={styles.iconCover}>
                      <label htmlFor="attachment">
                        <FaImages
                          className={styles.icon}
                          style={
                            toggle === "emoji"
                              ? { backgroundColor: "#08529B", fill: "white" }
                              : {}
                          }
                        />
                      </label>
                    </div>
                    <input
                      style={{ color: " #afa", textShadow: "0px 0px 1px #fff" }}
                      name="image"
                      type="file"
                      multiple
                      hidden
                      id="attachment"
                      accept="image/*"
                      onChange={handleImageSelect}

                    />
                  </>
                )}

              </div>


            </div>
          </div>
        </form>
      </div>
    </>
  );
}
export async function getServerSideProps({ req, query }) {
  const userAgent = req.headers["user-agent"];
  // Check the user-agent string to determine the device type
  if (userAgent && !/iPhone|iPad|Mobile|Tablet|Android/i.test(userAgent)) {
    // Tablet, laptop, or desktop detected, redirect to '/home'
    return {
      redirect: {
        destination: "/home",
        permanent: false, // Set to true if this is a permanent redirect
      },
    };
  }
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { isNewUser } = session?.user;
  if (isNewUser) {
    return {
      redirect: {
        destination: "/getting-started",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
export default CreatePost;
