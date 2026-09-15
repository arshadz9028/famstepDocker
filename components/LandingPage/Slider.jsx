import React, { useState, useEffect } from "react";
import styles from "../../styles/landingPage.module.scss";
import { people } from "./sliderData";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import Image from "next/image";

const Slider = () => {

 
  return (
    <>
      <div className={styles.fullLength}>
    
        <p>Don't take our word for it, see what the customer is saying</p>
        <div className={styles.fullLengthWrapper}>
          {people.map((person, indexPeople) => {
            const { id, testiImage, testiName, testiTitle, testiQuote } =
              person;
           
            return (
              <div id={styles.articleWrap} key={id}>
                <p className={styles.quoteTxt}>&ldquo; {testiQuote} &ldquo;</p>
                <div className={styles.testimonialWrapper}>
                  <div className={styles.fullLengthTestimonial}>
                    <div className={styles.testimonialImage}>
                      <Image
                        src={testiImage}
                        alt={testiName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className={styles.testimonialName}>
                      <p>{testiName}</p>
                      <p>{testiTitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
       
      </div>
    </>
  );
};

export default Slider;
