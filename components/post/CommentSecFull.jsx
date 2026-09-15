import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "../../styles/Zoomphoto.module.scss";
import Zoom from "./zoom";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { ContextProvider } from "../../global/context";
import axios from "axios";
import { DateFormatted, DateSection } from "../../config/userPostTime";
import EditPost from "../../layouts/models/EditPost";
import { useRouter } from "next/router";
import EditComment from "../../layouts/models/EditComment";
import { FaDotCircle } from "react-icons/fa";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { makeLinksClickable } from "../../utils/textUtils";

export default function CommentSecFull(props) {
  const [comment, setComment] = useState("");
  const [commentCount, setCommentCount] = useState(props.commentlength);
  const [showEditPost, setShowEditPost] = useState(false); // State variable to control the visibility of EditPost component
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const {
    setReply,
    Closemodal,
    setCommenter,
    setShow,
    zoomId,
    commenter
  } = useContext(ContextProvider);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleReplyClick = async (commentId) => {
    try {
      // Find the comment or reply based on commentId
      let commentOrReply = props.commentsData?.data?.comments.find(
        (val) =>
          val._id === commentId ||
          val.reply.some((reply) => reply._id === commentId)
      );

      if (commentOrReply) {
        let usernameToReply = commentOrReply.user.username;
        if (commentOrReply._id !== commentId) {
          // Find the reply within the comment
          const replyToReply = commentOrReply.reply.find(
            (reply) => reply._id === commentId
          );
          if (replyToReply) {
            usernameToReply = replyToReply.ReplyUser.username;
          }
        }
        setComment(`@${usernameToReply} `);
        setReplyingToCommentId(commentId);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const mutate1 = props?.mutateD
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (replyingToCommentId) {
        // Handle comment reply
        await axios.post(
          `/api/home/comment/commentReply?userPostId=${zoomId}&CommentId=${replyingToCommentId}`,
          { comment }
        );
        props.mutateComment();

        setReplyingToCommentId(null);
      } else {
        // Handle new comment
        await axios.post(`/api/home/comment/commentPost?userPostId=${zoomId}`, {
          comment,
        });
        props.mutateComment();
        setCommentCount(commentCount + 1);
      }
    } catch (error) {
      console.error(error);
    }
    // mutate1();
    setComment("");
  };

  const date = new Date(props.imageData?.createdAt);

  const commentInputRef = useRef(null);
  useEffect(() => {
    // Focus the input field when the comment is pre-filled
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [comment]);

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (!commenter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [!commenter]);

  const handleProfileClick = (id) => {
    router.push(`/profile/${id}`);
    setReply(false);
    Closemodal();
    setCommenter(true);
    setShow(false);
  };
  return (
    <>
      <EditPost
        imageData={props.imageData}
        sessionUser={props.sessionUser}
        mutateImageData={props.mutateD}
        postId={zoomId}
        setShowEditPost={setShowEditPost}
        tDotId={zoomId}
        showEditPost={showEditPost}
        mutateComment={props.mutateComment}

      />

      <EditComment
        userName={props.userName}
        commentFetch={props.commentsData?.data?.comments}
        mutateImageData={props.mutateComment}
      />

      <div className={styles.right_full}>
        <div className={styles.right_expand}>
          <div className={styles.right_exp1}>
            <div
              className={styles.pro_photo}
              style={{ cursor: "pointer" }}
              onClick={() => handleProfileClick(props.imageData?.userid?._id)}
            >
              <Image
                src={props.dp}
                alt="pro_photo"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <div className={styles.name_time}>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => handleProfileClick(props.imageData?.userid?._id)}
              >
                {props.commentData?.userid.name}
              </p>
              <p>{DateFormatted(date)}</p>
            </div>
          </div>
          {status === "authenticated" &&
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
            </div>}
        </div>

        <div className={styles.line}></div>

        {/* <ScrollableFeed Default='true' >  */}
        <div className={styles.full_comment}>
          <div>
            {props?.languageTag &&
              <div className={styles.langugeButtonCover} >
                <div className={styles.langugeButton}>
                  <FaDotCircle />
                  {props?.languageTag}
                </div>
              </div>
            }

            {props.imageData?.desc && (
              <div className={styles.descCommentCover}>
                <pre className={styles.descComment}>{makeLinksClickable(props.imageData?.desc)}</pre>
                <p className={styles.descTime}>{DateSection(date)}</p>
              </div>
            )}
          </div>

          <div className={props.commentsData?.data?.comments.length > 0 ? styles.comments_container : styles.empty_comments_container}>
            {props.commentsData?.data?.comments.length > 0 ? (
              <>
                {props.commentsData?.data?.comments
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((value, index) => (
                    <Zoom
                      key={index} // Add this key prop
                      value={value}
                      likedCommUser={
                        value.like.length !== 0
                          ? value.like.map((user, index) => user.username)
                          : null
                      }
                      replyLength={
                        value.reply.length !== 0
                          ? value.reply.reduce(
                            (totalLikes, reply) =>
                              totalLikes + (reply.likeReply?.length || 0),
                            0
                          )
                          : 0
                      }
                      likedReplyUser={
                        value.reply.length !== 0 &&
                          value.reply.some((reply) => reply.likeReply?.length > 0)
                          ? value.reply.flatMap((reply) =>
                            reply.likeReply.map((user) => user.username)
                          )
                          : null
                      }
                      userName={props.userName}
                      commentData={props.commentData}
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
        </div>
        {/* </ScrollableFeed> */}

        {status === "authenticated" ?
          <form className={styles.add_comment} onSubmit={handleSubmit}>
            <div className={styles.post_img_circle}>
              <Image
                src={props.sessionDp}
                alt="pro_photo"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <input
              type="text"
              className={styles.addcomment}
              placeholder="Add comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!props.imageData?.commentsEnable}
              ref={commentInputRef}
            />
            <button
              disabled={!props.imageData?.commentsEnable || comment.trim() === ""}
              type="submit"
              className={styles.Post_comment}
              style={{
                backgroundColor:
                  !props.imageData?.commentsEnable || comment.trim() === ""
                    ? "rgba(10, 102, 194, 0.5)"
                    : "#08529B",
              }}
            >
              Post
            </button>
          </form>
          :
          <div className={styles.signupPrompt}>

            <Link href="/auth/signin">
              <span className={styles.signupLink}>Log in </span>
            </Link>
            to like or comments.
          </div>
        }
      </div>
    </>
  );
}
