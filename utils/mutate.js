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


export function fetchCollabs() {
  return useSWR(`/api/collab/collabFetch`, fetchDoc);
}
