import React, { useEffect, useState, useContext, useRef } from "react";
import styles from "../../styles/Message.module.scss";
import Navbar from "../../layouts/Navbar";
import Image from "next/image";
import { IoSend } from "react-icons/io5";
import { IoMdAttach } from "react-icons/io";
import { BiEdit } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import Messagefriend from "../../components/message/Messagefriend";
import MessageBox from "../../components/message/MessageBox";
import { BiChevronLeft } from "react-icons/bi";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useRouter } from "next/router";
import NewMessage from "../../layouts/Message/NewMessage";
import connectDb from "../../database/conn";
import User from "../../model/userModel";
import Chat from "../../model/chatModel";
import MessageChat from "../../model/messageModel";
import { ContextProvider } from "../../global/context";
import { getSession } from "next-auth/react";
import UserFollow from "../../model/followModel";
import UserBlock from "../../model/blockModel";
import { DateSection } from "../../config/dateSec";
import MessageAction from "../../layouts/Message/MessageAction";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import EmojiPicker, { EmojiStyle, SuggestionMode } from "emoji-picker-react";
import { resizeImage } from "../../utils/resizeImage";
import CryptoJS from "crypto-js";
import Zoomphoto from "../../layouts/post/Zoomphoto";
import AddImage from "../../layouts/post/PostImage";
import MessagePhotoModel from "../../components/message/MessagePhotoModel"

async function fetchUser(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
async function fetchMsg(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

function Message({
  session,
  userData,
  userMsgData,
  messageData,
  message,
  otherUserId,
  blockedUser,
  blockedUser2,
}) {
  const {
    data: userQuery,
    mutate: mutateUserData,
    error: UserDataError,
  } = useSWR(`/api/user/userMsgFetch/?message=${otherUserId}`, fetchUser);

  const {
    toggle,
    setToggle,
    selected,
    selectedRef,
    socket,
    messagesend,
    setMessagesend,
    MessgeFriends,
    setmessgeFriends,
    messageFriendRef,
    model,
    createpost,
    messagePhoto,
    messagePhotoUrl,
    setMessagePhoto,
    shouldScroll, setShouldScroll
  } = useContext(ContextProvider);

  const [isMobile, setIsMobile] = useState(false);
  const [enterButton, setEnterButton] = useState("Enter");
  const [inputCheck, setinputCheck] = useState("");
  const [newmessage, setNewmessage] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [messageHeight, setMessageHeight] = useState(``);
  const [mediaMessageHeight, setMediaMessageHeight] = useState(``);
  const [mediaTwoMessageHeight, setMediaTwoMessageHeight] = useState(``);
  const [messageAction, setmessageAction] = useState(false); // State variable to control the visibility of EditPost component
  const textareaRef = useRef(null);
  const attachHightRef = useRef(0);
  const emojiRef = useRef(null);
  const router = useRouter();
  const chatRef = useRef(null);
  const [scrollableArea, setScrollableArea] = useState(false); // State variable to control the visibility of EditPost component
  const [initialHeight, setInitialHeight] = useState(``); //initial height of texting area while typing
  const [adjustTextarea, setAdjustTextarea] = useState(false); //initial height of texting area while typing

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
      setAdjustTextarea(window.innerWidth <= 1176 && window.innerWidth >= 971);
    };
    // handleResize(); // Set initial state based on current window width

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [initialHeight, textareaRef]);

  // Add navigation event handler
  useEffect(() => {
    // Handle browser back/forward navigation
    const handleNavigation = () => {
      // Check if we're on the message page
      if (window.location.pathname === '/message') {
        // Update toggle state to show the message page
        setToggle(false);
      }
    };

    // Listen for popstate event (triggered when user navigates back/forward)
    window.addEventListener('popstate', handleNavigation);

    // Also check on initial load
    handleNavigation();

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  useEffect(() => {
    setShouldScroll(true);
    setSelectedImage("");
    setSelectedFile("");
    setinputCheck("");
    attachHightRef.current = 0;
    setInitialHeight(
      `calc(${parseFloat(textareaRef.current?.scrollHeight)}px + 26px + ${attachHightRef.current
      }px)`
    );
    heightCalc(textareaRef.current?.scrollHeight);

    const fetchMessage = async () => {
      setMessagesend(messageData);
      setToggle(true);
      selectedRef.current = selected;
    };

    fetchMessage();
  }, [messageData, selected, message, setToggle]);

  useEffect(() => {
    const fetchMessage = async () => {
      setmessgeFriends(userMsgData);
      messageFriendRef.current = userMsgData;
    };

    fetchMessage();
  }, []);

  useEffect(() => {
    const node = chatRef.current;
    if (!node) return;

    // Function to scroll to the bottom
    const scrollToBottom = () => {
      if (shouldScroll) {
        node.scrollTo({
          top: node.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    // Create a MutationObserver to watch for changes in the chat area
    const observer = new MutationObserver(scrollToBottom);

    observer.observe(node, {
      childList: true, // Watch for added/removed messages
      subtree: true, // Watch for changes within child nodes
    });

    scrollToBottom();
    // Cleanup observer
    return () => {
      observer.disconnect();
    };
  }, [messageData, MessgeFriends, shouldScroll]);

  // Function to handle image selection and resizing
  const handleImageSelect = async (event) => {
    if (event.target.files && event.target.files[0]) {
      attachHightRef.current = 70;
      const file = event.target.files[0];

      // Resize the selected image
      const maxWidth = 800; // Set the desired maximum width
      const maxHeight = 800; // Set the desired maximum height
      const resizedImage = await resizeImage(file, maxWidth, maxHeight);

      // Update the state with the resized image
      setSelectedImage(URL.createObjectURL(resizedImage));
      setSelectedFile(resizedImage);
      event.target.value = "";
      if (adjustTextarea) {
        setInitialHeight(
          `calc(${parseFloat(textareaRef.current.scrollHeight)}px + 32px + ${attachHightRef.current
          }px)`
        );
      } else {
        setInitialHeight(
          `calc(${parseFloat(textareaRef.current.scrollHeight)}px + 26px + ${attachHightRef.current
          }px)`
        );
      }
      heightCalc(textareaRef.current.scrollHeight);
    }
  };

  const handleSendMessage = async (e) => {
    setShouldScroll(true);
    e.preventDefault();
    if (selectedImage || inputCheck.trim()) {
      const selectedId = selectedRef.current;
      const form = new FormData();
      form.append("chatId", selectedId);
      form.append("image", selectedFile);
      form.append("content", e.target.value || inputCheck);
      form.append("selectedId", otherUserId);

      try {
        setinputCheck("");
        textareaRef.current.focus();
        const response = await axios.post("/api/message", form);
        const data = response.data;
        setMessagesend((prevMessages) => [...prevMessages, data.message]);
        socket.current.emit("new message", data);

        setmessgeFriends((prevMessages) => [
          ...prevMessages.filter((msg) => msg._id !== data.userMsgData._id),
          data.userMsgData,
        ]);
        if (attachHightRef.current || textareaRef.current) {
          setSelectedImage("");
          setSelectedFile("");
          attachHightRef.current = 0;

          heightCalc(textareaRef.current.scrollHeight);
          textareaRef.current.style.height = "auto"; // Auto height to reset the textarea
          setMediaMessageHeight(
            `calc(100vh - (${parseFloat(66)}px + ${attachHightRef.current}px))`
          );
          setMediaTwoMessageHeight(
            `calc(100vh - (${parseFloat(200)}px + ${attachHightRef.current}px))`
          );
          if (adjustTextarea) {
            setInitialHeight(`7.7rem`);
          } else {
            setInitialHeight(`7.1rem`);
          }
          setMessageHeight(`calc(100vh - (${parseFloat(38)}px + 203px))`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleKeyDown = (e) => {
    setShouldScroll(true);

    if (isMobile) {
      setEnterButton("nothing");
      setScrollableArea(true);
    }
    if (e.shiftKey) {
      setScrollableArea(true);
    }
    if (e.key === enterButton && !e.shiftKey) {
      e.preventDefault();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // Auto height to reset the textarea

        if (adjustTextarea) {
          setInitialHeight(`calc(7.7rem + ${attachHightRef.current}px)`);
        } else {
          setInitialHeight(`calc(7.1rem + ${attachHightRef.current}px)`);
        }
        setMediaMessageHeight(
          `calc(100vh - (${parseFloat(66)}px + ${attachHightRef.current}px))`
        );
        setMediaTwoMessageHeight(
          `calc(100vh - (${parseFloat(200)}px + ${attachHightRef.current}px))`
        );
        setMessageHeight(
          `calc(100vh - (${parseFloat(38)}px + 203px + ${attachHightRef.current
          }px))`
        );
        setinputCheck("");
      }
      handleSendMessage(e);
    }
  };

  //image attachment
  const heightCalc = (val) => {
    if (val <= 170) {
      setMessageHeight(
        `calc(100vh - (${parseFloat(val)}px + 196px + ${attachHightRef.current
        }px))`
      );
      setMediaMessageHeight(
        `calc(100vh - (${parseFloat(val + 20)}px + ${attachHightRef.current
        }px))`
      );
      setMediaTwoMessageHeight(
        `calc(100vh - (${parseFloat(val + 160)}px + ${attachHightRef.current
        }px))`
      );
    } else {
      setMessageHeight(
        `calc(100vh - (${parseFloat(157)}px + 196px + ${attachHightRef.current
        }px))`
      );
      setMediaMessageHeight(
        `calc(100vh - (${parseFloat(180)}px  + ${attachHightRef.current}px))`
      );
      setMediaTwoMessageHeight(
        `calc(100vh - (${parseFloat(280)}px + ${attachHightRef.current}px))`
      );
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (emojiRef.current && !emojiRef.current.contains(event.target)) {
          setShowEmojis(false);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showEmojis]);

  const handleEmojiModal = () => {
    setShowEmojis(!showEmojis);
  };

  const handleEmojiClick = (e) => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const emoji = e.emoji;

      // Insert the emoji at the cursor position
      const newInput =
        inputCheck.slice(0, cursorPosition) +
        emoji +
        inputCheck.slice(cursorPosition);
      setinputCheck(newInput);

      // Update the cursor position to be after the inserted emoji
      const newCursorPosition = cursorPosition + emoji.length;
      setTimeout(() => {
        // Adding a small delay for cursor positioning
        textareaRef.current.selectionStart = newCursorPosition;
        textareaRef.current.selectionEnd = newCursorPosition;
      }, 0);
    }
  };
  const handleDot = () => {
    setmessageAction(!messageAction);
  };

  const {
    data: userFetchMsg,
    mutate: mutateuserFetchMsg,
    error: userFetchDataError,
  } = useSWR(`/api/message/messageFetch/?message=${otherUserId}`, fetchMsg);
  const blockList = userFetchMsg?.blockedUser2?.blockedIds.some(
    (user) => user.userId === otherUserId
  );
  const blockList2 = userFetchMsg?.blockedUser?.blockedIds.some(
    (user) => user.userId === session.user.id
  );
  const lastSeen = new Date(userQuery?.data1.lastSeen);
  const handleProf = (id) => {
    router.push(`/profile/${id}`);
  };
  const mutateImageData = mutate(
    (index) => `/api/home/imageGallery?page=${index + 1}&limit=5`
  );

  // Handle swipe gestures
  

  return (
    <>
    
        <Navbar select={"Message"} session={session} />
        {createpost && (
          <AddImage
            userdp={session?.user.image}
            name={session?.user.name}
            // ImageData={posts}
            session={session}
            mutateImageData={mutateImageData}
          />
        )}
        {model && (
          <Zoomphoto
            // allUsers={allUsers}
            dp={session?.user.image}
            userName={session?.user.username}
            session={session}
            // imageData={posts}
            mutateImageData={mutateImageData}
          />
        )}
        <MessageAction
          messageAction={messageAction}
          setmessageAction={setmessageAction}
          userData={userData}
          blockedUser2={userFetchMsg?.blockedUser2}
          blockedUser={userFetchMsg?.blockedUser}
          session={session}
          otherUserId={otherUserId}
          mutateuserFetchMsg={mutateuserFetchMsg}
        />
        {messagePhoto &&
          <MessagePhotoModel

          />}

        <div className={styles.message_main}>
          <div className={styles.message_main_center}>
            <div
              className={styles.chat_section}
              style={!toggle && !newmessage ? { display: "block" } : {}}
            >
              <div className={styles.head_sec}>
                {/* mobile View */}
                <div className={styles.head_sec2}>
                  <div
                    className={styles.Mob_backarrow}
                    onClick={() => {
                      router.push("/home");
                    }}
                  >
                    <BiChevronLeft className={styles.back_arrow} />
                  </div>
                  {/* mobile View */}

                  <div className={styles.head1}>
                    <div className={styles.image_active}>
                      <div className={styles.dp4}>
                        <Image
                          priority
                          src={session?.user.image}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{
                            objectFit: "cover",
                          }}
                          alt="userImage"
                        />
                      </div>
                    </div>
                    <div className={styles.name3}>
                      <p>{session?.user.name}</p>
                    </div>
                  </div>
                  <div
                    className={styles.wrap_new_chat}
                    onClick={() => {
                      setNewmessage(!newmessage);
                    }}
                  >
                    <BiEdit className={styles.creat_new_chat} />
                  </div>
                </div>
              </div>

              <div className={styles.personals}>
                {MessgeFriends &&
                  MessgeFriends.slice() // Create a copy of the array to avoid mutating the original array
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    // .reverse() // Reverse the order of the array
                    .map((val) => (
                      <Messagefriend
                        key={val._id}
                        val={val}
                        session={session?.user?.id}
                        // mutateMessageData={mutateChatData}
                        setNewmessage={setNewmessage}
                        message={message}
                        otherUserId={otherUserId}
                      />
                    ))}
              </div>
            </div>

            {!newmessage ? (
              <div
                className={styles.messaging_section}
                style={toggle ? { display: "block" } : {}}
              >
                <div className={styles.head_sec}>
                  <div className={styles.head_sec2}>
                    <div
                      className={styles.Mob_backarrow}
                      onClick={() => {
                        router.push("/message");
                        setToggle(!toggle);
                      }}
                    >
                      <BiChevronLeft className={styles.back_arrow} />
                    </div>
                    <div className={styles.head1}>
                      <div className={styles.image_active}>
                        <div
                          className={styles.dp4}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleProf(userQuery?.data1._id)}
                        >
                          <Image
                            src={userData?.image}
                            alt="userImage"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        {userQuery?.data1.userActive === true && (
                          <div className={styles.notification_dot}></div>
                        )}
                      </div>
                      <div className={styles.name3}>
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={() => handleProf(userQuery?.data1._id)}
                        >
                          {userData?.name}
                        </p>
                        <div className={styles.active_status1}>
                          {userQuery?.data1.userActive === true ? (
                            <p>Active Now</p>
                          ) : (
                            <p>Active {DateSection(lastSeen)} ago</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={styles.chat_icons}>
                      <div className={styles.Tdots} onClick={handleDot}>
                        <BsThreeDots
                          style={{
                            width: "2rem",
                            height: "2rem",
                            fill: "#8A8A8A",
                            cursor: "pointer",
                          }}
                        />
                      </div>

                      {/* <div className={styles.Vcall}>
                        <RiVideoAddFill
                          style={{
                            width: "2.8rem",
                            height: "2.8rem",
                            fill: "#08529B",
                            cursor: "pointer",
                          }}
                        />
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className={`${styles.chatts} ${"chatted"}`}>
                  <style jsx>{`
                    .chatted {
                      height: ${textareaRef.current ? messageHeight : ""};
                    }
                    @media (max-width: 1176px) and (min-width: 971px) {
                      .chatted {
                        height: ${textareaRef.current
                      ? mediaTwoMessageHeight
                      : ""};
                      }
                    }
                    @media (max-width: 767px) {
                      .chatted {
                        height: ${textareaRef.current ? mediaMessageHeight : ""};
                      }
                    }
                  `}</style>
                  <>
                    <div className={styles.chattedLower} ref={chatRef}>
                      <MessageBox messages={messagesend} session={session}  />
                    </div>
                  </>
                </div>

                <form className={styles.chatting_section}>
                  <div
                    className={styles.typing_sec}
                    style={{
                      height: textareaRef.current
                        ? `${initialHeight}`
                        : undefined,
                      maxHeight: selectedImage ? "25rem" : "18rem",
                    }}
                  >
                    {selectedImage && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          padding: ".5rem ",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "70px",
                            height: "50px",
                            margin: "0rem",
                          }}
                        >
                          <Image
                            src={selectedImage}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{
                              objectFit: "contain",
                            }}
                            alt="nothing"
                          />
                          <IoCloseCircleSharp
                            className={styles.attachClose}
                            onClick={() => {
                              // Clear the selected image and file from the state
                              setSelectedImage("");
                              setSelectedFile([]);
                              attachHightRef.current = 0;
                              setInitialHeight(
                                `calc(${parseFloat(
                                  textareaRef.current.scrollHeight
                                )}px + 26px + ${attachHightRef.current}px)`
                              );
                              heightCalc(textareaRef.current.scrollHeight);
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {!blockList && !blockList2 ? (
                      <div
                        className={styles.messageWrap}
                        style={{
                          borderTop: selectedImage ? "2px solid #D9D9D9" : "none",
                        }}
                      >
                        <div id="emoji-open" className={styles.emojis}>
                          {showEmojis && (
                            <div className={styles.emojipicker} ref={emojiRef}>
                              <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                //  theme={Theme.AUTO}
                                skinTonesDisabled
                                emojiStyle={EmojiStyle.APPLE}
                                suggestedEmojisMode={SuggestionMode.RECENT}
                                emojiVersion="0.6"
                                max-width="25vw"
                                height={410}
                              />
                            </div>
                          )}
                          <BsEmojiSmile
                            id="emoji-open"
                            className={styles.react_icons}
                            onClick={handleEmojiModal}
                          />
                        </div>

                        <div className={styles.pin}>
                          <label htmlFor="attachment">
                            <IoMdAttach
                              ref={attachHightRef}
                              className={styles.react_icons}
                            />
                          </label>
                          <input
                            style={{
                              color: " #afa",
                              textShadow: "0px 0px 1px #fff",
                            }}
                            name="image"
                            type="file"
                            multiple
                            hidden
                            id="attachment"
                            accept="image/*"
                            onChange={handleImageSelect}
                          />
                        </div>

                        <div className={styles.fullMessage_circle}>
                          <textarea
                            autoFocus
                            placeholder="Message"
                            ref={textareaRef}
                            className={styles.typing_area}
                            rows={1} // Start with 1 row (single line)
                            value={inputCheck}
                            onChange={(e) => {
                              setinputCheck(e.target.value);
                              setInitialHeight(
                                `calc(${parseFloat(
                                  textareaRef.current
                                    ? textareaRef.current.scrollHeight
                                    : "45px"
                                )}px + 26px + ${attachHightRef.current}px)`
                              );
                              heightCalc(textareaRef.current.scrollHeight);
                            }}
                            onInput={() => {
                              if (textareaRef.current) {
                                textareaRef.current.style.height = "auto"; // Auto height to reset the textarea
                                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Content ke hisab se textarea height set karein
                              }
                            }}
                            onKeyDown={handleKeyDown}
                          />

                          <div className={styles.microphone}>
                            {inputCheck.trim() || selectedImage ? (
                              <IoSend
                                className={styles.react_icons}
                                onClick={handleSendMessage}
                              />
                            ) : (
                              <>
                                {/* <FaMicrophone className={styles.react_icons} /> */}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100vh",
                        }}
                      >
                        {blockList ? (
                          <p
                            style={{
                              fontSize: "18px",
                              margin: "0",
                              textAlign: "center",
                              color: "#8A8A8A",
                            }}
                          >
                            Unblock user to start conversation
                          </p>
                        ) : (
                          <p
                            style={{
                              fontSize: "18px",
                              margin: "0",
                              textAlign: "center",
                              color: "#8A8A8A",
                            }}
                          >
                            Replying to this conversation is not allowed anymore.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <NewMessage newmessage={newmessage} setNewmessage={setNewmessage} />
            )}
          </div>
        </div>
    </>
  );
}
export async function getServerSideProps({ req, query }) {
  const session = await getSession({ req });
  const { message } = query;
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { id, username, isNewUser } = session?.user;
  if (isNewUser) {
    return {
      redirect: {
        destination: "/getting-started",
        permanent: false,
      },
    };
  }
  try {
    await connectDb();

    const findChatData = await Chat.findById(message);
    const userToExclude = session?.user?.id;
    const otherUserId = findChatData.users.find(
      (val) => val.toString() !== userToExclude
    );

    const userData = await User.findById(otherUserId);

    let userMsgData = await Chat.find({
      users: { $elemMatch: { $eq: session?.user?.id } },
    })
      .populate("users")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    await Chat.populate(userMsgData, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    // Initial query to fetch messages with common population
    let messageData = await MessageChat.find({ chat: message })
      .populate({
        path: "sender",
        select: "name username image",
      })
      .populate("chat");

    // Identify documents with a postId
    const messagesWithPostId = messageData.filter(msg => msg.postId);

    // Conditionally populate `postId` for only those messages that have it
    if (messagesWithPostId.length > 0) {
      messageData = await MessageChat.find({ chat: message })
        .populate({
          path: "sender",
          select: "name username image",
        })
        .populate("chat")
        .populate({
          path: "postId",
          match: { _id: { $in: messagesWithPostId.map(msg => msg.postId) } }, // Populate only matching postIds
          select: "images desc pracsUrl userid likes outputUrl languageTag",
          populate: {
            path: "userid",
            select: "image",
          },
        });
    }






    // Decrypt content in userMsgData if latestMessage exists
    userMsgData.forEach((value, index) => {
      if (value.latestMessage) {
        const decryptedText = CryptoJS.AES.decrypt(
          value.latestMessage.content,
          process.env.ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8);
        userMsgData[index].latestMessage.content = decryptedText;
      }
    });

    // Decrypt content in messageData
    messageData.forEach((value, index) => {
      const decryptedText = CryptoJS.AES.decrypt(
        value.content,
        process.env.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
      messageData[index].content = decryptedText;
    });


    // Fetch followers and blocked users
    const followers = await UserFollow.findOne({
      user: session?.user?.username,
    });
    const blockedUser = await UserBlock.findOne({ user: otherUserId });
    const blockedUser2 = await UserBlock.findOne({ user: session?.user?.id });

    return {
      props: {
        session,
        userData: JSON.parse(JSON.stringify(userData)),
        otherUserId: JSON.parse(JSON.stringify(otherUserId)),
        userMsgData: JSON.parse(JSON.stringify(userMsgData)),
        messageData: JSON.parse(JSON.stringify(messageData)),
        message: JSON.parse(JSON.stringify(message)),
        followers: JSON.parse(JSON.stringify(followers)),
        blockedUser: JSON.parse(JSON.stringify(blockedUser)),
        blockedUser2: JSON.parse(JSON.stringify(blockedUser2)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
}

export default Message;
