import { useRouter } from "next/router";
import styles from "../../../styles/admin.module.scss";
import Image from "next/image";
import { useState } from "react";
const SingleUserPage =  ({ params,userD }) => {
  const router = useRouter()
  const { id } = router.query;
const [user, setuser] = useState([{username:'faarhan', }])

  return (
    <div className={styles.container_singleUser}>
      <div className={styles.infoContainer}>
        <div className={styles.imgContainer}>
          <Image src={userD?.userD.image} alt=""  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"   style={{
                  objectFit: "contain"
                }} />
        </div>
        {userD?.userD.username}
      </div>
      <div className={styles.formContainer}>
        <form  className={styles.form}>
          <input type="hidden" name="id" value={user.id}/>
          <label>Username</label>
          <input type="text" name="username" placeholder={user.username} value={userD?.userD.username}/>
          <label>Email</label>
          <input type="email" name="email" placeholder={user.email} value={userD?.userD.email}/>
          <label>Phone</label>
          <input type="text" name="phone" placeholder={user.phone} />
          <label>Address</label>
          <textarea type="text" name="address" placeholder={user.address} />
          <label>Is Admin?</label>
          <select name="isAdmin" id="isAdmin">
            <option value={true} selected={userD?.userD.role === 'admin'}>Yes</option>
            <option value={false} selected={userD?.userD.role !== 'admin'}>No</option>
          </select>
          <label>Is Active?</label>
          <select name="isActive" id="isActive">
            <option value={true} selected={userD?.userD.userActive}>Yes</option>
            <option value={false} selected={!userD?.userD.userActive}>No</option>
          </select>
          <button>Update</button>
        </form>
      </div>
    </div>
  );
};

export default SingleUserPage;
