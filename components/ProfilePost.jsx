import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Profile.module.scss";
import { AiFillHeart } from "react-icons/ai";
import { MdChatBubble } from "react-icons/md";
import Image from "next/image";
import { ContextProvider } from "../global/context";
import { atelierForestDark } from "../node_modules/react-syntax-highlighter/dist/cjs/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import { TbBoxMultiple } from "react-icons/tb";
import EditPost from "../layouts/models/EditPost";
function ProfilePost(props) {
  const { Openmodal, setZoomphoto, zoom, resserver, sendRes ,showEditPost,setShowEditPost} =
    useContext(ContextProvider);
  const liked = props.postData?.likes?.length;
  const likeduser =
    props.postData?.likes?.length !== 0
      ? props.postData?.likes?.map((user, index) => user.username)
      : null;
  const savedPostUser =
    props.postData?.collections?.length !== 0
      ? props.postData?.collections?.map((id) => id)
      : null;
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const [likes, setLikes] = useState(liked);
  const [isLiked, setIsLiked] = useState(likeduser?.includes(props.userName));
  const [IsSaved, setIsSaved] = useState(savedPostUser?.includes(props.userId));
  useEffect(() => {
    if (zoom) {
      if (sendRes && props.userId == sendRes.data.data.userId) {
        const Setuser = sendRes.data.data.PostCollections.map((post) => post);

        setIsSaved(Setuser?.includes(props.postData?._id));
      }
      if (resserver && props.postData?._id === resserver.data.data._id) {
        setLikes(resserver.data.data.likes.length);
        const likedUser =
          resserver.data.data.likes.length !== 0
            ? resserver.data.data.likes.map((user, index) => user.username)
            : null;
        setIsLiked(likedUser?.includes(props.userName));
      }
    }
    /* included dependency after it was showing as a warning */
  }, [
    zoom,
    sendRes,
    props.userId,
    props.postData?._id,
    props.userName,
    resserver,
  ]);
  const Openmodalfunc = (id) => {
    setZoomphoto({
      images: props.postData?.images,
      desc: props.postData?.desc,
      pracsUrl: code,
      likeCounts: liked,
      output: output,
      likeIcon: isLiked,
      postId: props.postData?._id,
      syncLike: likes,
      saveIcon: IsSaved,
      dp: props.postData?.userid?.image,
      languageTag: props.postData?.languageTag,
    });
    Openmodal(id);
  };
  const codepath = props.postData?.pracsUrl;

  useEffect(() => {
    const fetchCode = async () => {
      try {
        if (codepath) {
          const response = await fetch(codepath);
          const codeContent = await response.text();
          const match = codeContent.match(/`([^`]*)`/);
          const extractedCode = match && match[1] ? match[1] : "";

          setCode(extractedCode);
          const responseOutput = await fetch(props.postData?.outputUrl);
          const codeContentOutput = await responseOutput.text();
          setOutput(codeContentOutput);
        }
      } catch (error) {
        console.error("Error fetching code:", error);
      }
    };
    fetchCode();
  }, [codepath]);

  const customCodeStyle = {
    fontFamily: "Zilla Slab, serif", // Set your custom font here
    fontSize: "2rem", // Set your custom font size
  };
  return (
    <>
      <EditPost
        imageData={props.postData}
        sessionUser={props.session}
        mutateImageData={props.mutateImageData}
        postId={props.postData?._id}
        setShowEditPost={setShowEditPost}
        tDotId={props.postData?._id}
        showEditPost={showEditPost}
        // allUsers={allUsers}
      />{" "}
      <div
        className={styles.cards}
        onClick={() => Openmodalfunc(props.postData?._id)}
      >
        {props.postData?.images[0].image === "" ? (
          <SyntaxHighlighter
            wrapLongLines={true}
            language="python"
            style={atelierForestDark}
            codeTagProps={{ style: customCodeStyle }}
            className={styles.profile_gallery_img}
            customStyle={{
              whiteSpace: "pre-wrap", // Wrap the text
              wordBreak: "break-all", // Break long words
              wordWrap: "break-word",
              overflowX: "hidden", // Hide horizontal overflow
              padding: "1rem 2rem 2rem",
            }}
          >
            {code}
          </SyntaxHighlighter>
        ) : (
          <>
            <Image
              alt="userPost"
              priority
              src={props.postData?.images[0].image}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: "contain",
              }}
              className={styles.profile_gallery_img}
            />
            )
          </>
        )}
        {props.postData?.images.length > 1 && (
          <div className={styles.multiple}>
            <TbBoxMultiple className={styles.multipleSvg} />
          </div>
        )}
        <div className={styles.hover_icons}>
          <div className={styles.hover_icons_cover}>
            <div className={styles.hoverPostIconsCover}>
              <div className={styles.hoverPostIcons}>
                <AiFillHeart className={styles.PostReactIcons} />
              </div>
              <p className={styles.hoverCount}>{likes}</p>
            </div>
            <div className={styles.hoverPostIconsCover}>
              <div className={styles.hoverPostIcons}>
                <MdChatBubble className={styles.PostReactIcons} />
              </div>
              <p className={styles.hoverCount}>
                {props.postData?.comments?.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePost;
