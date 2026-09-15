import { useState, React, useContext, useRef, useEffect } from "react";
import styles from "../../styles/Post.module.scss";
import Filter from "../../components/post/filter";
import Form from "../../components/post/PostInnerForm";
import { ContextProvider } from "../../global/context";
import Image from "next/image";
import { IoArrowBackCircle } from "react-icons/io5";
import EmojiPicker, { EmojiStyle, SuggestionMode } from "emoji-picker-react";
import { resizeImage } from "../../utils/resizeImage";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierForestDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { useRouter } from "next/router";
import MobPost from "../../layouts/post/MobPost";
import { v4 as uuidv4 } from "uuid";
import {
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaTimesCircle,
} from "react-icons/fa"; // Import arrow icons
import { FaCirclePlus } from "react-icons/fa6";
import axios from "axios";
import { IoMdPhotos } from "react-icons/io"
import ShareModal from "../../components/shared/ShareModal";
function Post({
  userdp,
  name,
  ImageData,
  session,
  mutateImageData,
  syntaxCode,
  outputCode
}) {
  const [toggle, setToggle] = useState("Photo");
  const {
    seteditPost,
    editPost,
    createpost,
    setCreatepost,
    setSelectedImage,
    selectedImage,
    isFormOpen,
    setIsFormOpen,
    selectedFile,
    setSelectedFile,
    createId,
    selectedImageMultiple,
    setSelectedImageMultiple,
    setTaggedUser,
    setProgramingLanguage
  } = useContext(ContextProvider);
  const router = useRouter();
  const imageData =
    ImageData && ImageData?.length >= 1
      ? ImageData?.filter((val) => val._id === createId)[0]
      : ImageData;
  //emojis and textArea
  const emojiRef = useRef(null);
  const textareaRef = useRef(null);
  const [inputCheck, setinputCheck] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [MediaQueries, setMediaQueries] = useState(false);

  useEffect(() => {
    // Function to handle screen resizing
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setMediaQueries(true);
      } else {
        setMediaQueries(false);
      }
    };

    // Initial check when component mounts
    handleResize();

    // Add event listener on mount
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    if (!editPost) return;
    setinputCheck(imageData?.desc);
    setTaggedUser(imageData.tag.map((tag) => tag.userid._id));
    if (editPost && imageData?.images[0].image === "") {
      setSelectedImage([])
      setSelectedImageMultiple([])
      setSelectedFile(imageData?.pracsUrl)
      setProgramingLanguage(imageData?.languageTag)
      const fetchCode = async () => {
        try {
          const response = await fetch(imageData?.pracsUrl);
          const codeContent = await response.text();
          const match = codeContent.match(/`([^`]*)`/);
          const extractedCode = match && match[1] ? match[1] : "";
          setCode(extractedCode);
          const responseOutput = await fetch(imageData?.outputUrl);
          const codeContentOutput = await responseOutput.text();
          setOutput(codeContentOutput)
        } catch (error) {
          console.error("Error fetching code:", error);
        }
      };

      fetchCode();
    }

    if (editPost && imageData?.images[0].image !== "") {
      setSelectedImage({
        url: imageData?.images[0]?.image,
        id: imageData?.images[0]?._id,
      });
      setSelectedImageMultiple(
        imageData?.images.map((val) => ({ url: val.image, id: val._id }))
      );
      setSelectedFile(
        imageData?.images.map((val) => ({ file: val.image, id: val._id }))
      );
    }
  }, [editPost, imageData]);


  const handleEmojiModal = () => {
    if (toggle === "emoji") {
      setToggle("photo");
    } else {
      setToggle("emoji");
    }
    setShowEmojis(!showEmojis);
  };

  const handleEmojiClick = (e) => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const emoji = e.emoji;

      // Insert the emoji at the cursor position
      const newInput =
        inputCheck.slice(0, cursorPosition) +
        emoji +
        inputCheck.slice(cursorPosition);
      setinputCheck(newInput);

      // Update the cursor position to be after the inserted emoji
      const newCursorPosition = cursorPosition + emoji.length;
      setTimeout(() => {
        // Adding a small delay for cursor positioning
        textareaRef.current.selectionStart = newCursorPosition;
        textareaRef.current.selectionEnd = newCursorPosition;
      }, 0);
    }
  };

  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  // Scroll Left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
      handleScroll(); // Call handleScroll after scrolling
    }
  };

  // Scroll Right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
      handleScroll(); // Call handleScroll after scrolling
    }
  };

  // Handle scroll events to toggle arrow visibility
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0); // Show left arrow if scrolled right
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth); // Show right arrow if not fully scrolled
    }
  };

  // Check if there's overflow on mount and after each render
  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      handleScroll();
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Re-check overflow when selected images change
  useEffect(() => {
    handleScroll();
  }, [selectedImageMultiple]);

  const goBackToPreviousTab = () => {
    if (isFormOpen) {
      setSelectedFile([]);
      setSelectedImageMultiple([]);
      setSelectedImage([]);
    } else {
      setIsFormOpen(true);
    }
  };

  const closeForm = (e) => {
    const className = e.currentTarget.getAttribute("id");

    // Close the form only when clicking on "screen" or "closeCircle"
    if (className === "screen" || className === "closeCircle") {
      setSelectedImage([]);
      setSelectedImageMultiple([]);
      seteditPost(false);
      setSelectedFile([]);
      setinputCheck("");
      setIsFormOpen(true);
      setCreatepost(false);
      setTaggedUser([]);
    }
  };

  const mainImg = imageData?._id
  const DeleteSelectedImages = async (id) => {
  try {
    if (editPost) {
      await axios.delete(`/api/home/post/deleteMapPost?postUpdate=${id}&mainImg=${mainImg}`);
      mutateImageData();
    }
    // Remove the selected image from selectedFile
    setSelectedFile((prev) => prev.filter((img) => img.id !== id));

    // Remove the selected image from selectedImageMultiple
    setSelectedImageMultiple((prev) => prev.filter((img) => img.id !== id));
  } catch (error) {
    console.error("Error deleting selected image:", error);
    // You can also show an error message to the user here if needed
  }
};


  // Function to handle image selection and resizing
  const handleImageSelect = async (event) => {
    const files = event.target.files; // Access the selected files

    if (files && files.length > 0) {
      // Use Promise.all to resize and map multiple files
      const newImages = await Promise.all(
        Array.from(files).map(async (file) => {
          const maxWidth = 1200;
          const maxHeight = 1200;

          // Resize the image (you can reuse your existing resizeImage function)
          const resizedImage = await resizeImage(file, maxWidth, maxHeight);

          return {
            id: uuidv4(), // Generate a unique ID
            file: resizedImage, // Resized image
            url: URL.createObjectURL(resizedImage), // Object URL for rendering
            filter: {
              filter: " ",
              invert: 0,
              blur: 0,
              brightness: 100,
              contrast: 100,
              grayscale: 0,
              hue_rotate: 0,
              saturate: 100,
              sepia: 0,
            }, // Default filter values
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
      setSelectedImage(newImages[0]);
      setSelectedImageMultiple((prev) => [...prev, ...newImages.slice(0, 10 - prev.length)]);
    }
    event.target.value = "";
  };

  const customCodeStyle = {
    fontFamily: "Zilla Slab, serif", // Set your custom font here
    fontSize: "1.6rem", // Set your custom font size
  };

  return (
    <>
      {createpost && MediaQueries && (
        <MobPost
          imageData={imageData}
          session={session}
          syntaxCode={syntaxCode}
          mutateImageData={mutateImageData}
          outputCode={outputCode}
          inputCheck={inputCheck}
          setinputCheck={setinputCheck}
          code={code}
          setCode={setCode}
          output={output}
          setOutput={setOutput}
        />
      )}

      {createpost && (
        <div id="screen" className={styles.screen} onClick={closeForm}>
          <div className={styles.Divide} onClick={(e) => e.stopPropagation()} >
            {selectedFile?.length == 0 ? (
              <>
                <div className={styles.input_left} style={{ background: router.pathname !== "/ide" ? undefined : "#1b1918" }} >
                  {router.pathname !== "/ide" ? (
                    <>
                      <label htmlFor="photo" className={styles.photo_icons}>
                        <div className={styles.photo_border} >
                          <div className={styles.photo_border1} >
                            <div className={styles.photo_border2} >
                              <IoMdPhotos
                                className={styles.photo_icon}
                              />
                              .
                              <p>Add a Photo</p>
                            </div>
                          </div>
                        </div>
                      </label>
                      <input
                        className={styles.hiddenInput}
                        type="file"
                        multiple
                        id="photo"
                        accept="image/*"
                        onChange={handleImageSelect}
                      /* Handle image selection */
                      />
                    </>
                  ) : (
                    <>
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
                          }}
                        >
                          {syntaxCode}
                        </SyntaxHighlighter>
                      </div>
                      <div className={styles.moreImages} style={{paddingLeft:".5rem"}}>
                        <pre
                          className={styles.multipleMagesCode}
                          style={{
                            color: "white", width: "100%",
                          }}
                        >
                          {outputCode}

                        </pre>

                      </div>
                    </>

                  )}
                  {showEmojis && (
                    <div
                      id="emoji-open"
                      className={styles.emojipicker}
                      ref={emojiRef}
                    >
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        //  theme={Theme.AUTO}
                        skinTonesDisabled
                        emojiStyle={EmojiStyle.APPLE}
                        suggestedEmojisMode={SuggestionMode.RECENT}
                        emojiVersion="0.6"
                        width="25vw"
                        height={410}
                      />
                    </div>
                  )}
                </div>
                <Form
                  userdp={userdp}
                  name={name}
                  ImageData={imageData}
                  handleEmojiModal={handleEmojiModal}
                  toggle={toggle}
                  setToggle={setToggle}
                  handleEmojiClick={handleEmojiClick}
                  textareaRef={textareaRef}
                  inputCheck={inputCheck}
                  setinputCheck={setinputCheck}
                  showEmojis={showEmojis}
                  setShowEmojis={setShowEmojis}
                  emojiRef={emojiRef}
                  closeForm={closeForm}
                  syntaxCode={syntaxCode}
                  outputCode={outputCode}
                  mutateImageData={mutateImageData}
                />
              </>
            ) : (
              <>
                <div className={styles.filter_left} style={{ padding: selectedImage.length <= 0 ? "0rem 0rem .5rem 0rem" : ".5rem" }} >
                  {!editPost && (
                    <>
                      <div className={styles.backArrowIcon}>
                        <IoArrowBackCircle
                          className={styles.icon1}
                          onClick={goBackToPreviousTab}
                        />
                      </div>
                    </>
                  )}
                  {selectedImage.length <= 0 ? (
                    <>
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
                          }}
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                      <div className={styles.moreImages} style={{paddingLeft:".5rem"}}>
                          <pre
                            className={styles.multipleMagesCode}
                            style={{
                              color: "white", width: "100%",
                            }}
                          >
                            {output}

                          </pre>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.filter_img}>
                        <Image
                          src={selectedImage?.url}
                          style={{
                            objectFit: "contain",
                            filter:
                              !editPost &&
                              `${selectedImage?.filter.filter} invert(${selectedImage?.filter.invert}%) blur(${selectedImage?.filter.blur}px) brightness(${selectedImage?.filter.brightness}%) contrast(${selectedImage?.filter.contrast}%) grayscale(${selectedImage?.filter.grayscale}%) hue-rotate(${selectedImage?.filter.hue_rotate}deg) saturate(${selectedImage?.filter.saturate}%) sepia(${selectedImage?.filter.sepia}%)`,
                          }}
                          alt="postImage"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          objectPosition="center"
                        />
                      </div>

                      <div className={styles.moreImages}>
                        {showLeftArrow && (
                          <button
                            onClick={scrollLeft}
                            className={styles.arrowButtonStyle}
                            style={{ left: 0 }}
                          >
                            <FaChevronCircleLeft />
                          </button>
                        )}
                        <div className={styles.multipleMagesCover} ref={scrollRef} style={{ maxWidth: selectedImageMultiple?.length > 9 || imageData?.images ? "100%" : undefined }} >
                          {selectedImageMultiple?.map((value, index) => (
                            <div
                              key={value.id}
                              className={styles.multipleMages}
                              onClick={() => setSelectedImage(value)}
                            >
                              <>
                                {imageData?.images ?

                                  imageData?.images[0]?._id !== value.id && (
                                    <div
                                      className={styles.DeleteSelected}
                                      onClick={() =>
                                        DeleteSelectedImages(value.id)
                                      }
                                    >
                                      <FaTimesCircle />
                                    </div>
                                  ) :
                                  <div
                                    className={styles.DeleteSelected}
                                    onClick={() =>
                                      DeleteSelectedImages(value.id)
                                    }
                                  >
                                    <FaTimesCircle />
                                  </div>
                                }
                              </>

                              <Image
                                src={value.url}
                                style={{
                                  objectFit: "cover",
                                  filter:
                                    !editPost &&
                                    `${value.filter.filter} invert(${value.filter.invert}%) blur(${value.filter.blur}px) brightness(${value.filter.brightness}%) contrast(${value.filter.contrast}%) grayscale(${value.filter.grayscale}%) hue-rotate(${value.filter.hue_rotate}deg) saturate(${value.filter.saturate}%) sepia(${value.filter.sepia}%)`,
                                }}
                                alt="postImage"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                quality={2}
                              />
                            </div>
                          ))}
                        </div>
                        {showRightArrow && (
                          <button onClick={scrollRight} className={styles.arrowButtonStyle} style={{ right: selectedImageMultiple?.length > 9 || imageData?.images ? '0rem' : "5rem" }}>
                            <FaChevronCircleRight />
                          </button>
                        )}
                        {selectedImageMultiple?.length <= 9 && (
                          <div>
                            {!editPost && <label
                              className={styles.AddMoreIcon}
                              htmlFor="photo"
                            >
                              <FaCirclePlus className={styles.icon1} />
                            </label>}

                            <input
                              className={styles.hiddenInput}
                              type="file"
                              multiple
                              id="photo"
                              accept="image/*"
                              onChange={handleImageSelect}
                            /* Handle image selection */
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {showEmojis && (
                    <div
                      id="emoji-open"
                      className={styles.emojipicker}
                      ref={emojiRef}
                    >
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        //  theme={Theme.AUTO}
                        skinTonesDisabled
                        emojiStyle={EmojiStyle.APPLE}
                        suggestedEmojisMode={SuggestionMode.RECENT}
                        emojiVersion="0.6"
                        width="25vw"
                        height={410}
                      />
                    </div>
                  )}
                </div>
                {isFormOpen && !editPost ? (
                  <Filter />
                ) : (
                  <Form
                    userdp={userdp}
                    name={name}
                    ImageData={imageData}
                    handleEmojiModal={handleEmojiModal}
                    toggle={toggle}
                    setToggle={setToggle}
                    handleEmojiClick={handleEmojiClick}
                    textareaRef={textareaRef}
                    inputCheck={inputCheck}
                    setinputCheck={setinputCheck}
                    showEmojis={showEmojis}
                    setShowEmojis={setShowEmojis}
                    emojiRef={emojiRef}
                    closeForm={closeForm}
                    outputCode={outputCode}
                    mutateImageData={mutateImageData}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Post;
