/* eslint-disable react-hooks/rules-of-hooks */
import useSWR from "swr";
import axios from "axios";

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
export async function fetchDocA(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching data");
  }
}
export function fetchJoined(collabID) {
  return useSWR(`/api/collab/joinedCollabFetch?collabID=${collabID}`, fetchDocA);
}

// const updateTasks = async (tasks) => {
//   const res = await axios.post(`/api/collab/addTasks`, { tasks });
//   const data = await res.json();
//   return data;
// };
// export { updateTasks };
