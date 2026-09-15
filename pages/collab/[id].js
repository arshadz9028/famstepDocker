import { useContext, useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./gigs.module.scss";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Navbar from "../../layouts/Navbar";
import NoSessionNavbar from "../../layouts/NoSessionNavbar";
import Link from "next/link";
import dbConnect from "../../database/conn";
import Collab from "../../model/collab";
import { DateFormatted } from "../../config/userPostTime";
import { BsThreeDots } from "react-icons/bs";
import { FaDotCircle } from "react-icons/fa";
import PostTag from "../../components/post/PostTag";
import { AiFillHeart, AiOutlineSend } from "react-icons/ai";
import { BsCollectionFill } from "react-icons/bs";
import { PiShareFat } from "react-icons/pi";
import EditPost from "../../layouts/models/EditCollab";
import ShareModal from "../../components/shared/ShareModal";
import { ContextProvider } from "../../global/context";
import useSWR, { mutate } from "swr";
import CollabSubmit from "../../components/Collab/CollabPost";
import SubmitProposal from "../../components/Collab/SubmitProposal";

async function fetchImage(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
function CollabPost({ id }) {
  const {
    data: fetchData,
    mutate: mutateinitialData,
    error: initialDataError,
  } = useSWR(`/api/collab/collabShareFetch?profile=${id}`, fetchImage);
  const initialData = fetchData?.data || null;
  const router = useRouter();

  //   const [initialData, setinitialData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const [subRequest, setSubRequest] = useState(false);
  // Base URL for the site - defined at the top level for all cases
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const captionRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);

  const [shareData, setShareData] = useState(null);
  const { setOpenDetails, openDetails, isEditCollab, setIsEditCollab } =
    useContext(ContextProvider);
  const handleShareClick = () => {
    // Get the base URL
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    // Create the post URL
    const postUrl = `${baseUrl}/collab/${initialData._id}`;

    // Prepare title and description
    const title =
      initialData?.title ||
      initialData?.desc?.substring(0, 60) ||
      "Check out this post";
    const description = initialData?.desc
      ? initialData.desc.length > 160
        ? initialData.desc.substring(0, 157) + "..."
        : initialData.desc
      : "";

    // Create share data object
    const shareDataObj = {
      title: title,
      text: description,
      url: postUrl,
    };

    // Update state to open modal
    setShareData(shareDataObj);
    setShareModalOpen(true);
  };

  const handleDots = (id) => {
    setShowEditPost(!showEditPost);
    // settDotId(id);
  };

  const postLiked = async (id) => {
    // showLike(id);
    setLikes(isLiked ? likes - 1 : likes + 1), setIsLiked(!isLiked);
    await axios.put("/api/collab/likedCollab", { id });
    mutateinitialData();
  };
  const postSaved = (id) => {
    // savePostx(id);
    setIsSaved(!IsSaved);
  };

  const handleProposal = async () => {
    if (!session) {
      // If no session, redirect to login
      router.push("/auth/signin");
      return;
    }
    setSubRequest(true);
    // try {
    //   await axios.put(`/api/collab/reqCollab?collabId=${id}`);
    //   // Refresh data to update UI
    //   const response = await axios.get(`/api/collab/${id}`);
    //   //   setinitialData(response.data);
    //   alert("Proposal submitted successfully!");
    // } catch (error) {
    //   console.error(error);
    //   alert("Failed to submit proposal. Please try again.");
    // }
  };

  // Check if current user has already submitted a request
  const isSubmitted =
    session &&
    initialData?.collabRequests &&
    Array.isArray(initialData.collabRequests) &&
    initialData.collabRequests.some(
      (req) => req?.userid?._id === session.user.id
    );

  // Check if current user is the creator of this collab
  const isOwner = session && initialData?.userid?._id === session.user.id;

  // Update the userImage generation to ensure minimum size requirements
  const userImage = (() => {
    if (!initialData?.userid?.image) {
      return `${baseUrl}/android-chrome-192x192.png`;
    }

    // Handle Google profile images
    if (initialData.userid.image.includes("googleusercontent.com")) {
      // Replace s96-c with s400-c to get a larger version
      return initialData.userid.image.replace(/=s\d+-c/, "=s400-c");
    }

    // If the image URL is already absolute, use it
    if (initialData.userid.image.startsWith("http")) {
      return initialData.userid.image;
    }

    // If it's a relative URL, make it absolute
    return `${baseUrl}${initialData.userid.image.startsWith("/") ? "" : "/"}${
      initialData.userid.image
    }`;
  })();

  // Prepare a safe title that's guaranteed to be defined
  const safeTitle = initialData?.title || "Collaboration Opportunity";

  // Prepare rich descriptions for social sharing
  const getDescription = () => {
    const userName = initialData?.userid?.name || "A user";
    const collabType = initialData?.collaborationType || "project";
    const duration = initialData?.durationReq || "";
    const roles =
      initialData?.roles?.map((r) => r.role).join(", ") || "various roles";

    return {
      short: initialData?.desc
        ? initialData.desc.length > 160
          ? initialData.desc.substring(0, 157) + "..."
          : initialData.desc
        : `Check out this collaboration opportunity on Famstep.`,

      full: initialData?.desc
        ? `${userName} is looking for collaborators for a ${collabType}. Duration: ${duration}. Roles needed: ${roles}. ${initialData.desc}`
        : `${userName} is seeking collaborators for an exciting ${collabType} on Famstep. Looking for ${roles}. Duration: ${duration}.`,
    };
  };

  const descriptions = getDescription();

  const date = new Date(initialData?.createdAt);
  const likedUser =
    initialData?.likes?.length !== 0
      ? initialData?.likes?.map((user, index) => user.username)
      : null;

  const savedPostUser =
    initialData?.collections?.length !== 0
      ? initialData?.collections?.map((id) => id)
      : null;

  const [likes, setLikes] = useState(initialData?.likes?.length);
  const [isLiked, setIsLiked] = useState(
    likedUser?.includes(session?.user?.username)
  );

  const [IsSaved, setIsSaved] = useState(
    savedPostUser?.includes(session?.user?.id)
  );
  // Always render the metadata, even during loading
  return (
    <>
      {subRequest && (
        <SubmitProposal
          setSubRequest={setSubRequest}
          ImageData={initialData}
          isEditCollab={isEditCollab}
          mutateImageData={mutateinitialData}
          setIsEditCollab={setIsEditCollab}
        />
      )}
      {openDetails && (
        <CollabSubmit
          userdp={session?.user.image}
          name={session?.user.name}
          ImageData={initialData}
          session={session}
          mutateImageData={mutateinitialData}
          setOpenDetails={setOpenDetails}
          collabID={initialData?._id}
          isEditCollab={isEditCollab}
          setIsEditCollab={setIsEditCollab}
        />
      )}
      <EditPost
        imageData={initialData}
        sessionUser={session}
        mutateImageData={mutateinitialData}
        postId={initialData?._id}
        setShowEditCollab={setShowEditPost}
        tDotId={initialData?._id}
        showEditCollab={showEditPost}
        setOpenDetails={setOpenDetails}
        setIsEditCollab={setIsEditCollab}
      />
      <Head>
        <title>{safeTitle} | Famstep</title>
        <meta
          name="description"
          content={descriptions.short}
          key="description"
        />

        {/* OpenGraph tags with image size specifications */}
        <meta
          property="og:title"
          content={`${safeTitle} | Famstep`}
          key="og:title"
        />
        <meta
          property="og:description"
          content={descriptions.full}
          key="og:description"
        />
        <meta property="og:image" content={userImage} key="og:image" />
        <meta property="og:image:width" content="400" key="og:image:width" />
        <meta property="og:image:height" content="400" key="og:image:height" />
        <meta
          property="og:image:type"
          content="image/jpeg"
          key="og:image:type"
        />
        <meta
          property="og:image:secure_url"
          content={userImage}
          key="og:image:secure_url"
        />
        <meta property="og:type" content="article" key="og:type" />
        <meta
          property="og:url"
          content={`${baseUrl}/collab/${id}`}
          key="og:url"
        />
        <meta property="og:site_name" content="Famstep" key="og:site_name" />

        {/* WhatsApp specific properties */}
        <meta property="whatsapp:title" content={safeTitle} />
        <meta property="whatsapp:description" content={descriptions.full} />

        {/* LinkedIn specific professional metadata */}
        <meta
          name="author"
          content={initialData?.userid?.name || "Famstep"}
          key="author"
        />
        <meta name="linkedin:owner" content="Famstep" key="linkedin:owner" />
        <meta property="og:locale" content="en_US" key="og:locale" />
        <meta
          property="article:published_time"
          content={initialData?.createdAt || new Date().toISOString()}
          key="article:published_time"
        />
        <meta
          property="article:modified_time"
          content={initialData?.updatedAt || new Date().toISOString()}
          key="article:modified_time"
        />
        <meta
          property="article:author"
          content={initialData?.userid?.name || "Famstep"}
          key="article:author"
        />
        <meta name="linkedin:description" content={descriptions.full} />

        {/* Twitter Card tags with large summary image */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@famstep" />
        <meta
          name="twitter:creator"
          content={`@${initialData?.userid?.username || "famstep"}`}
        />
        <meta name="twitter:title" content={safeTitle} />
        <meta name="twitter:description" content={descriptions.full} />
        <meta name="twitter:image" content={userImage} />
        <meta
          name="twitter:image:alt"
          content={`${
            initialData?.userid?.name || "User"
          }'s collaboration post`}
        />

        {/* Additional SEO metadata */}
        <meta
          name="keywords"
          content={`collaboration, ${initialData?.collaborationType || ""}, ${
            initialData?.roles?.map((r) => r.role).join(", ") || ""
          }, famstep, project collaboration`}
        />
        <meta name="robots" content="index, follow" key="robots" />
        <link
          rel="canonical"
          href={`${baseUrl}/collab/${id}`}
          key="canonical"
        />
      </Head>

      {status === "authenticated" ? (
        <Navbar select={safeTitle} session={session} />
      ) : (
        <NoSessionNavbar select={"Collabs"} />
      )}

      {error || !initialData ? (
        <div className={styles.errorContainer}>
          {error || "Collaboration not found"}
        </div>
      ) : (
        <div className={styles.collabPostWrapper}>
          <div className={styles.collabPostContainer}>
            <div className={styles.breadcrumbs}>
              <span onClick={() => router.push("/collab")}>Collaborations</span>{" "}
              &gt; <span>{initialData.title}</span>
            </div>

            <div className={styles.right_expand}>
              <div className={styles.image_time}>
                <div
                  className={styles.senderPost_img_circle}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleProfileClick(initialData?.userid?._id)}
                >
                  {initialData.userid?.image ? (
                    <Image
                      src={initialData.userid.image}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectFit: "cover",
                      }}
                      alt="post_upload_user_dp"
                    />
                  ) : (
                    <Image
                      src="/noavatar.png"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectFit: "cover",
                      }}
                      alt="Default user"
                    />
                  )}
                </div>
                <div className={styles.name_time} style={{ cursor: "pointer" }}>
                  <p
                    className={styles.post_name}
                    onClick={() => handleProfileClick(initialData?.userid?._id)}
                  >
                    {initialData?.userid?.name}
                  </p>
                  <p className={styles.time}>{DateFormatted(date)}</p>
                </div>
              </div>
              {status === "authenticated" && (
                <div className={styles.fullaction}>
                  <div
                    className={styles.prof_icon}
                    onClick={(e) => {
                      // setselectinitialData(value);
                      handleDots(initialData._id);
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
                  </div>
                </div>
              )}
            </div>
            <div className={styles.TagButton}>
              <div className={styles.langugeButtonCover}>
                <div className={styles.collabType}>
                  <FaDotCircle />
                  {initialData?.collaborationType}
                </div>
              </div>

              {!isOwner && status === "authenticated" && (
                <div className={styles.langugeButtonCover}>
                  {isSubmitted ? (
                    <div className={styles.langugeButton}>Submitted</div>
                  ) : (
                    <div
                      className={styles.langugeButton}
                      onClick={handleProposal}
                    >
                      Submit Proposal
                    </div>
                  )}
                </div>
              )}
            </div>

            <h1>{initialData.title}</h1>

            <div className={styles.collabDetails}>
              <div className={styles.collabMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Duration:</span>
                  <span className={styles.metaValue}>
                    {initialData.durationReq}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>
                    | Collaboration Type:
                  </span>
                  <span className={styles.metaValue}>
                    {initialData.collaborationType}
                  </span>
                </div>
                {initialData.rate && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>-</span>
                    <span className={styles.metaValue}>
                      ₹{initialData.rate}/hr
                    </span>
                  </div>
                )}
              </div>

              <h2>Roles Required</h2>
              <div className={styles.roles}>
                {initialData.roles.map((role, index) => (
                  <div key={index} className={styles.roleCard}>
                    <h3>{role.role}</h3>
                    <div className={styles.skillsList}>
                      <span className={styles.skillsLabel}>Skills:</span>
                      {Array.isArray(role.skills) && role.skills.length > 0 ? (
                        <span className={styles.skillsTags}>
                          {role.skills.join(", ")}
                        </span>
                      ) : (
                        <span className={styles.noSkills}>
                          No skills specified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.post_caption}>
                <pre
                  ref={captionRef}
                  style={{
                    display: "-webkit-box",
                    fontSize: "16px",
                    WebkitLineClamp: expanded ? "unset" : 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "1.5",
                  }}
                >
                  {initialData?.desc}
                </pre>
                {showToggle && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className={styles.toggleButton}
                  >
                    {expanded ? "See Less" : "See More"}
                  </button>
                )}
              </div>

              {/* Submit Proposal Button */}
              <div className={styles.proposalActionContainer}>
                {status === "authenticated" ? (
                  <>
                    <div className={styles.count_likes_comment}>
                      <p className={styles.likes} onClick={"handleLikeList"}>
                        {likedUser?.length} <span>Likes</span>
                      </p>
                    </div>
                    <div className={styles.icons_likes}>
                      <div className={styles.icons_likesCover}>
                        <PostTag
                          icons={AiFillHeart}
                          title={"Like"}
                          onClick={() => {
                            postLiked(initialData?._id);
                          }}
                          likes={initialData?._id}
                          isLiked={likedUser?.includes(session?.user?.username)}
                          style={{
                            cursor: "pointer",
                            ...(likedUser?.includes(session?.user?.username)
                              ? {
                                  color: "red",
                                  stroke: "red",
                                }
                              : {
                                  color: "white",
                                  stroke: "black",
                                  strokeWidth: "8rem",
                                }),
                          }}
                        />
                        <PostTag
                          icons={PiShareFat}
                          title={"Share"}
                          style={{
                            cursor: "pointer",
                            color: "black",
                          }}
                          onClick={handleShareClick}
                        />
                        {/* <PostTag
                          icons={BsCollectionFill}
                          onClick={() => {
                            postSaved(initialData?._id);
                          }}
                          title={"Save"}
                          style={{
                            cursor: "pointer",
                            ...(IsSaved
                              ? {
                                  color: "black",
                                  stroke: "black",
                                }
                              : {
                                  color: "white",
                                  stroke: "black",
                                  strokeWidth: "0.1rem",
                                }),
                          }}
                        /> */}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.signupPrompt}>
                    <p>Want to collaborate on this project?</p>
                    <Link href="/auth/signin">
                      <span className={styles.signupLink}>Sign in</span>
                    </Link>{" "}
                    or
                    <Link href="/auth/signup">
                      <span className={styles.signupLink}>
                        Create an account
                      </span>
                    </Link>{" "}
                    to submit a proposal
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareData={shareData}
      />
    </>
  );
}

// Add getServerSideProps for server-side data fetching
export async function getServerSideProps({ params }) {
  try {
    await dbConnect();

    // Find the collaboration by ID
    const collab = await Collab.findById(params.id)
      .populate("userid", "name username image")
      .populate("collabRequests.userid", "name username image")
      .lean();
    if (!collab) {
      return {
        props: {
          initialData: null,
          id: params.id,
        },
      };
    }

    // Convert ObjectId to string for JSON serialization
    const serializedCollab = JSON.parse(JSON.stringify(collab));

    return {
      props: {
        initialData: serializedCollab,
        id: params.id,
      },
    };
  } catch (error) {
    console.error("Error fetching collab data:", error);
    return {
      props: {
        initialData: null,
        id: params.id,
      },
    };
  }
}

export default CollabPost;
