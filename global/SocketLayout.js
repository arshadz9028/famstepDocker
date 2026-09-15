import { useEffect, useContext, useState } from "react";
import { ContextProvider } from "./context";
import axios from "axios";
import FeedBackModel from "../layouts/Network/FeedbackModel";

const SocketLayout = ({ children, session }) => {
  const {
    RegisterNotifyRef,
    CreateNotifyRef,
    messageNotification,
    setTotalMessageNotify,
  } = useContext(ContextProvider);

  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [updateFeedback, setUpdateFeedback] = useState(false); // Feedback modal state

  // Fetch message notifications
  useEffect(() => {
    const fetchMessageNotifications = async () => {
      if (!session) return;

      try {
        const { data } = await axios.get("/api/message/messageCounterFilter");
        messageNotification.current = data.data;
        setTotalMessageNotify(data.data);
      } catch (error) {
        console.error("Error fetching message notifications:", error);
      }
    };

    fetchMessageNotifications();
  }, [session]);

  // Fetch contest notifications
  // useEffect(() => {
  //   const fetchContestNotifications = async () => {
  //     try {
  //       const { data } = await axios.get("/api/code/codeNotify");
  //       const subsData = data.subsData;

  //       CreateNotifyRef.current = subsData;

  //       const sortedData = subsData?.sort(
  //         (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  //       );

  //       const userIsParticipant = sortedData[0]?.participants.some(
  //         (participant) => participant.user === session?.user.id
  //       );

  //       if (userIsParticipant) {
  //         RegisterNotifyRef.current = sortedData;
  //       }

  //       if (sortedData[0]?.contestState === "previous") {
  //         RegisterNotifyRef.current = [];
  //       }
  //     } catch (error) {
  //       console.error("Error fetching contest notifications:", error);
  //     }
  //   };

  //   fetchContestNotifications();
  // }, [session]);

  // Fetch user details and manage feedback modal
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.username) {
        setIsLoading(false);
        return;
      }
  
      try {
        const { data } = await axios.get(`/api/user/currentUserFetch`);
  
        if (!data.data.updateProfile && data.data.userFeedback) {
          // Set a timeout to trigger setUpdateFeedback(true) after 5 minutes
          const timeoutId = setTimeout(() => {
            setUpdateFeedback(true);
          }, 5 * 60 * 1000); // 5 minutes in milliseconds
  
          // Cleanup the timeout if dependencies change or component unmounts
          return () => clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserData();
  }, [session]);
  
  return (
    <div>
      {children}
      {updateFeedback && (
        <FeedBackModel
          setUpdateProfile={setUpdateFeedback}
          page="network"
          updateDetails={updateFeedback}
        />
      )}
    </div>
  );
};

export default SocketLayout;
