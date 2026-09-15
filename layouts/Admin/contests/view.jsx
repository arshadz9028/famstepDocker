import { useRouter } from "next/router";
import styles from "../../../styles/admin.module.scss";
import Image from "next/image";
import { useState } from "react";

const SingleProductPage = ({ params }) => {
  const router = useRouter()
  const { id } = router.query;
  const [contests, setuser] = useState([{ username: 'faarhan', }])


  return (
    <div className={styles.container_contestView}>

      <div className={styles.formContainer}>
        <div className={styles.contest_form}>
          {/* <input type="hidden" name="id" value={contests.id} /> */}
          <div className={styles.viewInput}>
            <label>Level : </label>
            <p className={styles.winnersDetails}>{'1'}</p>
          </div>

          <div className={styles.viewInput}>
            <label>Start Date and Time :</label>
            <p className={styles.winnersDetails}>{'2.00 PM 02/11/2023 '}</p>
          </div>

          <div className={styles.viewInput}>
            <label>End  Date and Time :</label>
            <p className={styles.winnersDetails}>{'3.00 PM 02/11/2023'}</p>
          </div>

          <div className={styles.viewInput}>
            <label>Price :</label>
            <p className={styles.winnersDetails}>{'1000'}</p>
          </div>

          <div className={styles.viewWinner_image}>
            <label>Question :</label>
            <p className={styles.winnersQuestion}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, nulla laudantium. Odio, provident minima. Molestiae eligendi facilis dolores, vitae ut soluta iusto neque quod corporis?</p>
          </div>

          <div className={styles.viewWinner_image}>
            <label>Winners :</label>
            <div className={styles.image_cover}>
              <div className={styles.image_frame}>
                <div className={styles.winnersImage}>
                  <Image src={"/noavatar.png"} alt=""  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  style={{
                  objectFit: "cover"
                }} />
                </div>
                <p>user  Name</p>
              </div>

              <div className={styles.image_frame}>
                <div className={styles.winnersImage}>
                  <Image src={"/noavatar.png"} alt=""  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  style={{
                  objectFit: "cover"
                }} />
                </div>
                <p>user Name</p>
              </div>
              <div className={styles.image_frame}>
                <div className={styles.winnersImage}>
                  <Image src={"/noavatar.png"} alt=""  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  style={{
                  objectFit: "cover"
                }} />
                </div>
                <p>user Name</p>
              </div>

              <div className={styles.image_frame}>
                <div className={styles.winnersImage}>
                  <Image src={"/noavatar.png"} alt=""  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  style={{
                  objectFit: "cover"
                }} />
                </div>
                <p>user Name</p>
              </div>
              <div className={styles.image_frame}>
                <div className={styles.winnersImage}>
                  <Image src={"/noavatar.png"} alt=""  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  style={{
                  objectFit: "cover"
                }} />
                </div>
                <p>user Name</p>
              </div>

              <div className={styles.image_frame}>
                <div className={styles.winnersImage}>
                  <Image src={"/noavatar.png"} alt=""  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  style={{
                  objectFit: "cover"
                }} />
                </div>
                <p>user Name</p>
              </div>

              <div className={styles.image_frame}>
                <div className={styles.winnersImage}>
                  <Image src={"/noavatar.png"} alt=""  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  style={{
                  objectFit: "cover"
                }} />
                </div>
                <p>user Name</p>
              </div>

              <div className={styles.image_frame}>
                <div className={styles.winnersImage}>
                  <Image src={"/noavatar.png"} alt=""  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  style={{
                  objectFit: "cover"
                }} />
                </div>
                <p>user Name</p>
              </div>



            </div>
          </div>

          <button>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
