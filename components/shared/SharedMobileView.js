import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import styles from "../../styles/MobileZoomPhoto.module.scss";
import Image from "next/image";
import PostTag from "../post/PostTag";
import { AiFillHeart, AiOutlineSend } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { BsCollectionFill } from "react-icons/bs";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import EditPost from "../../layouts/models/EditPost";
import { imageAspectRatio } from "../../utils/imageAspectRatio";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierForestDark } from "../../node_modules/react-syntax-highlighter/dist/cjs/styles/hljs";
import SendPost from "../post/SendPost";
import { DateFormatted } from "../../config/userPostTime";
import Zoom from "../post/zoom";
import EditComment from "../../layouts/models/EditComment";
import ClosePart from "../../components/profileComp/ClosePart";
import { FaDotCircle } from "react-icons/fa";
import { ContextProvider } from "../../global/context";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { makeLinksClickable } from "../../utils/textUtils";
import { PiShareFat } from "react-icons/pi";
import ShareModal from "../shared/ShareModal";
import { useRouter } from "next/router";
import { mutate } from "swr";
function SharedMobileView(props) {
  const {
    Openmodal,
    showLike,
    savePostx,
    setCommenter,
    commenter,
    zoomId,
    Zoomphoto,
    setmodel,
    setZoomphoto,Closemodal
  } = useContext(ContextProvider);
  // Use props directly
  const [comment, setComment] = useState("");
const [heartLike, setHeartLike] = useState(0);
const [isLiked, setIsLiked] = useState(false);
const [IsSaved, setIsSaved] = useState(false);

useEffect(() => {
  if (props?.imageData) {
    const likedUser =
      props?.imageData.likes?.length > 0
        ? props?.imageData.likes.map((user) => user.username)
        : [];
    const savedPostUser =
      props?.imageData.collections?.length > 0
        ? props?.imageData.collections.map((id) => id)
        : [];

    setHeartLike(props.imageData.likes?.length || 0);
    setIsLiked(likedUser.includes(props?.sessionUser?.username));
    setIsSaved(savedPostUser.includes(props?.sessionUser?.id));
  }
}, [props.imageData, props.sessionUser, props.session]);
  // Fetch Image Data using SWR

  const [sendModel, setsendModel] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false); // State variable to control the visibility of EditPost component
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [commentCount, setCommentCount] = useState(
    props.imageData?.comments?.length || 0
  );
  const [currentIndex, setCurrentIndex] = useState(0); // Track current image index
  const totalImages = props.imageData?.images?.length || 0; // Get total number of images with fallback
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = router.pathname.split("/")[1];
  // Add state for ShareModal
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide(1);
  }, [currentSlide]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide(0);
  }, [currentSlide]);

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

  // Fetch function
  const imageData = props.imageData;
  const likedDa = props.imageData?.likes?.map((user) => user.username);
  const isLL = likedDa?.includes(props.userName);
 
  const postLiked = (id) => {
    if (status === "authenticated") {
    showLike(id);
    setHeartLike(isLiked ? heartLike - 1 : heartLike + 1);
    setIsLiked(!isLiked);
  } else {
    router.push("/login");
  }
  };

  // console.log("Zoomphoto", Zoomphoto);
  const postSaved = (id) => {
    if (status === "authenticated") {
    savePostx(id);
    setIsSaved(!IsSaved);
  } else {
    router.push("/login");
  }
  };

  // Function to handle opening a photo
  const openPhoto = (id) => {
    // This is a placeholder function since we're not using context
  };

  // Add handleShareClick function
  const handleShareClick = () => {
    // Get the base URL
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    // Create the post URL
    const postUrl = `${baseUrl}/post/${props.imageData?._id}`;

    // Prepare title and description
    const title =
      props.imageData?.title ||
      props.imageData?.desc?.substring(0, 60) ||
      "Check out this post";
    const description = props.imageData?.desc
      ? props.imageData.desc.length > 160
        ? props.imageData.desc.substring(0, 157) + "..."
        : props.imageData.desc
      : "";

    // Create share data object
    const shareDataObj = {
      title: title,
      text: description,
      url: postUrl,
    };

    // Update state to open modal
    setShareData(shareDataObj);
    setShareModalOpen(true);
  };

  const customCodeStyle = {
    fontFamily: "Zilla Slab, serif", // Set your custom font here
    fontSize: "1.6rem", // Set your custom font size
  };

  const [imageHeight, setImageHeight] = useState({
    width: "",
    height: "",
  });
  const useWidth = useRef(580);

  // Add default values for user data
  const userData = {
    name: imageData?.userid?.name || "User",
    username: imageData?.userid?.username || "username",
    image: imageData?.userid?.image || "/noavatar.png",
  };

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
        useWidth.current = 565; // Default width if none of the conditions are met
      }
    };

    const callAsyncFunc = async () => {
      handleResize();
      window.addEventListener("resize", handleResize);

      // Add null check for images
      const images = props.imageData?.images || [];

      const allAspectRatios = await Promise.all(
        images.map((img) => imageAspectRatio(img.image, 730, useWidth.current))
      );

      // Find the minimum width and height
      let minWidth = Math.min(...allAspectRatios.map((ar) => ar.width));
      let minHeight = Math.min(...allAspectRatios.map((ar) => ar.height));
      // Ensure minimum size is 400px
      minWidth = Math.max(minWidth, useWidth.current);
      minHeight = Math.max(minHeight, minHeight);

      if (images.length > 1 && minHeight <= 250) {
        minHeight = Math.max(minHeight, 380);
      }

      setImageHeight({ width: minWidth, height: minHeight });
    };

    callAsyncFunc();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [props.imageData]);

  const date = new Date(imageData?.createdAt || new Date());
  const handleReplyClick = async (commentId) => {
    try {
      // Find the comment or reply based on commentId
      let commentOrReply = props.commentsData?.data?.comments?.find(
        (val) =>
          val._id === commentId ||
          val.reply?.some((reply) => reply._id === commentId)
      );

      if (commentOrReply) {
        let usernameToReply = commentOrReply.user?.username || "User";
        if (commentOrReply._id !== commentId) {
          // Find the reply within the comment
          const replyToReply = commentOrReply.reply?.find(
            (reply) => reply._id === commentId
          );
          if (replyToReply) {
            usernameToReply = replyToReply.ReplyUser?.username || "User";
          }
        }
        setComment(`@${usernameToReply} `);
        setReplyingToCommentId(commentId);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (replyingToCommentId) {
        // Handle comment reply
        await axios.post(
          `/api/home/comment/commentReply?userPostId=${props.imageData?._id}&CommentId=${replyingToCommentId}`,
          { comment }
        );
        if (props.mutateComment) {
          props.mutateComment();
        }
        setReplyingToCommentId(null);
      } else {
        // Handle new comment
        await axios.post(
          `/api/home/comment/commentPost?userPostId=${props.imageData?._id}`,
          {
            comment,
          }
        );
        if (props.mutateComment) {
          props.mutateComment();
        }
        setCommentCount(commentCount + 1);
      }
    } catch (error) {
      console.error(error);
    }

    setComment("");
  };
  const session1 =
    pathname === "home" ? props.sessionUser : { user: props.sessionUser };
  return (
    <>
      {sendModel && (
        <SendPost setsendModel={setsendModel} value={props.imageData} />
      )}
      <EditPost
        imageData={props.imageData}
        sessionUser={session1}
        mutateImageData={props.mutateImageData}
        postId={props.imageData?._id}
        setShowEditPost={setShowEditPost}
        tDotId={props.imageData?._id}
        showEditPost={showEditPost}
        mutateComment={props.mutateComment}
      />
      <EditComment
        userName={props.userName}
        commentFetch={props.commentsData?.data?.comments}
        mutateImageData={props.mutateComment}
      />

      {/* Add ShareModal component */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareData={shareData}
      />

      <div className={styles.post_card}>
      <div
          onClick={() => {
            // setmodel(false);
            Closemodal();
          }}
        >
          <ClosePart title={"Post"} linkBar={"home"} />
        </div>
        <div className={styles.postCardCover}>
          <div className={styles.right_expand}>
            <div className={styles.image_time}>
              <div className={styles.senderPost_img_circle}>
                <Image
                  src={props.imageData?.userid?.image || userData.image}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                  alt="post_upload_user_dp"
                />
              </div>
              <div className={styles.name_time}>
                <p className={styles.post_name}>{userData.name}</p>
                <p className={styles.time}>{DateFormatted(date)}</p>
              </div>
            </div>
            <div className={styles.fullaction}>
              <div
                className={styles.prof_icon}
                onClick={() => {
                  setShowEditPost(true); // Toggle the visibility of EditPost component
                }}
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
          <div className={styles.post_caption}>
            {props?.languageTag && (
              <div className={styles.langugeButtonCover}>
                <div className={styles.langugeButton}>
                  <FaDotCircle />
                  {props?.languageTag}
                </div>
              </div>
            )}

            {imageData?.desc && (
              <>
                <pre className={styles.descComment}>
                  {makeLinksClickable(imageData?.desc)}
                </pre>
              </>
            )}
          </div>

          <div className={styles.cover_post_image}>
            {/* if else */}
            {props.imageData?.images?.[0]?.image === "" ? (
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
                      className={styles.code_section}
                      customStyle={{
                        whiteSpace: "pre-wrap", // Wrap the text
                        wordBreak: "break-all", // Break long words
                        wordWrap: "break-word",
                        overflowX: "hidden", // Hide horizontal overflow
                        padding: "1rem 2rem 2rem",
                      }}
                    >
                      {props.imageData?.pracsUrl || ""}
                    </SyntaxHighlighter>
                  </pre>
                ) : (
                  <pre className={styles.codeFrame}>
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
                        padding: "1rem 2rem 2rem",
                      }}
                    >
                      {props.imageData?.output || ""}
                    </SyntaxHighlighter>
                  </pre>
                )}

                {currentSlide === 0 && (
                  <button
                    className={styles.carousel_arrow_right}
                    style={{
                      background: "rgba(255, 254, 254, 0.284)",
                      color: "rgba(255, 255, 255, 0.315)",
                      top: "50%",
                    }}
                    onClick={handleNextSlide}
                    aria-label="Next Image"
                  >
                    &#9654; {/* Unicode for right arrow */}
                  </button>
                )}
              </div>
            ) : (
              <div
                className={styles.post_image}
                id="post_image"
                style={{
                  width: "98vw",
                  height: `${imageHeight.height}px`,
                }}
              >
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

                <Image
                  src={
                    props.imageData?.images?.[currentIndex]?.image ||
                    "/noavatar.png"
                  }
                  key={
                    props.imageData?.images?.[currentIndex]?._id ||
                    `image-${currentIndex}`
                  }
                  priority
                  unoptimized
                  onClick={() => {
                    openPhoto(props.imageData?._id);
                  }}
                  alt="postedImage"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  style={{
                    objectFit: "contain",
                  }}
                  className={styles.postImg_control}
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
          </div>
          <div className={styles.count_likes_comment}>
            <p className={styles.likes}>
              {heartLike} <span>Likes</span>
            </p>
            <p className={styles.comments}>
              {imageData?.comments?.length || 0} <span>Comments</span>
            </p>
          </div>
          <div className={styles.icons_likes}>
            <div className={styles.icons_likesCover}>
              <PostTag
                icons={AiFillHeart}
                title={"like"}
                likes={props.likes}
                isLiked={isLiked}
                onClick={() => postLiked(props.imageData?._id)}
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
                onClick={(e) => console.log("Comment clicked")}
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
                  postSaved(props.imageData?._id);
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
          <div className={styles.borderDivider} />
          {/* <div className={styles.postCardCoverSecond}> */}
          {/* <div className={styles.ZoomCommentCover}> */}
          {props.commentsData?.data?.comments.length > 0 ? (
            <>
              {props.commentsData?.data?.comments
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((value, index) => (
                  <Zoom
                    key={value._id} // Add this key prop
                    value={value}
                    likedCommUser={
                      value.like?.length !== 0
                        ? value.like.map((user, index) => user.username)
                        : null
                    }
                    replyLength={
                      value.reply?.length !== 0
                        ? value.reply.reduce(
                            (totalLikes, reply) =>
                              totalLikes + (reply.likeReply?.length || 0),
                            0
                          )
                        : 0
                    }
                    likedReplyUser={
                      value.reply?.length !== 0 &&
                      value.reply.some((reply) => reply.likeReply?.length > 0)
                        ? value.reply.flatMap((reply) =>
                            reply.likeReply.map((user) => user.username)
                          )
                        : null
                    }
                    userName={props.userName}
                    commentData={imageData}
                    mutateD={props.mutateComment}
                    likedUser={props.likedUser}
                    handleReplyClick={handleReplyClick}
                  />
                ))}
            </>
          ) : (
            <div className={styles.no_comments}>
              <p>No comments yet</p>
            </div>
          )}
        </div>
        {status === "authenticated" ? (
          <form className={styles.add_comment} onSubmit={handleSubmit}>
            <div className={styles.add_commentCover}>
              <div className={styles.post_img_circle}>
                <Image
                  src={props.dp}
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
        ) : (
          <div className={styles.signupPrompt}>
            <Link href="/auth/signin">
              <span className={styles.signupLink}>Log in </span>
            </Link>
            to like or comments.
          </div>
        )}
      </div>
    </>
  );
}

export default SharedMobileView;
