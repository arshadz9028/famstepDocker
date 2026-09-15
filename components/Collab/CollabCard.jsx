import React, { useRef, useState, useEffect, useContext, useCallback } from "react";
import styles from "../../pages/collab/gigs.module.scss";
import Image from "next/image";
import PostTag from "../post/PostTag";
import { AiFillHeart, AiOutlineSend } from "react-icons/ai";
import { BsCollectionFill } from "react-icons/bs";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import EditPost from "../../layouts/models/EditCollab";
import SendPost from "../post/SendPost";
import { useRouter } from "next/router";
import PostLikeList from "../post/PostLikeList";
import { FaDotCircle } from "react-icons/fa";
import ShareModal from "../shared/ShareModal";
import { PiShareFat } from "react-icons/pi";
import IncompleteProfileModal from './IncompleteProfileModal';

function CollabCard({ subRequest, setselectCollabData, setSubRequest, isEditCollab, setIsEditCollab, value, session, time, mutateImageData, lenOfFollower, setOpenDetails }) {

  const likedUser =
    value?.likes?.length !== 0
      ? value?.likes?.map((user, index) => user.username)
      : null;

  const savedPostUser =
    value?.collections?.length !== 0
      ? value?.collections?.map((id) => id)
      : null;

  const [likes, setLikes] = useState(value?.likes?.length);

  const [isLiked, setIsLiked] = useState(
    likedUser?.includes(session.user.username)
  );
  const [IsSaved, setIsSaved] = useState(
    savedPostUser?.includes(session?.user.id)
  );

  // State variable to control the visibility of EditPost component
  const [showEditPost, setShowEditPost] = useState(false);
  const [tDotId, settDotId] = useState("");
  const [sendModel, setsendModel] = useState(false);
  const [Listlike, setListlike] = useState(false);
  // const [subRequest, setSubRequest] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const captionRef = useRef(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareOptionsOpen, setShareOptionsOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showIncompleteProfileModal, setShowIncompleteProfileModal] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    if (captionRef.current) {
      const computedStyle = getComputedStyle(captionRef.current);
      let lineHeight = parseFloat(computedStyle.lineHeight);
      // Agar line-height "normal" hai, toh default estimate le le (approx 1.2 times font-size)
      if (isNaN(lineHeight)) {
        lineHeight = parseFloat(computedStyle.fontSize) * 1.2;
      }
      const maxHeight = lineHeight * 3; // 3 lines ki height
      if (captionRef.current.scrollHeight > maxHeight) {
        setShowToggle(true);
      }
    }
  }, [value.desc]);
  const router = useRouter();

  const handleDots = (id) => {
    setShowEditPost(!showEditPost);
    settDotId(id);
  };

  const postLiked = async (id) => {
    // showLike(id);
    setLikes(isLiked ? likes - 1 : likes + 1), setIsLiked(!isLiked);
    await axios.put("/api/collab/likedCollab", { id });
    mutateImageData();
  };
  const postSaved = (id) => {
    // savePostx(id);
    setIsSaved(!IsSaved);
  };

  const imageData = value;

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (sendModel || showShareOptions) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [sendModel, showShareOptions]);

  const handleProfileClick = (id) => {
    router.push(`/profile/${id}`);
  };

  const handleLikeList = () => {
    if (likes !== 0) {
      setListlike(true);
      // handleLikeList()
    }
  };
  const collbId = value?._id;
  const handleProposal = async () => {
    setSubRequest(true);
    setselectCollabData(value);
    // try {
    //   await axios.put(`/api/collab/reqCollab?collabId=${collbId}`);
    // } catch (error) {
    //   console.error(error);
    // }
  };
  const isSubmitted = Array.isArray(value?.collabRequests) &&
    value.collabRequests.some(req => req?.userid?._id == session?.user?.id);

  const handleShareClick = () => {
    // Get the actual value data with thorough fallbacks
    const title = value?.title ? value.title : 'Check out this collaboration';
    const description = value?.description ? value.description : 'A great collaboration opportunity on Famstep';

    // Ensure we can form a proper URL even if _id is missing
    let url = window.location.href;
    if (value?._id) {
      url = `${window.location.origin}/collab/${value._id}`;
    }

    // Create a complete shareData object with all required fields
    const shareData = {
      title: title,
      text: description,
      url: url
    };

    setShareData(shareData);
    setShareModalOpen(true);
  };
  const checkProfileCompletion = () => {
    const requiredFields = {
      bio: session?.user?.userBio,
      skills: session?.user?.skills,
      location: session?.user?.location,
      designation:session?.user?.designation,
      
      // Add any other required fields
    };

    const missing = Object.entries(requiredFields)
      .filter(([_, value]) => !value || value.length === 0)
      .map(([key]) => key);

    return missing;
  };

  const handleSubmitProposal = () => {
    const missingProfileFields = checkProfileCompletion();
    
    if (missingProfileFields.length > 0) {
      setMissingFields(missingProfileFields);
      setShowIncompleteProfileModal(true);
      return;
    }

    // If profile is complete, proceed with proposal submission
    setselectCollabData(value);
    setSubRequest(true);
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
          />
        </>
      )}
      {sendModel && <SendPost setsendModel={setsendModel} value={value} />}
      <EditPost
        imageData={imageData}
        sessionUser={session}
        mutateImageData={mutateImageData}
        postId={value?._id}
        setShowEditCollab={setShowEditPost}
        tDotId={value?._id}
        showEditCollab={showEditPost}
        setOpenDetails={setOpenDetails}
        setIsEditCollab={setIsEditCollab}
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
              onClick={(e) => { 
                setselectCollabData(value); 
                handleDots(value._id) }}
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

        <div className={styles.TagButton}>
          <div className={styles.langugeButtonCover}>
            <div className={styles.collabType}>
              <FaDotCircle />
              {value?.collaborationType}
            </div>
          </div>

          {value?.userid?._id !== session.user.id && (
            <div className={styles.langugeButtonCover} >
              {isSubmitted ?
                <button className={styles.langugeButton}>Submitted</button> :
                <button className={styles.langugeButton} onClick={handleSubmitProposal}>Submit Proposal</button>
              }
            </div>
          )}
        </div>
        <h1>{value?.title}</h1>

        <div className={styles.collabMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Duration:</span>
            <span className={styles.metaValue}>{value.durationReq}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>| Collaboration Type:</span>
            <span className={styles.metaValue}>{value.collaborationType}</span>
          </div>
          {value.rate && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>-</span>
              <span className={styles.metaValue}>₹{value.rate}/hr</span>
            </div>
          )}
        </div>

        <h2>Roles Required</h2>
        <div className={styles.roles}>
          {value.roles.map((role, index) => (
            <div key={index} className={styles.roleCard}>
              <h4>{role.role}</h4>
              <div className={styles.skillsList}>
                <span className={styles.skillsLabel}>Skills:</span>
                {Array.isArray(role.skills) && role.skills.length > 0 ? (
                  <span className={styles.skillsTags}>
                    {role.skills.join(', ')}
                  </span>
                ) : (
                  <span className={styles.noSkills}>No skills specified</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.post_caption}>
          <pre
            ref={captionRef}
            style={{
              display: "-webkit-box",
              fontSize: "16px",
              WebkitLineClamp: expanded ? "unset" : 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "1.5",
            }}
          >
            {value?.desc}
          </pre>
          {showToggle && (
            <button onClick={() => setExpanded(!expanded)} className={styles.toggleButton}>
              {expanded ? "See Less" : "See More"}
            </button>
          )}
        </div>


        <div className={styles.count_likes_comment}>
          <p className={styles.likes} onClick={handleLikeList}>
            {likes} <span>Likes</span>
          </p>
          {/* <p className={styles.comments}>
            {imageData?.comments.length} <span>Comments</span>
          </p> */}
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
              icons={PiShareFat}
              title={"Share"}
              style={{
                cursor: "pointer",
                color: "black",
              }}
              onClick={handleShareClick}
            />
            {/* <PostTag
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
            /> */}
          </div>
        </div>
      </div>

      {/* Using the new ShareModal component */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareData={shareData}
      />

      <IncompleteProfileModal 
        isOpen={showIncompleteProfileModal}
        onClose={() => setShowIncompleteProfileModal(false)}
        missingFields={missingFields}
      />
    </>
  );
}

export default CollabCard;
