import { React, useState } from "react";
import Image from "next/image";
import cap from "../../assets/newIcons/admin.png";
import styles from "../../styles/network.module.scss";
import { useRouter } from "next/router";
import axios from "axios";
import { mutate } from "swr";
import { IoCloseCircleOutline } from "react-icons/io5";

function Network_Grp({ value, memberGroup, adminGroup, mutateuserData }) {
  const [Join, setJoin] = useState(false);
  const grpId = value._id;


  const handleClosebtn = async (e) => {
    e.stopPropagation(); // Prevent card click event
   try {
     await axios.post(`/api/group/deleteNetCard/?grpId=${grpId}`);
     mutateuserData()
    
   } catch (error) {
    console.error(error)
   }
  };

  const router = useRouter();

  const handleJoin =async (e , grpId) => {
    e.stopPropagation()
    setJoin(true)
   try {
    await axios.put('/api/group/joinGroup', {grpId})
    mutateuserData()
   } catch (error) {
    
   }
  }

  return (
    <>
      <section className={styles.Net_grp} 
      onClick={() => router.push(`/network/groups/${value?._id}`)}
      >
        {!memberGroup && !adminGroup && (
          <button
            type="close"
            className={styles.clsBtn}
            onClick={handleClosebtn}
          >
            <IoCloseCircleOutline className={styles.close} />
          </button>
        )}
        <div className={styles.net_above_part}>
          <div className={styles.grp_dp}>
            {value?.image && (
              <Image
                priority
                src={value.image}
                quality={4}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                }}
                alt="group_image"
              />
            )}
          </div>

          <div className={styles.level_designation_cover}>
            <div className={styles.backgroundStrip} />
            <div className={styles.colorStrip} />
            <div className={styles.backgroundStrip} />
          </div>
        </div>

        <div className={styles.grp_detail}>
          <p className={styles.grp_name}>{value?.groupName}</p>
        </div>

        <div className={styles.grp_admin}>
          <div className={styles.cap}>
            <p>Group admin </p>
            <div className={styles.adminCap}>
              <Image
                src={cap}
                alt="cap"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
          <div className={styles.admin_circle}>
            <div>
              <div className={styles.img_circle}>
                {value?.admin?.image && (
                  <Image
                    src={value.admin.image}
                    priority
                    quality={4}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: "cover",
                    }}
                    alt="admin_prof"
                  />
                )}
              </div>
              <div className={styles.admin_name}>
                <p>{value?.admin?.name}</p>
                <p className={styles.username}>{value?.admin?.designation}</p>
              </div>
            </div>
            {!memberGroup && !adminGroup && (
              <div
                className={styles.join_btn}
                onClick={(e) => {
                  handleJoin( e, value?._id );
                }}
              >
                {!Join ? (
                  <input type="button" value="Join" />
                ) : (
                  <input
                    type="button"
                    value="Joined"
                    style={{
                      background: Join ? "#08529B" : undefined,
                      color: Join ? "white" : undefined,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className={styles.member_info}>
          <p>{value?.members?.length} member ...</p>
        </div>

        <div
          className={styles.more_info}
        >
          <p>see more ...</p>
        </div>
      </section>
    </>
  );
}

export default Network_Grp;
