import React, { useState, useContext, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../../../styles/groupMoreDetails.module.scss";
import style from "../../../styles/Home.module.scss";
import loaderStyles from "../../../styles/ImageLoading.module.scss";
import ask from "../../../assets/icons/ask.png";
import post1 from "../../../assets/icons/post.png";
import Navbar from "../../../layouts/Navbar";
import Postcard from "../../../components/post/Postcard";
import { BiDotsHorizontalRounded } from "react-icons/bi";
// import Createpost from "../../../components/post/Createpost";
import { PiNotePencilFill } from "react-icons/pi";
import ConnectionsList from "../../../layouts/LearningGroup/MemberList";
import MoreOption from "../../../layouts/Network/MoreOption";
import EditGroup from "../../../layouts/Network/EditGroup";
import InviteFriends from "../../../layouts/Network/InviteFriends";
import GroupAbout from "../../../layouts/Network/GroupAbout";
import useSWR from "swr";
import axios from "axios";
import { MdOutlineEdit } from "react-icons/md";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import connectDb from "../../../database/conn";
import { ContextProvider } from "../../../global/context";
import AddImage from "../../../layouts/post/PostImage";
import followModel from "../../../model/followModel";
import User from "../../../model/userModel";
import Zoomphoto from "../../../layouts/post/Zoomphoto";
import { DateFormatted } from "../../../config/userPostTime";
import { BiChevronLeft } from "react-icons/bi";
import Link from "next/link";
import ReportGroup from "../../../layouts/Network/ReportGroup";
import DeleteGroup from "../../../layouts/Network/DeleteGroup";
import { IoImage } from "react-icons/io5";
import NoCardsMessage from "../../../components/network/NoCardsMessage";
import useSWRInfinite from "swr/infinite";

async function fetchGroups(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
async function fetchPhoto(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

function GroupsDetails({ session, userData, followers, allUsers }) {
  const { model, setCreatepost, setisGrpPost, setGrpId, createpost } =
    useContext(ContextProvider);

  // const [postimage, setPostimage] = useState(false);
  const [friendList, setFriendList] = useState(false);
  const [threeDotOption, setThreeDotOption] = useState(false);
  const [threeDotOptionMob, setThreeDotOptionMob] = useState(false);
  const [dialogDelete, setdialogDelete] = useState(false);
  const [dialogeReport, setdialogeReport] = useState(false);
  const [edit, setEdit] = useState(false);
  const [inviteModel, setInviteModel] = useState(false);
  const [aboutModel, setAboutModel] = useState(false);
  const router = useRouter();
  const { groups } = router.query;

  let meproficons = useRef(null);
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateImageData,
  } = useSWRInfinite(
    (index) =>
      `/api/group/groupPosts?grpId=${groups}&page=${index + 1}&limit=5`,
    fetchPhoto,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const posts = data ? data.flatMap((page) => page.data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isReachingEnd = data && data[data.length - 1]?.data?.length === 0;

  const postData = { data: posts };
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

  const {
    data: groupData,
    mutate: mutategroupData,
    error: userError,
  } = useSWR(
    `/api/group/groupDataFetch/groupMain?groups=${groups}`,
    fetchGroups
  );
  // const groupData = grpData?.data.find((value) => value._id == groups);
  const admin = groupData?.data?.admin?._id === session.user.id;

  /* ye filter invite members k liye hai */
  const filteredUserData = userData?.filter(
    (user) =>
      !groupData?.data?.members.some((groupUser) => groupUser.user === user._id)
  );

  /* ye filter mutual-friends members k liye hai */
  const filteredfollowers = followers?.followers.filter((user) =>
    groupData?.data?.members.some(
      (groupUser) => groupUser?.user?._id === user?.userid?._id
    )
  );
  /* ye filter join/invite button ko control k liye h */
  const filteredUsers = userData.filter((user) =>
    groupData?.data?.members.some(
      (groupUser) => groupUser?.user?._id === user?._id
    )
  );
  const joinMembers = filteredUsers.some(
    (value) => value?._id == session?.user.id
  );
  const handleJoin = async () => {
    // setJoin(true)
    try {
      await axios.put("/api/group/joinGroup", { grpId: groups });
      mutategroupData();
    } catch (error) { }
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (friendList || edit || inviteModel || createpost || model ) {
      document.body.style.overflow = "hidden";
      // setEditDetail(true);
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [friendList, edit, inviteModel, createpost]);

  // using ref for closing and opening notificaion, me and search model
  useEffect(() => {
    const checkprof = (e) => {
      if (!meproficons.current.contains(e.target)) {
        setThreeDotOption(false);
      }
    };

    document.addEventListener("mousedown", checkprof, true);

    return () => {
      document.removeEventListener("mousedown", checkprof, true);
    };
  });
  const createdDate = groupData?.data?.createdAt.split("-")[0];

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (dialogDelete || dialogeReport || aboutModel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [dialogDelete, dialogeReport, aboutModel]);

  //post
  return (
    <>
      <div className={styles.NavbarCover}>
        <Navbar select={"groups"} session={session} />
      </div>

      {/* /member model */}
      {friendList && (
        <ConnectionsList
          setFriendList={setFriendList}
          friendList={friendList}
          groupData={groupData}
          followers={followers}
          userId={followers?.user}
          session={session}
          admin={groupData?.data?.admin._id}
          follow={
            followers?.following.length !== 0
              ? followers?.following.map((foll) => foll.userid)
              : null
          }
        />
      )}

      {/* edit model */}
      {edit && (
        <EditGroup setEdit={setEdit} groupData={groupData.data} edit={edit} />
      )}

      {/* invite Friend model */}
      {inviteModel && (
        <InviteFriends
          setInviteModel={setInviteModel}
          userData={filteredUserData}
          groupData={groupData.data}
          session={session}
        />
      )}

      {/* GroupAbout model */}
      {aboutModel && (
        <GroupAbout setAboutModel={setAboutModel} groupData={groupData.data} />
      )}

      {dialogDelete && (
        <DeleteGroup
          admin={admin}
          setdialogDelete={setdialogDelete}
          dialogDelete={dialogDelete}
        />
      )}

      {dialogeReport && (
        <ReportGroup
          admin={admin}
          setdialogeReport={setdialogeReport}
          dialogeReport={dialogeReport}
        />
      )}

      {createpost && (
        <AddImage
          userdp={session?.user.image}
          name={session?.user.name}
          ImageData={posts}
          session={session}
          mutateImageData={mutateImageData}
        />
      )}
      {model && (
        <Zoomphoto
          dp={session?.user.image}
          userName={session?.user.username}
          imageData={postData}
          mutateImageData={mutateImageData}
          session={session}
          allUsers={allUsers}
        />
      )}

      <Link href="./">
        <div className={styles.mobArrow} onClick={()=>setisGrpPost(false)} >
          <BiChevronLeft className={styles.mobArrowIcon} />
        </div>
      </Link>

      <div className={styles.main}>
        <div className={styles.center}>
          {/* left side */}
          <div className={styles.leftSide}>
            <div className={styles.upperPart}>
              <div className={styles.ImageCover}>
                {groupData?.data?.image && <Image
                  src={groupData?.data?.image}
                  alt="background Image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                />}
              </div>
              <p className={styles.groupName}>{groupData?.data?.groupName}</p>
            </div>

            {/* admin details */}
            <div className={styles.adminDetails}>
              {admin ? (
                <p className={styles.admin}>Owner</p>
              ) : (
                <p className={styles.admin}>Admin</p>
              )}

              <div className={styles.AdminImageCover}>
                {groupData?.data?.admin?.image && <Image
                  src={groupData?.data?.admin?.image}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                  alt="admin image"
                />}
              </div>
              <p className={styles.adminName}>
                {groupData?.data?.admin?.name}
                <span>formed this group {createdDate}</span>
              </p>
            </div>
          </div>

          {/* center part of background */}
          <div className={styles.centerUpperImage}>
            <div className={styles.centerImageCover}>
              {groupData?.data?.background && <Image
                src={groupData?.data?.background}
                alt="background Image"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "contain",
                }}
              />}
              {admin && (
                <div
                  className={styles.adminEdit}
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  <MdOutlineEdit className={styles.adminEditIcons} />
                </div>
              )}
            </div>
            <div className={styles.CenterBelowPart}>
              <div className={styles.CenterImageMobile}>
                <div className={styles.CenterImageMobileCover}>
                  <div className={styles.ImageCoverMobile}>
                     {groupData?.data?.image && <Image
                      src={groupData?.data?.image}
                      alt="background Image"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectFit: "cover",
                      }}
                    />}
                  </div>

                  <p className={styles.CenterName}>
                    {groupData?.data?.groupName}
                  </p>
                </div>

                <div className={styles.dotModel} ref={meproficons}>
                  <BiDotsHorizontalRounded
                    className={styles.dotImageMore1}
                    onClick={() => setThreeDotOptionMob(!threeDotOptionMob)}
                  />
                  {threeDotOptionMob && (
                    <MoreOption
                      setThreeDotOption={setThreeDotOptionMob}
                      setEdit={setEdit}
                      joinMembers={joinMembers}
                      session={session}
                      setAboutModel={setAboutModel}
                      setdialogeReport={setdialogeReport}
                      setdialogDelete={setdialogDelete}
                    />
                  )}
                </div>
              </div>
              <div className={styles.seeMoreButton}>
                <div className={styles.seeMoreDot}>
                  <div className={styles.joinButton}>
                    {admin ? (
                      <input
                        type="button"
                        value="Invite"
                        onClick={() => setInviteModel(true)}
                      />
                    ) : (
                      <>
                        {joinMembers ? (
                          <input
                            type="button"
                            value="Joined"
                            onClick={handleJoin}
                          />
                        ) : (
                          <input
                            type="button"
                            value="Join"
                            onClick={handleJoin}
                          />
                        )}
                      </>
                    )}
                  </div>
                  <div className={styles.dotModel} ref={meproficons}>
                    <BiDotsHorizontalRounded
                      className={styles.dotImageMore}
                      onClick={() => setThreeDotOption(!threeDotOption)}
                    />
                    {threeDotOption && (
                      <MoreOption
                        admin={admin}
                        joinMembers={joinMembers}
                        session={session}
                        setThreeDotOption={setThreeDotOption}
                        setEdit={setEdit}
                        setAboutModel={setAboutModel}
                        setdialogeReport={setdialogeReport}
                        setdialogDelete={setdialogDelete}
                      />
                    )}
                  </div>
                </div>
                <p
                  className={styles.seeMoreFriendsMobile}
                  onClick={() => setFriendList(true)}
                >
                  {groupData?.data?.members?.length} members
                </p>
              </div>
            </div>

            {/* create a post for mobile */}

            {joinMembers && (
              <Link href="/create-post">
                <div
                  className={styles.mobileCreatePost}
                  onClick={() => {
                    setGrpId(groups);
                    setisGrpPost(true);
                  }}
                >
                  <PiNotePencilFill className={styles.pencil} />
                </div>
              </Link>
            )}
          </div>

          {/* postcard */}

          <div className={styles.groupPostCard}>
            {/* upload image  */}
            {joinMembers && (
              <div className={styles.uploadeImage}>
                {/*create a post components */}
                <div className={style.create_post_cotainer} >

                  {/* <div className={style.option_post}>
                    <Createpost
                      icons={ask}
                      title="Ask a question"
                      postimage={postimage}
                    />
                    <Createpost
                      icons={post1}
                      title="Create a post"
                      postimage={postimage}
                      onClick={() => {
                        setCreatepost(true);
                        setisGrpPost(true);
                        setGrpId(groups);
                      }}
                    />
                  </div> */}

                  <div className={style.flex_both}>
                    <div className={style.circle_img}>
                      {session?.user.image && <Image
                        src={session?.user.image}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          objectFit: "cover",
                        }}
                        alt="creat_post_user_image"
                      />}
                    </div>
                    <input
                      readOnly
                      className={style.post_input}
                      type="text"
                      name="createPost"
                      id="createPost"
                      value="Write something ..."
                      onClick={() => {
                        setCreatepost(true);
                        setisGrpPost(true);
                        setGrpId(groups);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {postData?.data?.length > 0 ? (
              postData?.data?.map((value) => {
                const date = new Date(value.createdAt);
                return (
                  <Postcard
                    mutateImageData={mutateImageData}
                    key={`post-card-${value._id}`} // Add a unique key prop
                    value={value}
                    session={session}
                    allUsers={allUsers}
                    time={DateFormatted(date)}
                  />
                );
              })
            ) : (
              <>
                {!isLoadingInitialData && (
                  <NoCardsMessage
                    MessageRectIcon={IoImage}
                    addition={"addition"}
                    ContentAddition={"ContentAddition"}
                    MessageContent={`No posts yet. Stay tuned for updates or be the first in the group to share!`}
                  />
                )}
              </>
            )}

            {isLoadingMore && (
              <div
                className={loaderStyles.loaderCover}
                style={{ height: isLoadingInitialData ? "70vh" : "auto" }}
              >
                <div className={loaderStyles.loader} />
              </div>
            )}

            {postData?.data?.length !== 0 && isReachingEnd && (
              <div className={loaderStyles.ParaCover}>
                <p className={loaderStyles.loaderCoverP}>
                  There are no more posts to display.
                </p>
              </div>
            )}

          </div>

          {/* right side card */}
          <div className={styles.rightSide}>
            {filteredfollowers?.length != 0 && (
              <div className={styles.rightCard}>
                <p className={styles.friends}>
                  Your friends are also members of this group.
                </p>

                <div className={styles.friendsImage}>
                  {filteredfollowers?.map((value, index) => (
                    <div className={styles.friendsImageCover} key={value._id}>
                      {value.userid.image && <Image
                        src={value.userid.image}
                        alt="imgCover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          objectFit: "cover",
                        }}
                      />}
                    </div>
                  ))}

                  {filteredfollowers?.length > 4 && (
                    <div className={styles.friendsImageCover}>
                      <BiDotsHorizontalRounded
                        className={styles.friendsImageMore}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            <p
              className={styles.seeMoreFriends}
              onClick={() => setFriendList(true)}
            >
              {groupData?.data?.members.length} members
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  const username = session?.user.username;
  const userid = session?.user.id;
  await connectDb();
  const userData = await User.find();
  const allusers = await User.find({ username: { $ne: username } });

  let followers = await followModel.findOne({ user: userid });
  followers = await User.populate(followers, {
    path: "followers.userid following.userid",
    select: " image ",
  });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { isNewUser } = session?.user;
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
      userData: JSON.parse(JSON.stringify(userData)),
      followers: JSON.parse(JSON.stringify(followers)),
      allUsers: JSON.parse(JSON.stringify(allusers)),

    },
  };
}

export default GroupsDetails;
