import React, { useState, useEffect, useContext, useCallback } from "react";
import Image from "next/image";
import styles from "../../styles/Zoomphoto.module.scss";
import PostTag from "../post/PostTag";
import { AiFillHeart } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { BsCollectionFill } from "react-icons/bs";
import { PiShareFat } from "react-icons/pi";
import ShareModal from "./ShareModal";
import { IoCloseCircleSharp } from "react-icons/io5";
import CommentSecFull from "../../components/post/CommentSecFull";
import axios from "axios";
import { useSession } from "next-auth/react";
import { mutate } from "swr";
import { useRouter } from "next/router";


const ShareablePostCard = ({
  post,
  time,
  onLike,
  onSave,
  onShare,
  isLiked,
  isSaved,
  heartLike,
  setHeartLike,
  commentsData,mutateComment,mutateinitialData
}) => {
  // All useState hooks defined at the top to avoid linter errors
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [userImageError, setUserImageError] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  // const [heartLike, setHeartLike] = useState(post?.likes?.length || 0);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localIsSaved, setLocalIsSaved] = useState(isSaved);
  const [commenter, setCommenter] = useState(true);
  const [show, setShow] = useState(false);
  const [reply, setReply] = useState(false);
//   const [commentsData, setCommentsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  // All useCallback functions defined before any conditional returns
  const handleNextSlide = useCallback(() => {
    setCurrentSlide(1);
  }, [currentSlide]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide(0);
  }, [currentSlide]);

  // Initialize baseUrl on client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
      fetchComments();
    }
  }, []);

  // Fetch comments for this post
  const fetchComments = async () => {
    if (!post?._id) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/home/post/zoomPhotoFetch?userPostId=${post._id}`
      );
      if (response.data?.data) {
        // setImageData(response.data.data);
        // setCommentsData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setLoading(false);
    }
  };

  // Get the main image URL with proper fallback
  let mainImageUrl = `${baseUrl}/noavatar.png`; // Default fallback

  try {
    if (post?.images && Array.isArray(post.images) && post.images.length > 0) {
      const firstImage = post.images[0];
      if (firstImage && typeof firstImage === "object" && firstImage.image) {
        const imagePath = firstImage.image;
        if (typeof imagePath === "string" && imagePath.trim() !== "") {
          mainImageUrl = imagePath.startsWith("http")
            ? imagePath
            : `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
        }
      }
    }
  } catch (error) {
    console.error("Error processing image URL:", error);
  }

  // Get post creator's profile image
  let userImage = `${baseUrl}/noavatar.png`;
  try {
    if (
      post?.userid?.image &&
      typeof post.userid.image === "string" &&
      post.userid.image.trim() !== ""
    ) {
      userImage = post.userid.image.startsWith("http")
        ? post.userid.image
        : `${baseUrl}${post.userid.image.startsWith("/") ? "" : "/"}${
            post.userid.image
          }`;
    }
  } catch (error) {
    console.error("Error processing user image URL:", error);
  }
  // Handle Share Click
  const handleShareClick = () => {
    if (typeof window === "undefined") return;

    const postUrl = `${baseUrl}/post/${post?._id}`;

    const shareDataObj = {
      title: post?.title || "Check out this post",
      text: post?.desc || "",
      url: postUrl,
    };

    setShareData(shareDataObj);
    setShareModalOpen(true);

    if (onShare) {
      onShare(post?._id);
    }
  };

  if (!post) {
    return <div className={styles.post_card}>Loading post data...</div>;
  }

  const totalImages = post?.images?.length || 0; // Get total number of images from post

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
  // Function to handle post liking
  const postLiked = async (id) => {
    if (status === "authenticated") {
      // onLike(id);
      setHeartLike(isLiked ? heartLike - 1 : heartLike + 1);
      setLocalIsLiked(!localIsLiked);
      const response = await axios.put("/api/home/post/likePost", { id });
      // mutate(`/api/home/shareImageFetch?profile=${id}`);
      mutateinitialData()
    } else {
      router.push("/login");
    }
  };
  const likedUser =
    post?.likes?.length !== 0
      ? post?.likes?.map((user, index) => user.username)
      : null;
  const savedPostUser =
    post?.collections?.length !== 0 ? post?.collections?.map((id) => id) : null;

  const postSaved = async (id) => {
    if (status === "authenticated") {
      const response = await axios.put("/api/home/post/savePost", { id });
      // mutate(`/api/home/shareImageFetch?profile=${id}`);
      mutateinitialData()
      setLocalIsSaved(!localIsSaved);
      //   onSave(id);
    } else {
      router.push("/login");
    }

  };

  // Function to open photo (placeholder)
  const openPhoto = (id) => {
  };

  // Function to handle send model
  const handleSendClick = () => {
  };
  const imageData = commentsData?.data;

  return (
    <div className={styles.post_card}>
      <div className={styles.full_section_share}>
        {/* photo and postTag wala Part */}
        <div className={styles.vertical}>
          <>
            <div
              id={styles.upper_div}
              className={`${styles.upper_div_share} ${styles.upper_divFullComments}`}
            >
              <div className={styles.post_image_share}>
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
                  src={post.images[currentIndex]?.image || mainImageUrl}
                  key={post.images[currentIndex]?._id || currentIndex}
                  priority
                  unoptimized
                  onClick={() => {
                    openPhoto(post._id);
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
            </div>
          </>
          <div className={`${styles.lower_div_share}`}>
            <div className={styles.bottom_sec}>
              <div className={styles.icons_likes}>
                <PostTag
                  icons={AiFillHeart}
                  title={"Like"}
                  likes={post._id}
                  count={post?.likes?.length}
                  isLiked={likedUser?.includes(session?.user?.username)}
                  onClick={() => postLiked(post._id)}
                  style={{
                    cursor: "pointer",
                    ...(likedUser?.includes(session?.user?.username)
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
                  count={post?.comments?.length || 0}
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
                    postSaved(post._id);
                  }}
                  title={"Save"}
                  style={{
                    cursor: "pointer",
                    ...(savedPostUser?.includes(session?.user?.id)
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
                  isSaved={localIsSaved}
                />
              </div>
            </div>
          </div>
        </div>

        {/* right wala section of selected comment */}
        <div className={styles.coverRight_sec}>
          <div className={styles.right_sec_share}>
            {/* full view page */}
            {/* {imageData && ( */}
              <CommentSecFull
                mutateComment={mutateComment}
                mutateD={mutateComment}
                userName={session?.user?.username}
                sessionUser={session}
                postId={post._id}
                commentlength={post?.comments?.length || 0}
                commentData={post}
                dp={post.userid?.image || "/noavatar.png"}
                sessionDp={session?.user?.image || "/noavatar.png"}
                imageData={imageData}
                languageTag={post.languageTag || ""}
                commentsData={commentsData}
              />
            {/* )} */}
          </div>
        </div>
      </div>
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareData={shareData}
      />
    </div>
  );
};

export default ShareablePostCard;
