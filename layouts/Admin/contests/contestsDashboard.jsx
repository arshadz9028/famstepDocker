import React, { useState, useContext, useEffect } from "react";
import Pagination from "../pagination";
import Search from "../search";
import styles from "../../../styles/admin.module.scss";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";
import { format, parse, differenceInMinutes, isValid } from "date-fns";

async function fetchCode(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const ProductsPage = ({ searchParams }) => {
  const {
    data: codeData,
    mutate: mutatecodeData,
    error: UserDataError,
  } = useSWR("/api/code/createContest", fetchCode);

  const [requestSentMap, setRequestSentMap] = useState({});

  // useEffect(() => {
  //   const updateTimer = async (id) => {
  //     const dateNow = new Date();
  //     const formattedDateNow = format(dateNow, "yyyy-MM-dd HH:mm");

  //     const contest = codeData?.subData.find((value) => value._id == id);
  //     if (contest) {
  //       console.log('contest start1')
  //       const contestStartDate = `${contest?.startDate} ${contest?.startTime}`;

  //       const contestEndDate = `${contest?.endDate} ${contest?.endTime}`;

  //       if (formattedDateNow === contestStartDate) {
  //         console.log('contest start 2')
  //         try {
  //           console.log('contest start 3')

  //           await axios.put(`/api/code/competitionStart/?id=${id}`);
  //           mutatecodeData();
  //         } catch (error) {
  //           console.log('contest start else3')
  //           console.error("Error initiating competition start request:", error);
  //         }
  //       } else if (contestEndDate === formattedDateNow && !requestSentMap[id]) {
  //         console.log('contest end 1')

  //         try {
  //           console.log('contest end 2')

  //           await axios.put(`/api/code/codeDuration/?id=${id}`);
  //           setRequestSentMap((prevMap) => ({ ...prevMap, [id]: true }));
  //           mutatecodeData();
  //         } catch (error) {
  //           console.log('contest end else2')

  //           console.error("Error initiating code duration request:", error);
  //         }
  //       }
  //     }
  //   };

  //   // Set up an interval to call updateTimer every second
  //   const intervalId = setInterval(() => {
  //     codeData?.subData.forEach((contest) => {
  //       updateTimer(contest._id);
  //     });
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };

  //   // Clean up the interval when the component unmounts
  // }, [codeData, mutatecodeData, requestSentMap]);

  return (
    <div className={styles.userDashboard_container}>
      <div className={styles.top}>
        <Search placeholder="Search for a product..." />
        <Link href="/dashboard/contests/add">
          <button className={styles.addButton}>Create Contests</button>
        </Link>
      </div>
      <table className={styles.table1}>
        <thead>
          <tr>
            <td>Level</td>
            <td>Start Date and Time</td>
            <td>End Date and Time</td>
            <td>Duration</td>
            <td>Prize</td>
            <td>No Of Winners</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {codeData?.subData
          .sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
          .map((value) => {
            const Sdate = new Date(value?.combinedStart);
            const contestStartDate = isValid(Sdate)
              ? format(Sdate, "yyyy-MM-dd HH:mm")
              : "Invalid Date";
            const Edate = new Date(value?.combinedEnd);
            const contestEndDate = isValid(Edate)
              ? format(Edate, "yyyy-MM-dd HH:mm")
              : "Invalid Date";



            const startDate = parse(
              contestStartDate,
              "yyyy-MM-dd HH:mm",
              new Date()
            );
            const endDate = parse(
              contestEndDate,
              "yyyy-MM-dd HH:mm",
              new Date()
            );
            const differenceInMinutesValue = differenceInMinutes(
              endDate,
              startDate
            );

            return (
              <tr key={value.id}>
                <td>
                  <div className={styles.product}>{value.stage}</div>
                </td>

                <td>{contestStartDate}</td>
                <td>{contestEndDate}</td>
                <td>{differenceInMinutesValue} minutes</td>
                <td>{value.prize}</td>
                <td>{value.rankers.length}</td>

                <td>
                  <div className={styles.buttons}>
                    <Link href={`/dashboard/contests/${value.id}`}>
                      <button className={`${styles.button} ${styles.view}`}>
                        View More
                      </button>
                    </Link>
                    <form>
                      <input type="hidden" name="id" value={value.id} />
                      <button className={`${styles.button} ${styles.delete}`}>
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
};

export default ProductsPage;
