import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../../styles/Interchange_result.module.scss";
import Image from "next/image";
import Interchange_component from "./Interchange_component";
import { BsChevronLeft } from "react-icons/bs";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  a11yDark,
  dark,
  atelierForestDark,
  darcula,
  irBlack,
  kimbieDark,
} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { IoIosArrowBack } from "react-icons/io";
import { ContextProvider } from "../../global/context";

//import code from "../components/code";
import { BsChevronRight } from "react-icons/bs";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR, { mutate } from "swr";
async function fetchFollowers(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}


function I_changeProfile({
  codeData,
  session,
  elapsedTime,
  follow,
  setshowInterchange,
  subData,
  showInterchange,
  mutatecodeData,
  rankData,
}) {
  const { previous, conRankers, setPrevious, setConRankers, setpostModelLoad } =
    useContext(ContextProvider);
  const [currentUserId, setCurrentUserId] = useState("");
  const [codeSub, setCodeSub] = useState("");
  const [codeRank, setCodeRank] = useState("");

  /* this request will be not required, delete it after testing */
  const {
    data: followerData,
    mutate: mutatefollowerData,
    error: followerError,
  } = useSWR(
    `/api/profile/follow/followRandomFetch/?id=${currentUserId}`,
    fetchFollowers
  );

  
  /* This part of the code is for before showing the rankers */
  const [currentIndexSub, setCurrentIndexSub] = useState(0);
  const router = useRouter();
  const { ideCode } = router.query;
  const fitrrr = previous.filter((value) => value._id == ideCode);
  const currentUser = session.user.id;
  const handleLeftSub = () => {
    // Calculate the new index for the left click
    const newIndexsub =
      (currentIndexSub - 1 + codeData?.subData.submission.length) %
      codeData?.subData.submission.length;
    setCurrentIndexSub(newIndexsub);
  };
  const handleRightSub = () => {
    const newIndexSub =
      (currentIndexSub + 1) % codeData?.subData.submission.length;
    setCurrentIndexSub(newIndexSub);
  };
  const filteredSubmissions = codeData?.subData?.submission?.filter(
    (val) => val?.userSub?._id !== session.user.id
  );

  const isLastIndexSub = currentIndexSub === filteredSubmissions?.length - 1;
  const isFirstIndexSub = currentIndexSub === 0;
  const codeSubUrl = filteredSubmissions[currentIndexSub]?.solution;
  useEffect(() => {
    const fetchCode = async () => {
      try {
        if (codeSubUrl) {
          const response = await fetch(codeSubUrl);

          const codeContent = await response.text();
          const match = codeContent.match(/`([^`]*)`/);
          const extractedCode = match && match[1] ? match[1] : "";

          setCodeSub(extractedCode);
        }
      } catch (error) {
        console.error("Error fetching code:", error);
      }
    };

    fetchCode();
  }, [codeSubUrl]);
  /* This part of the code is for showing the rankers */

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* handle slide show */
  const isLastIndex = currentIndex === conRankers?.length - 1;
  const isFirstIndex = currentIndex === 0;
  const code = conRankers[currentIndex]?.solution;
  useEffect(() => {
    const fetchCode = async () => {
      try {
        if (code) {
          const response = await fetch(code);

          const codeContent = await response.text();
          const match = codeContent.match(/`([^`]*)`/);
          const extractedCode = match && match[1] ? match[1] : "";

          setCodeRank(extractedCode);
        }
      } catch (error) {
        console.error("Error fetching code:", error);
      }
    };

    fetchCode();
  }, [code]);
  
  useEffect(() => {
    const handleEffect = async () => {
      if (fitrrr[0]?.contestState === "previous" && isLastIndex) {
        try {
          await axios.post(`/api/code/codeLastModel/?stage=${ideCode}`);
        } catch (error) {
          console.error("Error posting model data:", error);
        }
        const timeoutIdIn = setTimeout(() => {
          // if (partFilter?.isViewedModel) {
            setshowInterchange(false);

            setpostModelLoad(true);

            const timeoutIdOut = setTimeout(() => {
              setpostModelLoad(false);
              router.push(`/scoreboard/?stage=${ideCode}`);
            }, 11000);

            return () => {
              clearTimeout(timeoutIdOut);
            };
          // }
        }, 11000);

        return () => {
          clearTimeout(timeoutIdIn);
        };
      }
    };

    handleEffect();
  }, [isLastIndex, ideCode, fitrrr[0]]);
  const likeshandleCount = codeData?.rankData?.likes?.length;
  const likeshandleIcon = codeData?.rankData[currentIndex]?.likes?.map(
    (val) => val.userId
  );

  const IconLiked = likeshandleIcon?.includes(session.user.id);

  const likedData = codeData.rankData
    .flatMap((val) => val.likes)
    .filter((like) => like.userId === session.user.id)
    .map((like) => like.userId);
  const codeUser = conRankers[currentIndex]?.userId._id;
  const codeLevel = conRankers[currentIndex]?.level;
  const codeLiked = async () => {
    await axios.post(`/api/code/codeLike/?stage=${codeLevel}`, {
      codeUser,
      currentUser,
    });

    mutatecodeData();
    // mutate(`/api/code/codeFetch/?stage=${ideCode}`);
  };
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    let countdownInterval;

    if (fitrrr[0]?.contestState === "previous" && !isPaused) {
      countdownInterval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft > 0) {
            return prevTimeLeft - 1;
          } else {
            const newIndex = (currentIndex + 1) % conRankers?.length;
            setCurrentIndex(newIndex);
            return 10;
          }
        });
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
      };
    }
  }, [currentIndex, conRankers, isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(false);
  };

  const handleMouseLeave = () => {
    setIsPaused(true);
  };
  const handleLeft = () => {
    // Calculate the new index for the left click
    const newIndex =
      (currentIndex - 1 + conRankers?.length) % conRankers?.length;
    setCurrentIndex(newIndex);
    setTimeLeft(10);
  };
  const handleRight = () => {
    const newIndex = (currentIndex + 1) % conRankers?.length;
    setCurrentIndex(newIndex);
    setTimeLeft(10);
  };
  useEffect(() => {
    const userId = conRankers[currentIndex]?.userId._id;
    setCurrentUserId(userId);
  }, [currentIndex]);

  /* this part is to control follow requests */
  const pendingReq = followerData?.alldat?.followRequests.filter(
    (user) => user.userid == session.user.id
  );
  const pendingStatus = pendingReq?.some((value) => value.IsAccepted);
  const pendingValue = pendingReq?.some(
    (value) => value.followStatus === "pending"
  );
  const [followStatus, setFollowStatus] = useState(
    follow?.includes(currentUserId) ? "following" : "follow"
  );
  const follow_request = async () => {
    try {
      const url = `/api/profile/follow/followRequest?userid=${currentUserId}`;
      if (followStatus === "follow" || followStatus === "pending") {
        await axios.post("/api/profile/follow/followRequest", {
          followusername: currentUserId,
          followStatus: "pending",
        });
        // setFollowStatus("pending");
        mutatefollowerData();
      } else if (followStatus === "following") {
        await axios.delete(
          `/api/profile/follow/followrequestor/?followusername=${currentUserId}`
        );
        await axios.delete(url);
        mutatefollowerData();
        setFollowStatus("follow");
      }
    } catch (error) {
      console.error(error);
    }
  };

 

  const customCodeStyle = {
    fontFamily: "Zilla Slab, serif", // Set your custom font here
    fontSize: "1.6rem", // Set your custom font size
  };

  const progress = ((10 - timeLeft) / 10) * 100;
  return (
    <>
      {fitrrr[0]?.contestState === "previous" ? (
        //winners solutions card
        <>
          <div>
            <div style={{ backgroundColor: "white", height: ".3rem" }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "#08529B",
                  transition: "width .5s ease",
                }}
              />
            </div>
          </div>
          <div
            className={styles.main_disp}
            onMouseUp={handleMouseEnter}
            onMouseDown={handleMouseLeave}
          >
            <div className={styles.left_portion}>
              <div className={styles.profile_score}>
                <div className={styles.left_details_cover}>
                  <div className={styles.circle_beforeImg}>
                    <div className={styles.imageBorder} />
                    <div className={styles.pic}>
                      <Image
                        src={conRankers[currentIndex]?.userId?.image}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          objectFit: "cover",
                        }}
                        alt=""
                      />
                    </div>
                  </div>

                  <div className={styles.Left_details}>
                    <div className={styles.name}>
                      <p>{conRankers[currentIndex]?.userId?.name}</p>
                    </div>
                    <div className={styles.details}>
                      <p>{conRankers[currentIndex]?.userId?.designation}</p>
                    </div>
                  </div>
                </div>

                {session.user.id === currentUserId ? (
                  <></>
                ) : (
                  <div className={styles.follow_buttons_cover}>
                    <div
                      className={styles.follow_buttons}
                      onClick={follow_request}
                      style={{
                        backgroundColor:
                          pendingStatus || pendingValue ? "#8A8A8A" : undefined,
                      }}
                    >
                      <button>
                        {pendingStatus ? (
                          <p>following</p>
                        ) : pendingValue ? (
                          <p>pending</p>
                        ) : (
                          <p>Follow</p>
                        )}
                      </button>
                    </div>

                    <div
                      className={styles.follow_buttons}
                      onClick={codeLiked}
                      style={{
                        backgroundColor: IconLiked ? "#8A8A8A" : undefined,
                        color: IconLiked ? "white" : "",
                      }}
                    >
                      {!IconLiked ? (
                        <button disabled={likedData?.length >= 3}>
                          <p>Like</p>
                        </button>
                      ) : (
                        <button>
                          <p style={{ color: "white" }}>Liked</p>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {isFirstIndex ? null : (
                <div className={styles.leftArrowSubtab} onClick={handleLeft}>
                  <BsChevronLeft style={{ width: "70%", height: "70%" }} />
                </div>
              )}
            </div>
            <div className={styles.right_section}>
              {isFirstIndex ? null : (
                <div className={styles.leftArrowSubMob} onClick={handleLeft}>
                  <BsChevronLeft style={{ width: "70%", height: "70%" }} />
                </div>
              )}
              <SyntaxHighlighter
                wrapLongLines={true}
                language="javascript"
                style={irBlack}
                codeTagProps={{ style: customCodeStyle }}
                className={styles.code_section}
                customStyle={{
                  whiteSpace: "pre-wrap", // Wrap the text
                  wordBreak: "break-all", // Break long words
                  wordWrap: "break-word",
                  overflowX: "hidden", // Hide horizontal overflow
                  padding: "1rem 2rem 2rem",
                }}
              >
                {codeRank}
              </SyntaxHighlighter>
              {isLastIndex ? null : (
                <div className={styles.rightArrow} onClick={handleRight}>
                  <BsChevronRight style={{ width: "70%", height: "70%" }} />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {
            //before announcing the result
            <div className={styles.main_dispSub}>
              <div className={styles.top_sec}>
                <div className={styles.top_secCover}>
                  <div
                    onClick={() => {
                      setshowInterchange(false);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <IoIosArrowBack className={styles.backToHomeIcons} />
                  </div>
                  <div className={styles.timeCal}>
                    <p>
                      Time Left:
                      <span>{elapsedTime} </span>
                    </p>
                  </div>
                </div>

                <p style={{ color: "#1b1918", fontSize: "2rem" }}>
                  Score:{" "}
                  <span style={{ color: "#545454", fontWeight: "500" }}>
                    {codeData?.subData.submission[currentIndexSub]?.score}
                  </span>
                </p>
              </div>

              <div className={styles.right_sectionSub}>
                <SyntaxHighlighter
                  wrapLongLines={true}
                  language="javascript"
                  style={a11yDark}
                  codeTagProps={{ style: customCodeStyle }}
                  className={styles.code_section}
                  customStyle={{
                    whiteSpace: "pre-wrap", // Wrap the text
                    wordBreak: "break-all", // Break long words
                    wordWrap: "break-word",
                    overflowX: "hidden", // Hide horizontal overflow
                    padding: "1rem 2rem 2rem",
                    borderRadius: "0rem 0rem 1rem 1rem",
                  }}
                >
                  {codeSub}
                </SyntaxHighlighter>
                {isFirstIndexSub ? null : (
                  <div className={styles.leftArrowSub} onClick={handleLeftSub}>
                    <BsChevronLeft style={{ width: "70%", height: "70%" }} />
                  </div>
                )}
                {isLastIndexSub ? null : (
                  <div className={styles.rightArrow} onClick={handleRightSub}>
                    <BsChevronRight style={{ width: "70%", height: "70%" }} />
                  </div>
                )}
              </div>
            </div>
          }
        </>
      )}
    </>
  );
}

export default I_changeProfile;
