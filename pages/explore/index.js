import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../layouts/Navbar";
import styles from "../../styles/explore.module.scss";
import loaderStyles from "../../styles/ImageLoading.module.scss";
import { getSession } from "next-auth/react";
import axios from "axios";
import { ContextProvider } from "../../global/context";
import Zoomphoto from "../../layouts/post/Zoomphoto";
import User from "../../model/userModel";
import useSWRInfinite from "swr/infinite";
import ProfilePost from "../../components/ProfilePost";
async function fetchPhoto(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching photos:", error);
    return null;
  }
}

function Explore({ session, allusers }) {
  const { model } = useContext(ContextProvider);
  const [codeContents, setCodeContents] = useState({});

  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateImageData,
  } = useSWRInfinite(
    (index) => `/api/explore/explorePosts?page=${index + 1}&limit=21`,
    fetchPhoto,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Combine pages of data
  const posts = data ? data.flatMap((page) => page.data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isReachingEnd = data && data[data.length - 1]?.data?.length === 0;

  const postData = { data: posts };
  // Handle infinite scrolling
  const handleInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      !isLoadingMore &&
      !isReachingEnd
    ) {
      setSize(size + 1); // Load more posts
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [isLoadingMore, isReachingEnd]);

  // infinite scroll end

  useEffect(() => {
    const fetchCodeContents = async () => {
      const contents = {};

      for (const value of postData.data || []) {
        if (!value.image) {
          try {
            const response = await fetch(value.pracsUrl);
            const codeContent = await response.text();
            const match = codeContent.match(/([^]*)/);
            contents[value._id] = match && match[1] ? match[1] : "";
          } catch (error) {
            console.error(`Error fetching code for post ${value._id}:`, error);
          }
        }
      }

      setCodeContents(contents);
    };

    if (postData.data) {
      fetchCodeContents();
    }
  }, [isLoadingMore]); // Only re-run if postData changes
  useEffect(() => {
    document.body.style.overflow = model ? "hidden" : "unset";
    document.body.style.overflowX = "hidden";
  }, [model]);

  return (
    <>
      <Navbar select={"Explore"} session={session} />
      {model && (
        <Zoomphoto
          allUsers={allusers}
          dp={session?.user.image}
          userName={session?.user.username}
          session={session}
          imageData={posts}
          mutateImageData={mutateImageData}
        />
      )}
      <section className={styles.explore_section}>
        <div>
          {postData?.data?.map((value, index) => {
            const codeContent = codeContents[value._id];

            return (
              <div className={styles.cards} key={value._id}>
                {
                  <ProfilePost
                    postData={value}
                    userId={session?.user.id}
                    userName={session?.user.username}
                  />
                }
              </div>
            );
          })}

          {isLoadingMore && (
            <div
              className={loaderStyles.loaderCover}
              style={{ height: isLoadingInitialData ? "70vh" : "auto" }}
            >
              <div className={loaderStyles.loader} />
            </div>
          )}

          {isReachingEnd && (
            <div className={loaderStyles.ParaCover}>
              <p className={loaderStyles.loaderCoverP}>
                There are no more posts to display.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  const { id, username, isNewUser } = session?.user || {};
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  if (isNewUser) {
    return {
      redirect: {
        destination: "/getting-started",
        permanent: false,
      },
    };
  }

  const allusers = await User.find({ username: { $ne: username } });

  return {
    props: {
      session,
      allusers: JSON.parse(JSON.stringify(allusers)),
    },
  };
}

export default Explore;
