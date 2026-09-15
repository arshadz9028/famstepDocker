import React from 'react'
import styles from '../../styles/Home.module.scss'
import style1 from '../../styles/Zoomphoto.module.scss'
function PostTag(props) {
    return (
      <div className={styles.post_with_icons} >
          <div className={style1.IconsWidthHeight} >
            <props.icons onClick={props.onClick} style={props.style} className={style1.Inner_IconsWidthHeight} />
          </div>
        <p style={{fontWeight:'600' , fontSize:'1.6rem', marginRight:'.2rem'}}>{props.count}</p>
        <p style={{cursor:'pointer'}} onClick={props.onClick} className={styles.icons_name}>{props.title}</p>
      </div>
    );
  }
  
  export default PostTag;
  
  



