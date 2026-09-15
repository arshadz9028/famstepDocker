import React, { useEffect, createContext, useState, useRef } from "react";
export const ContextProvider = createContext();
import axios from "axios";
import useSWR, { mutate } from "swr";
import io from "socket.io-client";

const Context = ({ children, session }) => {
  //never used(will be deleted)
  const [model, setmodel] = useState(false);

  //adminPanel
  const [hamburger, setHamburger] = useState(false);

  // this two state is using in message page
  const [selected, setSelected] = useState();
  const [toggle, setToggle] = useState(false);

  //used in Edit profile
  const [selectImage, setselectImage] = useState();
  const [BgImage, setBgImage] = useState();
  const [selectBackground, setselectBackground] = useState();
  // in collab
  const [openDetails, setOpenDetails] = useState(false);
  const [isEditCollab, setIsEditCollab] = useState(false);

  // used in getting-started page
  const [selectedLocation, setSelectedLocation] = useState({
    country: "",
    city: "",
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedLanguage, setsSelectedLanguage] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedHobbies, setsSelectedHobbies] = useState([]);

  // home page for create a post
  const [createpost, setCreatepost] = useState(false);
  const [isGrpPost, setisGrpPost] = useState(false);
  const [GrpId, setGrpId] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedImageMultiple, setSelectedImageMultiple] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [taggedUser, setTaggedUser] = useState([]);

  //home page for zoonphoto layout
  const [zoom, setZoom] = useState(false);

  const [Zoomphoto, setZoomphoto] = useState({
    image: "",
    likeCounts: "",
    likeIcon: "",
    postId: "",
    syncLike: "",
    saveIcon: "",
    commentCount: "",
    userId: "",
    userName: "",
    userPostId: "",
    dp: "",
    userPostName: "",
    pracsUrl: "",
    output: "",
    languageTag: "",
  });
  const [commenter, setCommenter] = useState(true);
  const [reply, setReply] = useState(false);
  const [show, setShow] = useState(false);
  const [CommentId, setCommentId] = useState();
  const [createId, setcreateId] = useState();
  const [editPost, seteditPost] = useState(false);
  const [resserver, setResserver] = useState();
  const [sendRes, setSendRes] = useState();
const [collabID, setcollabID] = useState('')
  const [ProgramingLanguage, setProgramingLanguage] = useState("");

  //used in CommentSecFull components
  const [showEditComment, setshowEditComment] = useState(false); // State variable to control the visibility of EditPost component

  //used in rightcommment component
  const [zoomId, setzoomId] = useState();

  /* hanle minimize code state */
  const [minimized, setMinimized] = useState(false);
  const [minimizeId, setMinimizeId] = useState("");

  const EditpostOpen = (id) => {
    setcreateId(id);
    setCreatepost(true);
    seteditPost(true);
  };
  /* handling like */
  const showLike = async (id) => {
    try {
      setZoom(false);
      const response = await axios.put("/api/home/post/likePost", { id });
      // return response
      setResserver(response);
    } catch (err) {
      console.log(err);
    }
    mutate((index) => `/api/home/imageGallery?page=${index + 1}&limit=5`);
  };
  /* Save post */
  const savePostx = async (id) => {
    setZoom(false);
    try {
      const response = await axios.put("/api/home/post/savePost", { id });
      setSendRes(response);
      // return response
    } catch (err) {
      console.log(err);
    }
  };
  //never used(will be deleted)
  const Openmodal = (id) => {
    setmodel(true);
    setzoomId(id);
  };
  const Closemodal = () => {
    setmodel(false);
    setZoom(true);
  };

  /* Set CommentId globally */
  const CommentID = (id) => {
    setCommentId(id);
  };

  // this func has used in message page
  const handleChatClick = (username) => {
    setSelected(username);
  };

  /* Generate message Id */
  const openUnsend = async (id) => {
    setMessageId(id);
  };

  //state for contest
  const [enrollModal, setEnrollModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [contestId, setContestId] = useState("");
  const [lastMinutes, setlastMinutes] = useState(false);

  //state for mobile Navbar
  const [boxes, setBoxes] = useState(false);

  //message Id control
  const [messageId, setMessageId] = useState();
  const selectedRef = useRef(selected);

  // messageNotification
  const [totalMessageNotify, setTotalMessageNotify] = useState([]);
  const messageNotification = useRef([]);
  const [messagesend, setMessagesend] = useState([]);

  const [messagePhoto, setMessagePhoto] = useState(false);
  const [messagePhotoUrl, setMessagePhotoUrl] = useState(null);

  //used to prevent from scrolling during message
  const [shouldScroll, setShouldScroll] = useState(true);

  //MessgeFriends state instance response nahi dera tha isilye messageFriendRef use kiya
  const messageFriendRef = useRef([]);
  const [MessgeFriends, setmessgeFriends] = useState([]);
  //message initializaion funtion

  const socket = useRef(null);
  const getResponseRef = useRef();

  const [upcoming, setUpcoming] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [previous, setPrevious] = useState([]);
  const previousRef = useRef([]);
  const [conRankers, setConRankers] = useState([]);
  const [showIcon, setShowIcon] = useState(false);
  const [postModelLoad, setpostModelLoad] = useState();

  const CreateNotifyRef = useRef([]);
  const RegisterNotifyRef = useRef([]);
  const isProd = process.env.NODE_ENV === "production";

  // to calculate no of new users
  const [totalUserLen, setTotaleUserLen] = useState(0);
  const [activeUserLen, setActiveUserLen] = useState(0);

  // handling likeCounts notifications
  const [countLikeDot, setCountLikeDot] = useState([]);

  useEffect(() => {
    const socketInitializer = async () => {
      try {
        await fetch("/api/message/socket");
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      const socketKey = process.env.SOCKET_URL;
      // socket.current = io("https://famstep.com");
      socket.current = io(socketKey);
      // Emit user data on connection (ensure session has unique user)
      if (session?.user) {
        socket.current.emit("setup", session?.user); // Emit user data on connection
      }

      socket.current.on("connected", async () => {
        if (!session?.user) {
          socket.emit("disconnect");
        } else {
          const timestamp = new Date();
          await axios.put("/api/user/userStatus", {
            isActive: true,
            timestamp,
            userId: session?.user?.id,
          });
          // try {
          //   await axios.put('/api/auth/signup/trueUpdateProfile')
            
          // } catch (error) {
          //   console.log(error)
          // }
        }
      });

      // socket.current.emit("disconnectn", session?.user);
      socket.current.emit("join chat", selectedRef.current);
      socket.current.emit("joinLevelRoom", `level-${session?.user?.level}`);
      socket.current.on("change the selectRef", () => {
        selectedRef.current = "";
      });

      socket.current.on("message unsent", (messageId) => {
        setMessagesend((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
      });
      socket.current.on("Landing open", (adminRecords) => {
        setMessagesend((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
      });

      socket.current.on("createContest", (data) => {
        setUpcoming((prev) => [...prev, data]);
        CreateNotifyRef.current = [...CreateNotifyRef.current, data];
      });

      socket.current.on("startContest", (data) => {
        setUpcoming((prev) => [...prev.filter((val) => val._id !== data?._id)]);

        setOngoing((prev) => [...prev, data]);
        const RegisterSort = data?.participants.some(
          (val) => val.user == session.user.id
        );
        if (RegisterSort) {
          RegisterNotifyRef.current = [...RegisterNotifyRef.current, data];
        }
      });
      socket.current.on("nOfUsers", (userLen) => {
        setTotaleUserLen(userLen);
      });
      socket.current.on("activeUsersCount", (activeLen) => {
        setActiveUserLen(activeLen);
      });
      socket.current.on("notifiUpdate", (notify) => {
        setShowIcon(notify);
      });
      socket.current.on("LikedPost", (posts) => {
        setCountLikeDot(posts);
      });

      socket.current.on("endContest", (data) => {
        setOngoing((prev) => [...prev.filter((val) => val._id !== data?._id)]);
        setPrevious((prev) => [...prev, data]);
        previousRef.current = [...previousRef.current, data];
        // CreateNotifyRef.current = [];
        RegisterNotifyRef.current = [];

        // setUpcoming((prev)=> [...prev.filter((val)=> val._id !== data._id)])
      });
      socket.current.on("contestRankers", (data) => {
        setConRankers((prev) => [...prev, data]);
      });
      socket.current.on("messageRecieved", async (newMessageReceived) => {
        const chatId = newMessageReceived.userMsgData._id;
        const messageNotificationNavbar = messageNotification.current.findIndex(
          (message) => message._id === chatId
        );
        const messageNotificationCounter = messageFriendRef.current.findIndex(
          (message) => message._id === chatId
        );
        if (
          !selectedRef.current ||
          newMessageReceived?.userMsgData._id != selectedRef.current
        ) {
          const sendNotification = async (selectedId, otherUserId) => {
            const res = await axios.post("/api/message/messageLength", {
              selectedId,
              otherUserId,
            });
            getResponseRef.current = res.data.message;
          };
          await sendNotification(chatId, newMessageReceived.message.sender._id);

          if (messageNotificationNavbar === -1) {
            // If the sender doesn't exist in the messageNotification array, add the new message
            messageNotification.current = [
              ...messageNotification.current,
              newMessageReceived.userMsgData,
            ];
            setTotalMessageNotify((prevMessages) => [
              ...prevMessages,
              newMessageReceived.userMsgData,
            ]);
          } else {
            // If the sender already exists, update the message
            messageNotification.current[messageNotificationNavbar] =
              newMessageReceived.userMsgData;
            setTotalMessageNotify((prevMessages) => [
              ...prevMessages.filter((msg) => msg._id !== chatId),
              newMessageReceived.userMsgData,
            ]);
          }
          if (messageNotificationCounter === -1) {
            messageFriendRef.current = [
              ...messageFriendRef.current,
              getResponseRef.current,
            ];
            setmessgeFriends((prevMessages) => [
              ...prevMessages,
              getResponseRef.current,
            ]);
          } else {
            // If the sender already exists, update the message
            messageFriendRef.current[messageNotificationCounter] =
              getResponseRef.current;
            setmessgeFriends((prevMessages) => [
              ...prevMessages.filter((msg) => msg._id !== chatId),
              getResponseRef.current,
            ]);
          }
        } else {
          setMessagesend((prevMessages) => [
            ...prevMessages,
            newMessageReceived.message,
          ]);

          if (messageNotificationCounter === -1) {
            messageFriendRef.current = [
              ...messageFriendRef.current,
              newMessageReceived.userMsgData,
            ];
            setmessgeFriends((prevMessages) => [
              ...prevMessages,
              newMessageReceived.userMsgData,
            ]);
          } else {
            messageFriendRef.current[messageNotificationCounter] =
              newMessageReceived.userMsgData;
            setmessgeFriends((prevMessages) => [
              ...prevMessages.filter((msg) => msg._id !== chatId),
              newMessageReceived.userMsgData,
            ]);
          }
        }
      });
    };
    socketInitializer();
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [session]);

  // profile edit skills state
  const [skillModal, setSkillModal] = useState(false);

  //used in earings and setting
  const [earningToggle, setEarningToggle] = useState(false);

  //switch to business account
  const [switchAccount, setSwitchAccount] = useState(false);

  return (
    <ContextProvider.Provider
      value={{
        shouldScroll,
        setShouldScroll,
        ProgramingLanguage,
        setProgramingLanguage,
        messagePhoto,
        setMessagePhoto,
        messagePhotoUrl,
        setMessagePhotoUrl,
        switchAccount,
        setSwitchAccount,
        earningToggle,
        setEarningToggle,
        skillModal,
        setSkillModal,
        showEditComment,
        setshowEditComment,
        getResponseRef,
        messageFriendRef,
        MessgeFriends,
        setmessgeFriends,
        selectedRef,
        messagesend,
        setMessagesend,
        messageNotification,
        socket,
        registerModal,
        setRegisterModal,
        boxes,
        setBoxes,
        enrollModal,
        setEnrollModal,
        hamburger,
        setHamburger,
        zoomId,
        CommentID,
        EditpostOpen,
        editPost,
        seteditPost,
        createId,
        setcreateId,
        CommentId,
        setCommentId,
        Openmodal,
        Closemodal,
        savePostx,
        minimized,
        setMinimized,
        show,
        setShow,
        reply,
        setReply,
        commenter,
        setCommenter,
        toggle,
        setToggle,
        selected,
        setSelected,
        handleChatClick,
        selectedLocation,
        setSelectedLocation,
        selectedHobbies,
        setsSelectedHobbies,
        selectedInterests,
        setSelectedInterests,
        selectedDesignation,
        setSelectedDesignation,
        selectedSkills,
        setSelectedSkills,
        selectedLanguage,
        setsSelectedLanguage,
        setCreatepost,
        createpost,
        selectedImage,
        setSelectedImage,
        selectedImageMultiple,
        setSelectedImageMultiple,
        BgImage,
        setBgImage,
        selectImage,
        setselectImage,
        isFormOpen,
        setIsFormOpen,
        selectedFile,
        setSelectedFile,
        Zoomphoto,
        setZoomphoto,
        model,
        setmodel,
        showLike,
        setResserver,
        zoom,
        resserver,
        sendRes,
        openUnsend,
        messageId,
        selectBackground,
        setselectBackground,
        isGrpPost,
        setisGrpPost,
        contestId,
        setContestId,
        GrpId,
        setGrpId,
        totalMessageNotify,
        setTotalMessageNotify,
        minimizeId,
        setMinimizeId,
        taggedUser,
        setTaggedUser,
        previous,
        previousRef,
        ongoing,
        upcoming,
        setUpcoming,
        setOngoing,
        setPrevious,
        CreateNotifyRef,
        RegisterNotifyRef,
        conRankers,
        postModelLoad,
        setpostModelLoad,setzoomId,
        setConRankers,
        showIcon,
        setShowIcon,
        lastMinutes,
        setlastMinutes,
        totalUserLen,
        setTotaleUserLen,
        activeUserLen,
        setActiveUserLen,
        countLikeDot,
        setCountLikeDot,collabID, setcollabID,openDetails, setOpenDetails,
        setZoom,isEditCollab, setIsEditCollab
      }}
    >
      {children}
    </ContextProvider.Provider>
  );
};

export default Context;
