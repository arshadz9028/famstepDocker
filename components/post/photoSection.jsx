// import React, {useState, useContext} from "react";
// import styles from "../../styles/Zoomphoto.module.scss";
// import me from "../assets/images/20.jpg";
// import Image from "next/image";
// import { ContextProvider } from "../../global/context";


// export default function PhotoSection() {
//     const {show, setshow, setreply}=useContext(ContextProvider)
//   return (
//     <>
//       <div className={styles.pro_photo}>
//         <Image
//           src={me}
//           alt="pro"
//           width="100%"
//           height="100%"
//            fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//            style={{
                  objectFit: "cover"
                }}
//         />
//       </div>

//       <div className={styles.line}></div>
//       <div  className={styles.scrollNone}>
//       <div
//         className={styles.child_photo}
//         onClick={() => {setshow((show) => !show), setreply(false)}}
//       >
//         <Image
//           src={me}
//           alt="pro"
//           width="100%"
//           height="100%"
//            fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//            style={{
                  objectFit: "cover"
                }}
//         />
//       </div>
      
      
      
//       </div>
//     </>
//   );
// }
