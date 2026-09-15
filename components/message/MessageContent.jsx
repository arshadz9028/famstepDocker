import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { isSameSenderMargin, isSameUser } from "../../config/ChatLogics";
import { ContextProvider } from "../../global/context";
import { format } from "date-fns";
import styles from "../../styles/Message.module.scss";
import { imageAspectRatio } from "../../utils/imageAspectRatio";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierForestDark } from "../../node_modules/react-syntax-highlighter/dist/cjs/styles/hljs";

function MessageContent({
  message,
  user,
  messages,
  i,
  showDots,
  setShowDots,
  unsend,
  setUnsend,
  
}) {
  const { Openmodal, setZoomphoto, openUnsend, setMessagePhoto, setMessagePhotoUrl, setShouldScroll } = useContext(ContextProvider);

  const formattedContestStartDate = useMemo(() => format(new Date(message.createdAt), "HH:mm"), [message.createdAt]);

  const handleClick = (id) => {
    setShowDots(!showDots);
  };

  const handleUnsend = (id) => {
    setUnsend(!unsend);
    openUnsend(id);
  };

  const [imageHeight, setImageHeight] = useState({
    width: "",
    height: "",
  });
  const useWidth = useRef(300);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 280) {
        useWidth.current = 100;
      } else if (width <= 472) {
        useWidth.current = 200;
      } else if (width <= 680) {
        useWidth.current = 250;
      } else if (width <= 1193) {
        useWidth.current = 300;
      } else {
        useWidth.current = 300; // Default width for widths greater than 1193
      }

    };

    const callAsyncFunc = async () => {
      handleResize();
      window.addEventListener("resize", handleResize);
      const AspectRatio = await imageAspectRatio(
        message.attachUrl,
        280,
        useWidth.current
      );
      setImageHeight({ width: AspectRatio.width, height: AspectRatio.height });
    };
    window.addEventListener("resize", handleResize);
    callAsyncFunc();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [message.attachUrl]);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");


  const fetchCode = useCallback(async () => {
    try {
      if (message?.postId?.pracsUrl) {
        const response = await fetch(message?.postId.pracsUrl);
        const codeContent = await response.text();
        const match = codeContent.match(/`([^`]*)`/);
        const extractedCode = match && match[1] ? match[1] : "";
        setCode(extractedCode);

        const responseOutput = await fetch(message?.postId.outputUrl);
        const codeContentOutput = await responseOutput.text();
        setOutput(codeContentOutput);
      }
    } catch (error) {
      console.error("Error fetching code:", error);
    }
  }, [message?.postId?.pracsUrl]); // Only recreate if these change

  useEffect(() => {
    fetchCode();
  }, [fetchCode]); // Dependency on fetchCode

  const Openmodalfunc = (id) => {
    if (id) {
      setZoomphoto({
        images: message?.postId?.images,
        desc: message?.postId?.desc,
        postId: message?.postId?._id,
        pracsUrl: code,
        likeCounts: message?.postId.likes.length,
        syncLike: message?.postId.likes.length,
        dp: message?.postId?.userid?.image,
        output: output,
        languageTag: message?.postId?.languageTag,
      });
      Openmodal(id);

    } else {
      setMessagePhoto(true)
      setMessagePhotoUrl(message.attachUrl)
    }
  };

  const customCodeStyle = {
    fontFamily: "Zilla Slab, serif", // Set your custom font here
    fontSize: "1.6rem", // Set your custom font size
  };

  return (
    <>
      <div
        style={{
          backgroundColor: `${message.sender._id === user.id ? "#08529B" : "#E6EEF5"
            }`,
          color: `${message.sender._id === user.id ? "white" : "black"}`,
          marginLeft: isSameSenderMargin(messages, message, i, user.id),
          marginTop: isSameUser(messages, message, i) ? 3 : 10,
          borderRadius: "1.5rem",
          maxWidth:
            message.attachUrl && message.content
              ? `calc(${imageHeight.width}px + 10px)`
              : message?.postId?.pracsUrl && message.content
                ? `${useWidth.current}px`
                : "75%",
          fontSize: "1.6rem",
          wordWrap: "break-word",
          marginRight: ".8rem",
          position: "relative",
          padding: `${message.attachUrl || message?.postId?.pracsUrl ? ".5rem" : "10px"}`,
        }}
      >
        {message.attachUrl && (
          <div
            className={styles.sendMessage_image}
            style={{
              marginBottom: message.content ? "1rem" : "",
              width: `${imageHeight.width}px`,
              height: `${imageHeight.height}px`,
            }}
            onClick={() => Openmodalfunc(message?.postId?._id)}
          >
            <Image
              src={message.attachUrl}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "contain" }}
              alt="attachment"
            />
           
          </div>
        )}

        {message?.postId?.pracsUrl && (

          <pre
            className={styles.codeFrame}
            onClick={() => Openmodalfunc(message.postId._id)}
            style={{
              marginBottom: message.content ? "1rem" : "",
              maxWidth: `${useWidth.current}px`
            }}
          >
            <SyntaxHighlighter
              wrapLongLines
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
        )}

        {message.content && (
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {message.content}
            <span
              className={styles.messageTime}
              style={{ paddingRight: message.attachUrl || message?.postId?.pracsUrl ? ".5rem" : undefined }}
            >
              {formattedContestStartDate}
            </span>
          </pre>
        )}

        {message.sender._id === user.id && (
          /* Dots Container - Show only when sender._id === user.id */
          <div
            className="dots-container"
            style={{
              display: "none",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: "-2.5rem", // Adjust the distance from the left of the sender content
              cursor: "pointer",
              // backgroundColor: 'black', // Black color for the dots container
              // borderRadius: '50%',
              padding: "0.5rem",
            }}
          >
            <BsThreeDots
              style={{ color: "black" }}
              onClick={() => {
                handleClick(message._id);
                setShouldScroll(false);
              }}
            />
            {showDots && (
              <div
                style={{
                  backgroundColor: "grey",
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  right: "2.5rem",
                  fontSize: "1.5rem",
                  padding: "1rem",
                  borderRadius: "1rem",
                }}
              >
                <p
                  onClick={() => {
                    handleUnsend( message._id);
                  }}
                >
                  Unsend
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default MessageContent;
