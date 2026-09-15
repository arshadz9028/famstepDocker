import axios from "axios";
import useSWR,{mutate} from "swr";

export async function fetchFollowers(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export function useFollowerData(id) {
  const {
    data: followerData,
    mutate: mutateFollowerData,
    error: followerError,
  } = useSWR(`/api/profile/follow/followRandomFetch/?id=${id}`, fetchFollowers);

  return { followerData, mutateFollowerData, followerError };
}

export function getPendingStatus(followerData, session) {
  const pendingReq = followerData?.alldat?.followRequests.filter(
    (user) => user.userid === session?.user?.id
  );
  const pendingStatus = pendingReq?.some((value) => value.IsAccepted);
  
  const pendingValue = pendingReq?.some(
    (value) => value.followStatus === "pending"
  );

  return { pendingStatus, pendingValue };
}

export async function handleFollowRequest(
  followStatus,
  followusername,
  mutateFollowerData
) {
  try {
    const url = `/api/profile/follow/followRequest?userid=${followusername}`;
    if (followStatus === "follow" || followStatus === "pending") {
      await axios.post("/api/profile/follow/followRequest", {
        followusername,
        followStatus: "pending",
      });
      mutateFollowerData();
    } else if (followStatus === "following") {
      await axios.delete(
        `/api/profile/follow/followrequestor/?followusername=${followusername}`
      );
      await axios.delete(url);
      mutateFollowerData();
    }
  } catch (error) {
    console.error(error);
  }
}

export async function handleCloseButton(id) {
  try {
    await axios.put(`/api/user/deleteCard/?id=${id}`);
    mutate(`/api/user/userFetch`);
  } catch (error) {
    console.error(error);
  }
}
