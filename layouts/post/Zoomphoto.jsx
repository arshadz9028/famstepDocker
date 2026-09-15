import React, { useState, useEffect, useContext, useCallback } from "react";
import styles from "../../styles/Zoomphoto.module.scss";
import Image from "next/image";
import { ContextProvider } from "../../global/context";
import PostTag from "../../components/post/PostTag";
import { IoCloseCircleSharp } from "react-icons/io5";
import { AiFillHeart } from "react-icons/ai";
import { PiShareFat } from "react-icons/pi";
import { BiComment } from "react-icons/bi";
import { BsCollectionFill } from "react-icons/bs";
import RightComment from "../../components/post/RightComment";
import CommentSecFull from "../../components/post/CommentSecFull";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierForestDark } from "../../node_modules/react-syntax-highlighter/dist/cjs/styles/hljs";
import ShareModal from "../../components/shared/ShareModal";
import MobileZoomPhoto from "../../components/home/MobileZoomPhoto";
import useSWR, { mutate } from "swr";
import SendPost from "../../components/post/SendPost";
// import EditComment from "../layouts/models/EditComment";
import axios from "axios";
async function fetchZoom(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
function Zoomphoto(props) {
  const {
    Openmodal,
    showLike,
    savePostx,
    setCommenter,
    commenter,
    Closemodal,
    zoomId,
    show,
    setShow,
    reply,
    setReply,
    Zoomphoto,
    model,
  } = useContext(ContextProvider);
  const [heartLike, setHeartLike] = useState(Zoomphoto.syncLike);
  const [isLiked, setIsLiked] = useState(Zoomphoto.likeIcon);
  const [IsSaved, setIsSaved] = useState(Zoomphoto.saveIcon);
  // Fetch Image Data using SWR
  const [position, setPosition] = useState({ x: null, y: null, z: null });
  const [sendModel, setsendModel] = useState(false);
  const [MediaQueries, setMediaQueries] = useState(false);
// Add state for ShareModal
const [shareModalOpen, setShareModalOpen] = useState(false);
const [shareData, setShareData] = useState(null);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setMediaQueries(window.innerWidth <= 767);
    };

    // Initial check
    checkMobile();


    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const {
    data: commentsData,
    mutate: mutateComment,
    error: imageDataError,
  } = useSWR(`/api/home/post/zoomPhotoFetch?userPostId=${zoomId}`, fetchZoom);
  const imageData = commentsData?.data;
  const [selectedUserImage, setSelectedUserImage] = useState(imageData);

  const [currentIndex, setCurrentIndex] = useState(0); // Track current image index

  const totalImages = Zoomphoto?.images?.length; // Get total number of images

  // Handle clicking "next" arrow
  const handleNextImage = () => {
    if (currentIndex < totalImages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Handle clicking "previous" arrow
  const handlePrevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
 // Add handleShareClick function
 const handleShareClick = () => {
  // Get the base URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  // Create the post URL
  const postUrl = `${baseUrl}/post/${Zoomphoto.postId}`;
  
  // Prepare title and description
  const title = Zoomphoto?.title || Zoomphoto?.desc?.substring(0, 60) || "Check out this post";
  const description = Zoomphoto?.desc
    ? (Zoomphoto.desc.length > 160 ? Zoomphoto.desc.substring(0, 157) + '...' : Zoomphoto.desc)
    : "";
  
  // Create share data object
  const shareDataObj = {
    title: title,
    text: description,
    url: postUrl
  };

  // Update state to open modal
  setShareData(shareDataObj);
  setShareModalOpen(true);
};
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide(1);
  }, [currentSlide]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide(0);
  }, [currentSlide]);

  // Function to handle post liking
  const postLiked = (id) => {
    showLike(id);
    setHeartLike(isLiked ? heartLike - 1 : heartLike + 1);
    setIsLiked(!isLiked);
  };

  const postSaved = (id) => {
    savePostx(id);
    setIsSaved(!IsSaved);
  };

  // Function to handle closing the form/modal
  const closeform = (e) => {
    const className = e.target.getAttribute("id");
    if (className === "Zoomphoto_main_zphoto__dG8eX") {
      setReply(false);
      Closemodal();
      setCommenter(true);
      setShow(false);
    }
    // Router.push(`/home`);
  };

  // Function to handle opening a photo
  const openPhoto = (id) => {
    Openmodal(id);
  };

  const customCodeStyle = {
    fontFamily: "Zilla Slab, serif", // Set your custom font here
    fontSize: "1.6rem", // Set your custom font size
  };

  const handleClick = (e, commentNumber) => {
    const rect = e.target.getBoundingClientRect();

    const x = rect.right;
    const y = rect.top;
    const z = rect.bottom;

    setPosition({ x, y, z });
  };
  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (model) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [model]);
  return (
    <>
      {model && (
        <MobileZoomPhoto
          dp={props.dp}
          userName={props.userName}
          sessionUser={props.session}
          imageData={imageData}
          mutateImageData={props.mutateImageData}
          commentsData={commentsData}
          mutateComment={mutateComment}
          languageTag={Zoomphoto.languageTag}
          likes={props.likes}
          setMediaQueries={setMediaQueries}
        />
      )}

      {sendModel && <SendPost setsendModel={setsendModel} value={Zoomphoto} />}

      <div
        id="Zoomphoto_main_zphoto__dG8eX"
        className={styles.main_zphoto}
        onClick={closeform}
      >
        <IoCloseCircleSharp
          onClick={() => {
            Closemodal();
            setShow(false);
            setCommenter(true);
          }}
          className={styles.close_full_Section}
        />
        <div className={styles.full_section}>
          {/* photo and postTag wala Part */}
          <div className={styles.vertical}>
            <>
              <div
                id={styles.upper_div}
                className={
                  commenter
                    ? styles.upper_div
                    : `${styles.upper_div} ${styles.upper_divFullComments}`
                }
              >
                {Zoomphoto?.images[0]?.image === "" ? (
                  <div className={styles.carouselContainer}>
                    {currentSlide !== 0 && (
                      <button
                        className={styles.carousel_arrow_left}
                        style={{
                          background: "rgba(255, 254, 254, 0.284)",
                          color: "rgba(255, 255, 255, 0.315)",
                          top: "50%",
                        }}
                        onClick={handlePrevSlide}
                        aria-label="Previous Image"
                      >
                        &#9664; {/* Unicode for left arrow */}
                      </button>
                    )}

                    {currentSlide === 0 ? (
                      <pre className={styles.codeFrame}>
                        <SyntaxHighlighter
                          wrapLongLines={true}
                          language="python"
                          style={atelierForestDark}
                          codeTagProps={{ style: customCodeStyle }}
                          customStyle={{
                            whiteSpace: "pre-wrap", // Wrap the text
                            wordBreak: "break-all", // Break long words
                            wordWrap: "break-word",
                            padding: "1.5rem",
                          }}
                        >
                          {Zoomphoto.pracsUrl}
                        </SyntaxHighlighter>
                      </pre>
                    ) : (
                      <div className={styles.OutputWrite}>
                        <p>Output</p>
                        <pre
                          className={styles.codeFrame}
                          style={{
                            wordBreak: "break-all",
                            wordWrap: "break-word",
                            padding: "1.5rem",
                            color: "white",
                            fontSize: "1.6rem",
                          }}
                        >
                          {Zoomphoto.output}
                        </pre>
                      </div>
                    )}

                    {currentSlide === 0 && (
                      <button
                        className={styles.carousel_arrow_right}
                        onClick={handleNextSlide}
                        style={{
                          background: "rgba(255, 254, 254, 0.284)",
                          color: "rgba(255, 255, 255, 0.315)",
                          top: "50%",
                        }}
                        aria-label="Next Image"
                      >
                        &#9654; {/* Unicode for right arrow */}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={styles.post_image}>
                    {totalImages > 1 && currentIndex > 0 && (
                      <button
                        className={styles.carousel_arrow_left}
                        onClick={handlePrevImage}
                        aria-label="Previous Image"
                      >
                        &#9664; {/* Unicode for left arrow */}
                      </button>
                    )}
                    <Image
                      src={Zoomphoto?.images[currentIndex]?.image}
                      key={Zoomphoto?.images[currentIndex]?._id}
                      priority
                      unoptimized
                      onClick={() => {
                        openPhoto(Zoomphoto.postId);
                      }}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      style={{ objectFit: "contain" }}
                      className={styles.upper_divImges}
                      alt="postedImage"
                    />

                    {/* Right arrow (next) */}
                    {totalImages > 1 && currentIndex < totalImages - 1 && (
                      <button
                        className={styles.carousel_arrow_right}
                        onClick={handleNextImage}
                        aria-label="Next Image"
                      >
                        &#9654; {/* Unicode for right arrow */}
                      </button>
                    )}
                    {/* Image counter */}
                    {totalImages > 1 && (
                      <div className={styles.image_counter}>
                        {currentIndex + 1}/{totalImages}
                      </div>
                    )}
                  </div>
                )}

                {commenter && (
                  <div className={styles.seeSomments}>
                    <p onClick={(e) => setCommenter(!commenter)}>
                      See all comments
                    </p>
                  </div>
                )}

                {/* Left arrow (previous) */}
              </div>
            </>
            <div
              className={
                commenter
                  ? styles.lower_div
                  : `${styles.lower_div} ${styles.lower_divFullComments}`
              }
            >
              <div className={styles.bottom_sec}>
                <div className={styles.icons_likes}>
                  <PostTag
                    icons={AiFillHeart}
                    title={"Like"}
                    likes={props.likes}
                    count={heartLike}
                    isLiked={isLiked}
                    onClick={() => postLiked(Zoomphoto.postId)}
                    style={{
                      cursor: "pointer",
                      ...(isLiked
                        ? {
                          color: "red",
                          stroke: "red",
                        }
                        : {
                          color: "white",
                          stroke: "black",
                          strokeWidth: "8rem",
                        }),
                    }}
                  />

                  <PostTag
                    icons={BiComment}
                    title={"Comment"}
                    count={imageData?.comments.length}
                    style={{
                      cursor: "pointer",
                      color: "black",
                    }}
                    onClick={(e) => setCommenter(!commenter)}
                  />

                  <PostTag
                    icons={PiShareFat}
                    title={"Share"}
                    style={{
                      cursor: "pointer",
                      color: "black",
                    }}
                    onClick={handleShareClick}
                  />

                  <PostTag
                    icons={BsCollectionFill}
                    onClick={() => {
                      postSaved(Zoomphoto.postId);
                    }}
                    title={"Save"}
                    style={{
                      cursor: "pointer",
                      ...(IsSaved
                        ? {
                          color: "black",
                          stroke: "black",
                        }
                        : {
                          color: "white",
                          stroke: "black",
                          strokeWidth: "0.1rem",
                        }),
                    }}
                    isSaved={IsSaved}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* right wala section of selected comment */}
          <div className={styles.coverRight_sec}>
            <div
              className={
                commenter
                  ? styles.right_sec
                  : `${styles.right_sec} ${styles.right_secFullComment}`
              }
              style={{
                paddingTop: commenter ? "1rem" : undefined,
                position: reply ? "relative" : undefined,
                zIndex: reply ? "-1" : undefined,
              }}
            >
              {commenter ? (
                <>
                  <div className={styles.pro_photo}>
                    <Image
                      src={Zoomphoto.dp}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectFit: "cover",
                      }}
                      alt="userImage"
                    />
                  </div>

                  <div className={styles.line}></div>
                  <div className={styles.scrollNone}>
                    {imageData?.comments
                      .slice()
                      .sort((a, b) => b.like.length - a.like.length)
                      .slice(0, 9)
                      .map((commentData, index) => {
                        return (
                          <div
                            key={commentData._id}
                            className={styles.child_photo}
                            onMouseEnter={(e) => {
                              setShow(true);
                              setSelectedUserImage(commentData._id);
                              setReply(false);
                              handleClick(e, index);
                              // commentLiked(commentData._id)
                            }}
                          >
                            <Image
                              src={commentData?.user.image}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{
                                objectFit: "cover",
                              }}
                              alt="commentImage"
                            />
                          </div>
                        );
                      })}
                  </div>
                  {imageData?.comments
                    .filter((comment) => comment._id === selectedUserImage)
                    .map((commentData) => (
                      <RightComment
                        key={commentData._id} // Add a unique key here
                        commentData={commentData}
                        likedComment={commentData.like.length}
                        likedUser={
                          commentData.like.length !== 0
                            ? commentData.like.map(
                              (user, index) => user.username
                            )
                            : null
                        }
                        mutateD={props.mutateImageData}
                        userName={props.userName}
                        position={position}
                      />
                    ))}
                </>
              ) : (
                <>
                  {/* full view page */}
                  <CommentSecFull
                    // key={index}
                    mutateComment={mutateComment}
                    mutateD={props.mutateImageData}
                    userName={props.userName}
                    sessionUser={props.session}
                    postId={Zoomphoto.postId}
                    commentlength={imageData?.comments.length}
                    commentData={imageData}
                    dp={Zoomphoto.dp}
                    sessionDp={props.dp}
                    imageData={imageData}
                    languageTag={Zoomphoto.languageTag}
                    commentsData={commentsData}
                  />
                  {/* {imageData?.comments
                   .filter((comment) => comment._id === selectedUserImage)
                    .map((commentData, index) => (
                      <CommentSecFull
                        key={index}
                        mutateD={props.mutateImageData}
                        userName={props.userName}
                        postId={Zoomphoto.postId}
                        commentlength={commentData.length}
                        commentData={commentData}
                        dp={Zoomphoto.dp}
                        sessionDp={props.dp}
                        imageData={imageData}
                      />
                    ))} */}
                </>
              )}
            </div>
          </div>
          {/* <div
            className={
              show && commenter
                ? `${styles.anotherBox}`
                : ` ${styles.anotherInvisibleBox}`
            }
          ></div> */}
        </div>
      </div>
        {/* presenting code */}
        <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareData={shareData}
      />
    </>
  );
}

export default Zoomphoto;
