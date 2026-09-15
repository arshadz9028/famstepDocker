import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import styles from "../../styles/Home.module.scss";
import Image from "next/image";
import PostTag from "./PostTag";
import { AiFillHeart } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { BsCollectionFill } from "react-icons/bs";
import axios from "axios";
import { ContextProvider } from "../../global/context";
import { BsThreeDots } from "react-icons/bs";
import EditPost from "../../layouts/models/EditPost";
import { imageAspectRatio } from "../../utils/imageAspectRatio";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierForestDark } from "../../node_modules/react-syntax-highlighter/dist/cjs/styles/hljs";
import SendPost from "./SendPost";
import { useRouter } from "next/router";
import PostLikeList from "./PostLikeList";
import { FaDotCircle } from "react-icons/fa";
import { PiShareFat } from "react-icons/pi";
import ShareModal from "../shared/ShareModal";
import { makeLinksClickable } from "../../utils/textUtils";

function Postcard({ value, session, time, mutateImageData, lenOfFollower }) {
  const {
    Openmodal,
    showLike,
    setZoomphoto,
    zoom,
    resserver,
    savePostx,
    sendRes,
    setCommenter,
  } = useContext(ContextProvider);
  const likedUser =
    value?.likes.length !== 0
      ? value?.likes.map((user, index) => user.username)
      : null;

  const savedPostUser =
    value?.collections.length !== 0 ? value?.collections.map((id) => id) : null;

  const [likes, setLikes] = useState(value?.likes.length);

  const [isLiked, setIsLiked] = useState(
    likedUser?.includes(session.user.username)
  );
  const [IsSaved, setIsSaved] = useState(
    savedPostUser?.includes(session?.user.id)
  );

  const [comment, setComment] = useState("");
  // State variable to control the visibility of EditPost component
  const [showEditPost, setShowEditPost] = useState(false);
  const [tDotId, settDotId] = useState("");
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [commentCount, setCommentCount] = useState(value?.comments.length);
  const [sendModel, setsendModel] = useState(false);
  const [Listlike, setListlike] = useState(false);
  const [imageHeight, setImageHeight] = useState({
    width: "",
    height: "",
  });

  const [currentIndex, setCurrentIndex] = useState(0); // Track current image index

  const totalImages = value?.images?.length; // Get total number of images

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide(1);
  }, [currentSlide]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide(0);
  }, [currentSlide]);

  // Handle clicking "next" arrow
  const handleNextImage = useCallback(() => {
    if (currentIndex < totalImages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex]);

  // Handle clicking "previous" arrow
  const handlePrevImage = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const useWidth = useRef(580);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 280) {
        useWidth.current = 250;
      } else if (width <= 429) {
        useWidth.current = 380;
      } else if (width <= 472) {
        useWidth.current = 430;
      } else if (width <= 680) {
        useWidth.current = 520;
      } else if (width <= 970) {
        useWidth.current = 600;
      } else if (width < 1193) {
        useWidth.current = 457;
      } else {
        useWidth.current = 700; // Default width if none of the conditions are met
      }
    };

    const callAsyncFunc = async () => {
      handleResize();
      window.addEventListener("resize", handleResize);

      const allAspectRatios = await Promise.all(
        value?.images.map((img) =>
          imageAspectRatio(img.image, 550, useWidth.current)
        )
      );

      // Find the minimum width and height
      let minWidth = Math.min(...allAspectRatios.map((ar) => ar.width));
      let minHeight = Math.min(...allAspectRatios.map((ar) => ar.height));
      // Ensure minimum size is 400px
      minWidth = Math.max(minWidth, useWidth.current);
      minHeight = Math.max(minHeight, minHeight);

      if (value?.images.length > 1 && minHeight <= 250) {
        minHeight = Math.max(minHeight, 380);
      }

      setImageHeight({ width: minWidth, height: minHeight });
    };

    callAsyncFunc();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [value]);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {   
    const fetchCode = async () => {
      try {
        if (value?.pracsUrl) {
          const response = await fetch(value?.pracsUrl);
          const codeContent = await response.text();
          const match = codeContent.match(/`([^`]*)`/);
          const extractedCode = match && match[1] ? match[1] : "";
          setCode(extractedCode);

          const responseOutput = await fetch(value?.outputUrl);
          const codeContentOutput = await responseOutput.text();
          setOutput(codeContentOutput);
        }
      } catch (error) {
        console.error("Error fetching code:", error);
      }
    };

    fetchCode();
  }, [value?.pracsUrl]);
  const router = useRouter();

  const Openmodalfunc = (id) => {
    setZoomphoto({
      images: value?.images,
      desc: value.desc,
      pracsUrl: code,
      output: output,
      likeCounts: value.likes.length,
      likeIcon: isLiked,
      postId: value._id,
      syncLike: likes,
      saveIcon: IsSaved,
      dp: value.userid?.image,
      userPostName: value?.userid?.name,
      languageTag: value?.languageTag,
    });
    Openmodal(id);
    // router.push(`/home?userPostId=${userPostId}`);
  };

  const userPostId = value?._id;
  useEffect(() => {
    if (zoom) {
      if (sendRes && session?.user.id == sendRes.data.data.userId) {
        const Setuser = sendRes.data.data.PostCollections.map((post) => post);
        
        setIsSaved(Setuser?.includes(value._id));
      }
      if (resserver && value?._id === resserver.data.data._id) {
        setLikes(resserver.data.data.likes.length);
        const likedUser =
          resserver.data.data.likes.length !== 0
            ? resserver.data.data.likes.map((user, index) => user?.username)
            : null;
        setIsLiked(likedUser?.includes(session?.user.username));
      }
    }
  }, [
    zoom,
    sendRes,
    session.user.id,
    session.user.username,
    resserver,
    value._id,
  ]);

  const handleDots = (id) => {
    setShowEditPost(!showEditPost);
    settDotId(id);
  };

  const postLiked = (id) => {
    showLike(id);
    setLikes(isLiked ? likes - 1 : likes + 1), setIsLiked(!isLiked);
    mutateImageData();
  };
  const postSaved = (id) => {
    savePostx(id);
    setIsSaved(!IsSaved);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the comment to the server with axios
      const res = await axios.post(
        `/api/home/comment/commentPost?userPostId=${userPostId}`,
        { comment }
      );
      setCommentCount(commentCount + 1);
    } catch (error) {
      console.error(error);
    }

    mutateImageData();
    setComment("");
  };
  /* Edit post control */

  const imageData = value;

  const toggleCaption = () => {
    setIsCaptionExpanded(!isCaptionExpanded);
  };

  const customCodeStyle = {
    fontFamily: "Zilla Slab, serif", // Set your custom font here
    fontSize: "1.6rem", // Set your custom font size
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (sendModel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [sendModel]);

  const handleProfileClick = (id) => {
    router.push(`/profile/${id}`);
  };

  const handleLikeList = () => {
    if (likes !== 0) {
      setListlike(true);
      // handleLikeList()
    }
  };

  // Add state for ShareModal
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);

  // Add handleShareClick function
  const handleShareClick = () => {
    // Get the base URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    // Create the post URL
    const postUrl = `${baseUrl}/post/${value._id}`;
    
    // Prepare title and description
    const title = value?.title || value?.desc?.substring(0, 60) || "Check out this post";
    const description = value?.desc
      ? (value.desc.length > 160 ? value.desc.substring(0, 157) + '...' : value.desc)
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

  return (
    <>
      {Listlike && (
        <>
          <PostLikeList
            key={imageData._id}
            likeData={imageData.likes}
            setListlike={setListlike}
            session={session}
            follow={
              lenOfFollower?.following.length !== 0
                ? lenOfFollower?.following.map((foll) => foll.userid)
                : null
            }
          />
        </>
      )}
      {sendModel && <SendPost setsendModel={setsendModel} value={value} />}
      <EditPost
        imageData={imageData}
        sessionUser={session}
        mutateImageData={mutateImageData}
        postId={value?._id}
        setShowEditPost={setShowEditPost}
        tDotId={value?._id}
        showEditPost={showEditPost}
      />

      <div className={styles.post_card}>
        <div className={styles.right_expand}>
          <div className={styles.image_time}>
            <div
              className={styles.senderPost_img_circle}
              style={{ cursor: "pointer" }}
              onClick={() => handleProfileClick(value?.userid?._id)}
            >
              {value?.userid?.image ? (
                <Image
                  src={value?.userid?.image}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                  alt="post_upload_user_dp"
                />
              ) : (
                <Image
                  src="/noavatar.png"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                  alt="default_profile_picture"
                />
              )}
            </div>
            <div className={styles.name_time} style={{ cursor: "pointer" }}>
              <p
                className={styles.post_name}
                onClick={() => handleProfileClick(value?.userid?._id)}
              >
                {value?.userid?.name}
              </p>
              <p className={styles.time}>{time}</p>
            </div>
          </div>
          <div className={styles.fullaction}>
            <div
              className={styles.prof_icon}
              onClick={(e) => handleDots(value._id)}
            >
              <BsThreeDots
                style={{
                  width: "2rem",
                  height: "2rem",
                  fill: "#08529B",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>

        {value?.languageTag && (
          <div className={styles.langugeButtonCover}>
            <div className={styles.langugeButton}>
              <FaDotCircle />
              {value?.languageTag}
            </div>
          </div>
        )}

        <div className={styles.post_caption}>
          {value?.desc?.length > 30 ? (
            <>
              {isCaptionExpanded ? (
                <pre>
                  {makeLinksClickable(value?.desc)}
                  <span className={styles.seemore} onClick={toggleCaption}>
                    ...see less
                  </span>
                </pre>
              ) : (
                <>
                  <p>
                    {makeLinksClickable(value.desc.substring(0, 55))}
                    <span className={styles.seemore} onClick={toggleCaption}>
                      ...see more
                    </span>
                  </p>
                </>
              )}
            </>
          ) : (
            <p>{makeLinksClickable(value?.desc)}</p>
          )}
        </div>

        <div className={styles.cover_post_image}>
          {/* if else */}

          {value?.images[0]?.image == "" ? (
            <div className={styles.carouselContainer}>
              {currentSlide !== 0 && (
                <button
                  className={styles.carousel_arrow_left}
                  style={{
                    background: "rgba(255, 254, 254, 0.284)",
                    color: "rgba(255, 255, 255, 0.315)",
                    top: "55%",
                  }}
                  onClick={handlePrevSlide}
                  aria-label="Previous Image"
                >
                  &#9664; {/* Unicode for left arrow */}
                </button>
              )}

              {currentSlide === 0 ? (
                <pre
                  className={styles.codeFrame}
                  onClick={() => Openmodalfunc(value._id)}
                >
                  <SyntaxHighlighter
                    wrapLongLines={true}
                    style={atelierForestDark}
                    codeTagProps={{ style: customCodeStyle }}
                    className={styles.code_section}
                    customStyle={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                      wordWrap: "break-word",
                      overflowX: "hidden",
                      padding: "1rem 1rem 2rem",
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </pre>
              ) : (
                <div className={styles.OutputWrite}>
                  <p>Output</p>

                  <pre
                    className={styles.codeFrame}
                    onClick={() => Openmodalfunc(value._id)}
                    style={{
                      overflowY: "auto",
                      wordBreak: "break-all",
                      wordWrap: "break-word",
                      padding: " 2rem",
                      color: "white",
                      fontSize: "1.6rem",
                    }}
                  >
                    {output}
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
            <>
              <div className={styles.post_image} id="post_image">
                <style jsx>{`
                  #post_image {
                    width: 48.8vw;
                    height: ${imageHeight.height}px;
                  }
                  @media (max-width: 970px) {
                    #post_image {
                      width: 64.2vw;
                      height: ${imageHeight.height}px;
                    }
                  }
                  @media (max-width: 767px) {
                    #post_image {
                      width: 94vw;
                      height: ${imageHeight.height}px;
                    }
                  }
                  @media (max-width: 591px) {
                    #post_image {
                      width: 96vw;
                      height: ${imageHeight.height}px;
                    }
                  }
                `}</style>
                {/* Left arrow (previous) */}
                {totalImages > 1 && currentIndex > 0 && (
                  <button
                    className={styles.carousel_arrow_left}
                    onClick={handlePrevImage}
                    aria-label="Previous Image"
                  >
                    &#9664; {/* Unicode for left arrow */}
                  </button>
                )}

                {/* Display only the current image */}
                <Image
                  src={value?.images[currentIndex]?.image}
                  key={value?.images[currentIndex]?._id}
                  priority
                  unoptimized
                  onClick={() => Openmodalfunc(value._id)}
                  alt="user profile picture"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "contain",
                  }}
                  className={styles.postImg_control}
                />

                {/* Image counter */}
                {totalImages > 1 && (
                  <div className={styles.image_counter}>
                    {currentIndex + 1}/{totalImages}
                  </div>
                )}

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
              </div>
            </>
          )}
        </div>
        <div className={styles.count_likes_comment}>
          <p className={styles.likes} onClick={handleLikeList}>
            {likes} <span>Likes</span>
          </p>
          <p className={styles.comments}>
            {imageData?.comments.length} <span>Comments</span>
          </p>
        </div>
        <div className={styles.icons_likes}>
          <div className={styles.icons_likesCover}>
            <PostTag
              icons={AiFillHeart}
              title={"Like"}
              onClick={() => {
                postLiked(value?._id);
              }}
              likes={value?._id}
              isLiked={isLiked}
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
              style={{
                cursor: "pointer",
                color: "black",
              }}
              id_user={value?._id}
              onClick={(e) => {
                Openmodalfunc(value?._id);
                setCommenter(false);
              }}
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
                postSaved(value?._id);
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
            />
          </div>
        </div>
        <form className={styles.add_comment} onSubmit={handleSubmit}>
          <div className={styles.add_commentCover}>
            <div className={styles.post_img_circle}>
              <Image
                src={session?.user?.image || "/noavatar.png"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                }}
                alt="userImage"
              />
            </div>
            <input
              type="text"
              className={styles.addcomment}
              placeholder="Add comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!imageData?.commentsEnable}
            />
            <button
              disabled={!imageData?.commentsEnable || comment.trim() === ""}
              type="submit"
              className={styles.Post_comment}
              style={{
                backgroundColor:
                  !imageData?.commentsEnable || comment.trim() === ""
                    ? "rgba(10, 102, 194, 0.5)"
                    : "#08529B",
              }}
            >
              Post
            </button>
          </div>
        </form>
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

export default Postcard;
