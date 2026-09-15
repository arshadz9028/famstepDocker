import React, { useState, useContext } from "react";
import Image from "next/image";
import Zoom from "./zoom";
import heart from "../../assets/icons/heart.png";
import { BsFillCaretDownFill, BsFillCaretRightFill } from "react-icons/bs";
import styles from "../../styles/Zoomphoto.module.scss";
import { ContextProvider } from "../../global/context";
import { AiFillHeart } from "react-icons/ai";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import axios from "axios";
import { DateSection } from "../../config/userPostTime";

export default function RightComment(props) {
  const { show, commenter, setCommenter, zoomId, CommentID } =
    useContext(ContextProvider);
  const [likes, setLikes] = useState(props.commentData.like.length);
  const [isLiked, setIsLiked] = useState(
    props.likedUser?.includes(props.userName)
  );
  const [replyLikes, setReplyLikes] = useState(0);
  const [isreplyLiked, setIsreplyLiked] = useState(false);
  const router = useRouter();
  const { userPostId } = router.query;

  const userCommentId = props.commentData?._id;
  const date = new Date(props.commentData?.createdAt);
  const handleLikeC = async () => {
    await axios.post(
      `/api/home/comment/likeComments?CommentId=${userCommentId}&userPostId=${zoomId}`
    );
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    props.mutateD();
  };
  const handleLikeR = async (id) => {
    try {
      await axios.post(
        `/api/home/comment/likeReplyComm?CommentId=${id}&userPostId=${userPostId}`
      );
      setIsreplyLiked(!isreplyLiked);
      setReplyLikes(isreplyLiked ? replyLikes - 1 : replyLikes + 1);
    } catch (error) {
      console.error("Error while making the API request:", error);
    }
    props.mutateD();
  };

  const generateCommentId = async (id) => {
    CommentID(id);
  };


  return (
    <>
      {commenter && (
        <>
          <div
            className={
              show
                ? `${styles.Comments_sec} ${styles.visi2}`
                : `${styles.Comments_sec} ${styles.visi1}`
            }
            style={{
              height: "auto",
              top:  `${props.position.y}px`,
              left: `${props.position.x}px`,
              transition:`width ease-in-out .8s`,
            }
            }
            onClick={() => {
              setCommenter(false);
            }}
          >
            <div className={styles.reply}>
              <div className={styles.head}>
                <p > {props.commentData.user?.name}</p>
                <p style={{color:"gray", fontWeight:"500"}} >{DateSection(date)}</p>
              </div>
              <div className={styles.ChatText}>{props.commentData.comment}</div>
            </div>
            <div className={styles.like_comments}>
              <div className={styles.logo}>
                <AiFillHeart
                  onClick={handleLikeC}
                  style={
                    props.likedUser?.includes(props.userName)
                      ? { color: "red", stroke: "red" }
                      : { color: "white", stroke: "black", strokeWidth: "5rem" }
                  }
                />
              </div>
              <div className={styles.likes}>
                <p>{props.likedComment} Likes</p>
              </div>
              <div
                className={styles.reply1}

              >
                <p>Reply</p>
              </div>
            </div>

            {props.commentData.reply.length > 0 &&
              <div
                className={styles.replies}
               
              >
                { props.commentData.reply.length}
                <p>replies</p>
              </div>
            }

            <div
              className={styles.more_comm}

            >
              View more comments
            </div>
          </div>
        </>
      )}
    </>
  );
}
