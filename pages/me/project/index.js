import React, { useContext, useState, useEffect } from "react";
import Navbar from "../../../layouts/Navbar";
import { getSession } from "next-auth/react";
import connectDb from "../../../database/conn";
import User from "../../../model/userModel";
import styles from "../../../styles/contest.module.scss";
import CreatedCards from "../../../components/Contests/OngoingCards";
import UpcomingCard from "../../../components/Contests/UpcomingCard";
import PendingCard from "../../../components/Contests/PendingCard";import RegisterModal from "../../../components/Contests/RegisterModal";
import { ContextProvider } from "../../../global/context";
import Competition from "../../../model/competition";
import { fetchProjects } from "../../../utils/api";
import { useRouter } from "next/router";
import CollabPost from "../../../components/Collab/CollabPost";
import { fetchUserProject } from "../../../swrUtils/navbarSWR";
import { fetchCollabs } from "../../../utils/mutate";
import { FcCollaboration } from "react-icons/fc";
function Contest({
  session,
  userData,
  previousData,
  ongoingData,
  upcomingData,
}) {
  const { collabID, openDetails, setOpenDetails, isEditCollab, setIsEditCollab, upcoming, setPrevious, setOngoing, setUpcoming } =
    useContext(ContextProvider);
  const userid = session.user.id;
  const {
    data: fetchData,
    mutate: mutatefetchData,
    error: fetchDataError,
  } = fetchProjects(userid);
  const {
    data: projectUserData,
    mutate: mutateUserprojectData,
    error: projectUserDataError,
  } = fetchUserProject();
  const {
    data: posts,
    mutate: mutateImageData,
    // error: fetchDataError,
  } = fetchCollabs();
  const filteredCollabs = posts?.data.filter(
    (value) => value._id === collabID
  )[0];
  const level = userData.level + 1;
  useEffect(() => {
    setPrevious(previousData);
    setOngoing(ongoingData);
    setUpcoming(upcomingData);
  }, [previousData, ongoingData, upcomingData]);

  const [contestBenefit, setContestBenefit] = useState(false);
  console.log("projectUserData", projectUserData);
  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (contestBenefit) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [contestBenefit]);
  const OpenBenefits = () => {
    setContestBenefit(true);
  };
  const router = useRouter();
  const isIncoming = projectUserData?.data.some((item) =>
    item.collabRequests?.some((request) => request.userCollab)
  );

  // Check if there are no collaborations
  const hasNoCollaborations =
    (!fetchData?.data || fetchData.data.length === 0) &&
    (!projectUserData?.data || projectUserData.data.length === 0);
  return (
    <>
      {openDetails && (
        <CollabPost
          userdp={session?.user.image}
          name={session?.user.name}
          ImageData={filteredCollabs}
          session={session}
          mutateImageData={mutateImageData}
          setOpenDetails={setOpenDetails}
          collabID={collabID}
          isEditCollab={isEditCollab}
          setIsEditCollab={setIsEditCollab}
        />
      )}

      <Navbar select={"contest"} session={session} />

      <div className={styles.mainContest}>
        <div className={styles.contestCenter}>


          {/* Show no collaborations message if there are none */}
          {hasNoCollaborations && (
            <div className={styles.noCollaboration}>
              <div className={styles.noCollabIcon}>
                <FcCollaboration size={80} />
              </div>
              <p>You don&apos;t have any collaborations yet.</p>
              <p>Create a new collaboration or join existing ones to get started!</p>
              <button
                className={`${styles.btn} ${styles.primaryBtn}`}
                onClick={() => router.push('/collab')}
                style={{ marginTop: '2rem' }}
              >
                Explore Collaborations
              </button>
            </div>
          )}

          {/* Created Collaborations */}
          {fetchData?.data?.length > 0 && (
            <div className={styles.ongoingTournaments}>
              <div className={styles.tournamentsHeader}>
                <p>My Created Collaborations</p>
              </div>

              <div className={styles.ongoingContestGround}>
                {fetchData?.data?.map((val, index) => (
                  <CreatedCards key={index} codeData={val} session={session} />
                ))}
              </div>
            </div>
          )}

          {/* Joined and Pending Collaborations */}
          {projectUserData?.data?.length > 0 && (
            <div className={styles.ongoingTournaments}>
              <div className={styles.tournamentsHeader}>
                <p>My Collaborations</p>
              </div>
              <div className={styles.ongoingContestGround}>
                {projectUserData?.data?.map((val) => (
                  <React.Fragment key={val._id}>
                    {val.IsAccepted ? (
                      <UpcomingCard
                        codeData={val}
                        projectUserData={projectUserData}
                        session={session}
                      />
                    ) : (
                      <PendingCard
                        codeData={val}
                        session={session}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}


        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const session = await getSession({ req });
  const userid = session?.user.id;
  await connectDb();
  // Find the user by ID
  const userExist = await User.findOne({ _id: userid });

  const userComp = await Competition.find({});

  const level = userExist?.level + 1;

  const filteredLevels = userComp?.filter((val) => val.stage == level);

  let upcoming = [];
  let ongoing = [];
  let previous = [];

  filteredLevels.forEach((value) => {
    if (value.contestState === "upcoming") {
      upcoming.push(value);
    } else if (value.contestState === "ongoing") {
      ongoing.push(value);
    } else if (value.contestState === "previous") {
      previous.push(value);
    }
  });

  // Log the categorized competitions

  const { userPostId } = query;
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  try {
    const { id, username, isNewUser } = session?.user;
    if (isNewUser) {
      return {
        redirect: {
          destination: "/getting-started",
          permanent: false,
        },
      };
    }

    return {
      props: {
        session,
        userData: JSON.parse(JSON.stringify(userExist)),
        previousData: JSON.parse(JSON.stringify(previous)),
        ongoingData: JSON.parse(JSON.stringify(ongoing)),
        upcomingData: JSON.parse(JSON.stringify(upcoming)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
}

export default Contest;
