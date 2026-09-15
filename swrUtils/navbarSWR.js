/* eslint-disable react-hooks/rules-of-hooks */
import useSWR from "swr";
import axios from "axios";

export async function fetchSearch(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
export function searchFetchData() {
  return useSWR(`/api/auth/find/checkHistory`, fetchSearch);
}

export async function fetchUserData(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
export function userFetchData() {
  return useSWR(`/api/user/currentUserFetch`, fetchUserData);
}

export async function fetchFollowerData(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
export function userFollowData() {
  return useSWR(`/api/profile/follow/follwerFetch`, fetchFollowerData);
}

export async function fetchDoc(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching data");
    }
  }
  export function fetchProjects() {
    return useSWR(`/api/collab/myCollab`, fetchDoc);
  }
  
  export async function fetchNotif(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching data");
    }
  }
  export function fetchUserProject() {
    return useSWR(`/api/collab/userNotification`, fetchNotif);
  }

const updateCollabNotify = async (tasks) => {
  const res = await axios.post(`/api/collab/addTasks`, { tasks });
  const data = await res.json();
  return data;
};
export { updateCollabNotify };
