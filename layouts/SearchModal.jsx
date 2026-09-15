import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Navbar.module.scss";
import axios from "axios";
import { mutate } from "swr";

function Modals({
  nameList,
  showError,
  histnameList,
  searchData, setNameList,
  mutatesearchData,
  setSearchinput, setSearch

}) {
  const router = useRouter();
  const searchHistoryRemover = async (searchHistory) => {
    try {
      const url = `/api/auth/deleter/deleteCheckHistory/?id=${searchHistory}`;
      await axios.delete(url);
      mutatesearchData()
      // mutate("/api/search/checkHistory");
      await setNameList(nameList.filter((value) => value._id !== searchHistory))
    } catch (error) {
      console.error(error);
      // Optionally, you can display an error message or perform any other action if deleting the history fails
    }
  };
  const famstepId = '66e4a234016f471b2ea619c6'
  const handleProfileClickHistory = (id) => {
    setSearchinput('')
    setSearch(false);
    if (id === famstepId) {
      router.push(`/profile/famstep`);
    } else {

      router.push(`/profile/${id}`);
    }
  };

  return (
    <>
      <section className={styles.search_modal}>
        {showError == '' ? (
          nameList?.map((searchHistory) => (
            <div className={styles.modal_arr} key={searchHistory._id}  >
              <div
                className={styles.dp_detail}
                role="button"
                tabIndex="0"
                aria-label={`View profile of ${searchHistory?._id}`}
                onClick={() => handleProfileClickHistory(searchHistory._id)}
              >
                <div className={styles.search_dp}>
                  <Image
                    src={searchHistory?.image}
                    // priority
                    fill
                    // unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: "cover"
                    }}
                    quality={55}
                    alt={`Profile picture of ${searchHistory?._id}`}
                  />
                </div>
                <div className={styles.text_btn}>
                  <div className={styles.search_name}>
                    <p>{searchHistory?.name}</p>
                  </div>
                  <div className={styles.search_id}>
                    <p>{searchHistory?.username}</p>
                  </div>
                </div>
              </div>

              {/* CLOSE BUTTON */}
              {histnameList && (
                <div
                  type="button"
                  className={styles.clsBtn}
                  onClick={() => searchHistoryRemover(searchHistory._id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={styles.close}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.searchError}>{showError}</div>
        )}
      </section>
    </>
  );
}

export default Modals;
