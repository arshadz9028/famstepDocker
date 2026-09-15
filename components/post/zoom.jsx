import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "../../styles/Zoomphoto.module.scss";
import Image from "next/image";
import { BsFillCaretDownFill, BsFillCaretRightFill } from "react-icons/bs";
import { DateSection } from "../../config/userPostTime";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { ContextProvider } from "../../global/context";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/router";
import useLongPress from "../TouchAndPressButton/useLongPress";
import DoubleTapMob from "../TouchAndPressButton/DoubleTapMob";
import { useSession } from 'next-auth/react';
import { useModal } from "../../global/ModalContext";

export default function Zoom(props) {
  const { CommentId, CommentID, zoomId, showEditComment, setshowEditComment } =
    useContext(ContextProvider);
  const [likes, setLikes] = useState(props.value?.like.length);
  const [isLiked, setIsLiked] = useState(
    props.likedCommUser?.includes(props.userName)
  );
  const [replyLikes, setreplyLikes] = useState(0);
  const [isreplyLiked, setIsreplyLiked] = useState(false);
  const [reply, setreply] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openAuthModal } = useModal();

  /* handling Comment Like */
  const handleLikeC = async (id) => {
    if (status !== "authenticated") {
      openAuthModal('login', 'like');
      return;
    }
    
    try {
      await axios.post(
        `/api/home/comment/likeComments?CommentId=${id}&userPostId=${zoomId}`
      );
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error("Error while making the API request:", error);
    }
    props.mutateD();
  };
  /* handling ReplyComment Like */
  const handleLikeR = async (id) => {
    if (status !== "authenticated") {
      openAuthModal('login', 'like');
      return;
    }
    
    try {
      await axios.post(
        `/api/home/comment/likeReplyComm?CommentId=${id}&userPostId=${zoomId}`
      );
      setIsreplyLiked(!isreplyLiked);
      setreplyLikes(isreplyLiked ? replyLikes - 1 : replyLikes + 1);
    } catch (error) {
      console.error("Error while making the API request:", error);
    }
    props.mutateD();
  };

  const generateCommentId = async (id) => {
    CommentID(id);
  };

  const date = new Date(props.value?.createdAt);

  // longPressFunc
  const onLongPress = () => {
    if (status !== "authenticated") {
      openAuthModal('login', 'threeDots');
      return;
    }
    
    setshowEditComment(!showEditComment); // Toggle the visibility of EditPost component
    generateCommentId(props.value._id);
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 700,
  };
  const longPressEvent = useLongPress(onLongPress, defaultOptions);

  const handleReplyClick = (id) => {
    if (status !== "authenticated") {
      openAuthModal('login', 'reply');
      return;
    }
    
    props.handleReplyClick(id);
    generateCommentId(id);
  };

  return (
    <>
      <div className={styles.down_reply}>
        <div className={styles.logo1}>
          <Image
            src={props.value.user.image}
            alt="logo1"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover"
            }}
          />
        </div>
        <div className={styles.left1}>
          <div className={styles.comment} {...longPressEvent}>
            <div className={styles.head}>
              <p>{props.value.user.name}</p>
              <p>{DateSection(date)}</p>
            </div>
            <pre
              className={styles.ChatText}
              onDoubleClick={() => {
                if (!isLiked) {
                  handleLikeC(props.value._id);
                  generateCommentId(props.value._id);
                }
              }}
              onTouchEnd={(e) => {
                if (DoubleTapMob(e)) {
                  handleLikeC(props.value._id);
                  generateCommentId(props.value._id);
                }
              }}
            >
              {props.value?.comment}
            </pre>
          </div>

          <div className={styles.like_comments}>
            <div
              className={styles.logo}
              onClick={() => {
                handleLikeC(props.value._id);
                generateCommentId(props.value._id);
              }}
            >
              <AiFillHeart
                style={
                  props.likedCommUser?.includes(props.userName)
                    ? { color: "red", stroke: "red" }
                    : { color: "white", stroke: "black", strokeWidth: "7rem" }
                }
              />
            </div>
            <div className={styles.likes}>
              <p>{props.value.like.length} Likes</p>
            </div>
            <div
              className={styles.reply1}
              onClick={() => handleReplyClick(props.value._id)}
            >
              <p>Reply</p>
            </div>
            { status === "authenticated" &&
              <div
                className={styles.dots}
                onClick={(e) => {
                  setshowEditComment(!showEditComment); // Toggle the visibility of EditPost component
                  generateCommentId(props.value._id);
                }}
              >
                <BsThreeDots />
              </div>}
            { status !== "authenticated" &&
              <div
                className={styles.dots}
                onClick={() => openAuthModal('login', 'threeDots')}
              >
                <BsThreeDots />
              </div>}
          </div>
          {/* {showEditComment &&

            } Render the EditPost component based on showEditPost state */}

          {props.value.reply.length !== 0 ? (
            <div
              className={styles.replies}
              onClick={() => {
                setreply((reply) => !reply);
                generateCommentId(props.value._id);
              }}
            >
              {reply ? <BsFillCaretDownFill /> : props.value.reply.length}
              <p>replies</p>
            </div>
          ) : (
            <></>
          )}

          {/* replyComment section */}
          {reply ? (
            <>
              {props.value.reply.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((val, index) => {
                const mappedLike = val.likeReply.map((like) => like.username);
                const dateReply = new Date(val?.createdAt);
                return (
                  <div className={styles.reply_section} key={index}>
                    <div className={styles.logoPic}>
                      <Image
                        src={val.ReplyUser.image}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          objectFit: "cover"
                        }}
                        alt="logoPic"
                      />
                    </div>
                    <div className={styles.replyOpen}>
                      <div div className={styles.reply}>
                        <div className={styles.head}>
                          <p>{val.ReplyUser.name}</p>
                          <p>{DateSection(dateReply)}</p>
                        </div>
                        <pre
                          className={styles.ChatText}
                          onTouchEnd={(e) => {
                            if (DoubleTapMob(e)) {
                              handleLikeR(val._id);
                              generateCommentId(val._id);
                            }
                          }}
                          onDoubleClick={() => {
                            handleLikeR(val._id);
                            generateCommentId(val._id);
                          }}
                        >
                          {val.ReplyComment}
                        </pre>
                      </div>
                      <div className={styles.like_comments}>
                        <div
                          className={styles.logo}
                          onClick={() => {
                            handleLikeR(val._id);
                            generateCommentId(val._id);
                          }}
                        >
                          <AiFillHeart
                            style={
                              mappedLike.includes(props.userName)
                                ? { color: "red", stroke: "red" }
                                : {
                                  color: "white",
                                  stroke: "black",
                                  strokeWidth: "7rem",
                                }
                            }
                          />
                        </div>
                        <div className={styles.likes}>
                          <p>{val.likeReply.length} Likes</p>
                        </div>
                        <div
                          className={styles.reply1}
                          onClick={() => handleReplyClick(val._id)}
                        >
                          <p>Reply</p>
                        </div>
                        { status === "authenticated" &&
                          <div
                            className={styles.dots}
                            onClick={(e) => {
                              setshowEditComment(!showEditComment); // Toggle the visibility of EditPost component
                              generateCommentId(val._id);
                            }}
                          >
                            <BsThreeDots />
                          </div>}
                        { status !== "authenticated" &&
                          <div
                            className={styles.dots}
                            onClick={() => openAuthModal('login', 'threeDots')}
                          >
                            <BsThreeDots />
                          </div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
