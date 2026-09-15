import Image from "next/image";
import styles from "../../../styles/admin.module.scss";

const Transactions = () => {
  return (
    <div className={styles.containerTransactions}>
      <h2 className={styles.title}>Latest Transactions</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Status</td>
            <td>Date</td>
            <td>Amount</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className={styles.user}>
                <div className={styles.userImage} >
                  <Image
                    src="/noavatar.png"
                    alt=""
                     fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     style={{
                  objectFit: "cover"
                }}
                    className={styles.userImage}
                  />
                </div>
                John Doe
              </div>
            </td>
            <td>
              <span className={`${styles.status} ${styles.pending}`}>
                Pending
              </span>
            </td>
            <td>14.02.2024</td>
            <td>$3.200</td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                <div className={styles.userImage} >
                  <Image
                    src="/noavatar.png"
                    alt=""
                     fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     style={{
                  objectFit: "cover"
                }}
                    className={styles.userImage}
                  />
                </div>
                John Doe
              </div>
            </td>
            <td>
              <span className={`${styles.status} ${styles.done}`}>Done</span>
            </td>
            <td>14.02.2024</td>
            <td>$3.200</td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                <div className={styles.userImage} >
                  <Image
                    src="/noavatar.png"
                    alt=""
                     fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     style={{
                  objectFit: "cover"
                }}
                    className={styles.userImage}
                  />
                </div>
                John Doe
              </div>
            </td>
            <td>
              <span className={`${styles.status} ${styles.cancelled}`}>
                Cancelled
              </span>
            </td>
            <td>14.02.2024</td>
            <td>$3.200</td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                <div className={styles.userImage} >
                  <Image
                    src="/noavatar.png"
                    alt=""
                     fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     style={{
                  objectFit: "cover"
                }}
                    className={styles.userImage}
                  />
                </div>
                John Doe
              </div>
            </td>
            <td>
              <span className={`${styles.status} ${styles.pending}`}>
                Pending
              </span>
            </td>
            <td>14.02.2024</td>
            <td>$3.200</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
