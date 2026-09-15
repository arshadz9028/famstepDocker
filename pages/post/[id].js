import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { ContextProvider } from "../../global/context";
import Navbar from "../../layouts/Navbar";
import NoSessionNavbar from "../../components/shared/NoSessionNavbar";
import ShareablePostCard from "../../components/shared/ShareablePostCard";
import styles from "../../styles/Home.module.scss";
import { DateFormatted } from "../../config/userPostTime";
import connectDb from "../../database/conn";
import Post from "../../model/postModel";
import MobileZoomPhoto from "../../components/home/MobileZoomPhoto";
import useSWR from "swr";
import EditPost from "../../layouts/models/EditPost";
import AddImage from "../../layouts/post/PostImage";
import SharedMobileView from "../../components/shared/SharedMobileView";
// Add a fetcher function for SWR
async function fetchZoom(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function fetchImage(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function PostDetail({ id, absoluteUrl, initialData: serverInitialData }) {
  const router = useRouter();
  const {
    data: initialData,
    mutate: mutateinitialData,
    error: initialDataError,
  } = useSWR(`/api/home/shareImageFetch?profile=${id}`, fetchImage);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const [baseUrl, setBaseUrl] = useState(absoluteUrl || "");
  const [isMobile, setIsMobile] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);

  const {
    Openmodal,
    showLike,
    createpost,
    setCommenter,
    commenter,
    Closemodal,
    zoomId,
    show,
    setShow,
    reply,
    setReply,
    Zoomphoto,
    model,
    setzoomId,
  } = useContext(ContextProvider);
  // Initialize baseUrl on client-side only
  useEffect(() => {
    setzoomId(id);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);

      // Check if we're on mobile
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 767);
      };

      // Initial check
      checkMobile();

      // Add event listener for window resize
      window.addEventListener("resize", checkMobile);

      // Cleanup
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);
  const likedUser =
    initialData?.data?.likes?.length !== 0
      ? initialData?.data?.likes?.map((user, index) => user.username)
      : null;
  const savedPostUser =
    initialData?.data?.collections?.length !== 0
      ? initialData?.data?.collections?.map((id) => id)
      : null;

  // States for post interactions
  const [heartLike, setHeartLike] = useState(initialData?.data?.likes?.length);
  const [isLiked, setIsLiked] = useState(
    likedUser?.includes(session?.user?.username)
  );
  const [isSaved, setIsSaved] = useState(
    savedPostUser?.includes(session?.user?.id)
  );
  // Add debugging for post data
  useEffect(() => {
    if (typeof window !== "undefined" && initialData?.data) {
    }
  }, [initialData?.data]);

  useEffect(() => {
    // Set liked/saved status if we have session and post data
    if (session && initialData?.data) {
      try {
        // Check if user has liked the post
        const likedUser =
          Array.isArray(initialData?.data.likes) &&
          initialData?.data.likes.length > 0
            ? initialData?.data.likes
                .map((user) => user?.username)
                .filter(Boolean)
            : [];
        setIsLiked(
          session.user?.username && likedUser.includes(session.user.username)
        );

        // Check if user has saved the post
        const savedPostUser =
          Array.isArray(initialData?.data.collections) &&
          initialData?.data.collections.length > 0
            ? initialData?.data.collections.map((id) => id).filter(Boolean)
            : [];
        setIsSaved(session.user?.id && savedPostUser.includes(session.user.id));
      } catch (err) {
        console.error("Error processing like/save status:", err);
      }
    }
  }, [session, initialData?.data]);

  const handleLike = async (postId) => {
    try {
      if (!session) {
        router.push("/login");
        return;
      }
      showLike(postId);
      setIsLiked(!isLiked);
      await mutateinitialData();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSave = async (postId) => {
    try {
      if (!session) {
        router.push("/login");
        return;
      }
      await axios.put("/api/home/savePost", { id: postId });
      setIsSaved(!isSaved);
      await mutateinitialData();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleShare = async (postId) => {
    // Just log the share action for now
  };

  // Create a fallback post structure if data is incomplete
  const enhancedPostData = initialData?.data
    ? {
        ...initialData.data,
        // Ensure these fields exist even if missing from API
        _id: initialData.data._id || id,
        images:
          Array.isArray(initialData.data.images) &&
          initialData.data.images.length > 0
            ? initialData.data.images.map((img) => {
                if (typeof img === "string") {
                  return { image: img };
                } else if (img && typeof img === "object") {
                  return { image: img.image || "" };
                }
                return { image: "" };
              })
            : [{ image: "/noavatar.png" }],
        desc: initialData.data.desc || "Shared from Famstep",
        userid:
          initialData.data.userid && typeof initialData.data.userid === "object"
            ? {
                _id: initialData.data.userid._id || "",
                name: initialData.data.userid.name || "User",
                username: initialData.data.userid.username || "",
                image: initialData.data.userid.image || "/noavatar.png",
              }
            : { _id: "", name: "User", username: "", image: "/noavatar.png" },
        likes: Array.isArray(initialData.data.likes)
          ? initialData.data.likes
          : [],
        collections: Array.isArray(initialData.data.collections)
          ? initialData.data.collections
          : [],
        createdAt: initialData.data.createdAt || new Date().toISOString(),
      }
    : null;

  // Enhance the description generation
  const generateSocialContent = (postData) => {
    if (!postData)
      return {
        title: "Post on Famstep",
        description: "View this post on Famstep",
      };

    const userName = postData?.userid?.name || "User";
    const postText = postData?.desc || "";
    const imageCount = postData?.images?.length || 0;

    // Twitter specific truncation (max 70 chars for title, 200 for description)
    const twitterTitle = postText
      ? postText.length > 60
        ? `${postText.substring(0, 57)}...`
        : postText
      : `${userName}'s post`;

    let description = "";
    if (postText) {
      description =
        postText.length > 180 ? `${postText.substring(0, 177)}...` : postText;
    }

    const mediaInfo =
      imageCount > 0
        ? ` • ${imageCount} ${imageCount === 1 ? "image" : "images"}`
        : "";

    return {
      title: postText
        ? `${userName} on Famstep: "${description}"`
        : `${userName}'s post on Famstep`,
      description: `${description}${mediaInfo} • View on Famstep`,
      twitterTitle: `${userName}: ${twitterTitle}`,
      twitterDescription: `${description}${mediaInfo}`,
    };
  };

  // Get the main image URL - ensure it's absolute and high quality for sharing
  const getMainImageUrl = (postData) => {
    if (!postData?.images?.[0]?.image) {
      return `${baseUrl}/android-chrome-512x512.png`;
    }

    const mainImage = postData.images[0].image;

    // If it's a Google profile image, get larger version
    if (mainImage.includes("googleusercontent.com")) {
      return mainImage.replace(/=s\d+-c/, "=s800-c");
    }

    // If it's already an absolute URL
    if (mainImage.startsWith("http")) {
      return mainImage;
    }

    // Make relative URL absolute
    return `${baseUrl}${mainImage.startsWith("/") ? "" : "/"}${mainImage}`;
  };

  const socialContent = generateSocialContent(enhancedPostData);
  const mainImageUrl = getMainImageUrl(enhancedPostData);

  // Add SWR hook to fetch comment data
  const {
    data: commentsData,
    mutate: mutateComment,
    error: commentsError,
  } = useSWR(`/api/home/post/zoomPhotoFetch?userPostId=${id}`, fetchZoom);
  return (
    <>
      {createpost && (
        <AddImage
          userdp={session?.user.image}
          name={session?.user.name}
          ImageData={initialData?.data}
          session={session}
          mutateImageData={mutateinitialData}
        />
      )}

      <Head>
        {/* Essential Meta Tags */}
        <title>{socialContent.title}</title>
        <meta name="description" content={socialContent.description} />

        {/* OpenGraph Tags */}
        <meta property="og:site_name" content="Famstep" />
        <meta property="og:title" content={socialContent.title} />
        <meta property="og:description" content={socialContent.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${baseUrl}/post/${id}`} />
        <meta property="og:image" content={mainImageUrl} />
        <meta property="og:image:secure_url" content={mainImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={socialContent.title} />
        <meta property="og:image:type" content="image/jpeg" />

        {/* Article Specific */}
        <meta
          property="article:published_time"
          content={enhancedPostData?.createdAt || new Date().toISOString()}
        />
        <meta
          property="article:author"
          content={enhancedPostData?.userid?.name || "Famstep User"}
        />
        <meta
          property="article:modified_time"
          content={
            enhancedPostData?.updatedAt ||
            enhancedPostData?.createdAt ||
            new Date().toISOString()
          }
        />

        {/* Twitter Card tags - Optimized for better preview */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@famstep" />
        <meta
          name="twitter:creator"
          content={`@${enhancedPostData?.userid?.username || "famstep"}`}
        />
        <meta name="twitter:title" content={socialContent.twitterTitle} />
        <meta
          name="twitter:description"
          content={socialContent.twitterDescription}
        />
        <meta name="twitter:image" content={mainImageUrl} />
        <meta name="twitter:image:alt" content={socialContent.twitterTitle} />
        <meta name="twitter:domain" content="famstep.com" />
        <meta name="twitter:url" content={`${baseUrl}/post/${id}`} />
        <meta name="twitter:label1" content="Written by" />
        <meta
          name="twitter:data1"
          content={enhancedPostData?.userid?.name || "Famstep User"}
        />
        {enhancedPostData?.createdAt && (
          <>
            <meta name="twitter:label2" content="Posted" />
            <meta
              name="twitter:data2"
              content={new Date(
                enhancedPostData.createdAt
              ).toLocaleDateString()}
            />
          </>
        )}

        {/* Additional SEO */}
        <meta
          name="author"
          content={enhancedPostData?.userid?.name || "Famstep User"}
        />
        <link rel="canonical" href={`${baseUrl}/post/${id}`} />
      </Head>

      {status === "authenticated" ? (
        <Navbar select={socialContent.title} session={session} />
      ) : (
        <NoSessionNavbar select={"Collabs"} />
      )}

      <div>
        {error || !initialData?.data ? (
          <div className={styles.errorContainer}>
            {error || "Post not found"}
          </div>
        ) : isMobile ? (
          // Mobile view with MobileZoomPhoto component
          <SharedMobileView
            dp={session?.user?.image || "/noavatar.png"}
            userName={session?.user?.username || "User"}
            sessionUser={session?.user || null}
            imageData={initialData?.data}
            mutateImageData={mutateinitialData}
            commentsData={commentsData || { data: { comments: [] } }}
            mutateComment={mutateComment}
            languageTag={initialData?.data?.languageTag}
            likes={initialData?.data?.likes || []}
          />
        ) : (
          // Desktop view with ShareablePostCard
          <ShareablePostCard
            post={initialData.data}
            session={session}
            time={
              initialData.data.createdAt
                ? DateFormatted(new Date(initialData.data.createdAt))
                : "Recently"
            }
            onLike={handleLike}
            onSave={handleSave}
            onShare={handleShare}
            mutateComment={mutateComment}
            commentsData={commentsData}
            isLiked={isLiked}
            mutateinitialData={mutateinitialData}
            isSaved={isSaved}
            heartLike={heartLike}
            setHeartLike={setHeartLike}
          />
        )}
      </div>
    </>
  );
}

// Server-side rendering to get the initial post data
export async function getServerSideProps({ params, req }) {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const absoluteUrl = `${protocol}://${host}`;

    await connectDb();

    const post = await Post.findById(params.id)
      .populate("userid", "name username image")
      .lean();

    if (!post) {
      return {
        props: {
          initialData: null,
          id: params.id,
          absoluteUrl,
        },
      };
    }

    // Ensure all URLs in the post are absolute
    const normalizedPost = {
      ...post,
      _id: post._id.toString(),
      images: (post.images || []).map((img) => {
        const imgUrl = typeof img === "string" ? img : img?.image || "";
        return {
          image: imgUrl.startsWith("http")
            ? imgUrl
            : `${absoluteUrl}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`,
        };
      }),
      userid: post.userid
        ? {
            _id: post.userid._id.toString(),
            name: post.userid.name || "User",
            username: post.userid.username || "",
            image: post.userid.image
              ? post.userid.image.startsWith("http")
                ? post.userid.image
                : `${absoluteUrl}${
                    post.userid.image.startsWith("/") ? "" : "/"
                  }${post.userid.image}`
              : `${absoluteUrl}/noavatar.png`,
          }
        : null,
      createdAt: post.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: post.updatedAt?.toISOString() || new Date().toISOString(),
    };

    return {
      props: {
        initialData: JSON.parse(JSON.stringify(normalizedPost)),
        id: params.id,
        absoluteUrl,
      },
    };
  } catch (error) {
    console.error("Error fetching post data:", error);
    return {
      props: {
        initialData: null,
        id: params.id,
        absoluteUrl,
      },
    };
  }
}

export default PostDetail;
