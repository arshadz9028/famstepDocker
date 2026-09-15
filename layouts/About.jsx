import React, { useState, useEffect } from "react";
import facebook from "../assets/icons/facebook.png";
import linkedin from "../assets/icons/linkedin.png";
import github from "../assets/icons/github.png";
import instagram from "../assets/icons/instagram.png";
import twitter from "../assets/icons/twitter.png";
import office from "../assets/icons/office-building.png";
import graduate from "../assets/icons/graduate-cap.png";
import styles from "../styles/aboutprofile.module.scss";
import Image from "next/image";
import Link from "next/link";
import { HiOutlinePlusSm } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import AboutDialoge from "../layouts/models/AboutDialoge";
import EditExperiance from "../layouts/EditExperiance";
import EditEducation from "../layouts/EditEducation";
import EditSocial from "../layouts/EditSocial";
import { useRouter } from "next/router";
import { FaXTwitter } from "react-icons/fa6";

function About({ userAbout, session, mutateuserFetchData }) {
  const [readmoreEdu, setreadmoreEdu] = useState(
    Array(userAbout?.education.length).fill(false)
  );

  const [readmoreExp, setreadmoreExp] = useState(
    Array(userAbout?.experience.length).fill(false)
  );
  const [editExp, setEditExp] = useState(false);
  const [editEdu, setEditEdu] = useState(false);
  const [editSocial, setEditSocial] = useState(false);

  /* this action for handling edit and delete action on experience tab */
  const [expAction, setexpAction] = useState(false);
  const [controlEdit, setcontrolEdit] = useState(false);
  const [expId, setexpId] = useState();
  /* this action for handling edit and delete action on education tab */
  const [EduAction, setEduAction] = useState(false);
  const [controlEdu, setcontrolEdu] = useState(false);
  const [eduId, seteduId] = useState();
  const router = useRouter();
  const { profile } = router.query;

  const handleExpernce = async () => {
    setEditExp(!editExp);
    setcontrolEdit(false);
  };
  const handleEducation = async () => {
    setEditEdu(!editEdu);
    setcontrolEdu(false);
  };
  const handleSocial = async () => {
    setEditSocial(!editSocial);
  };

  useEffect(() => {
    // Prevent BODY from scrolling when a modal is opened
    if (editExp || editEdu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
  }, [editExp, editEdu]);
  const experienceReadMore = (index) => {
    const newReadmore = [...readmoreExp];
    newReadmore[index] = !newReadmore[index];
    setreadmoreExp(newReadmore);
  };
  const educationReadMore = (index) => {
    const newReadmore = [...readmoreEdu];
    newReadmore[index] = !newReadmore[index];
    setreadmoreEdu(newReadmore);
  };

  const hasSocialLinks =
  userAbout?.social?.facebook ||
  userAbout?.social?.linkedin ||
  userAbout?.social?.Instagram ||
  userAbout?.social?.github;

  return (
    <>
      {editExp && (
        <EditExperiance
          setEditExp={setEditExp}
          userAbout={userAbout}
          controlEdit={controlEdit}
          expId={expId}
          mutateuserFetchData={mutateuserFetchData}
        />
      )}

      {editEdu && (
        <EditEducation
          setEditEdu={setEditEdu}
          userAbout={userAbout}
          controlEdu={controlEdu}
          eduId={eduId}
          mutateuserFetchData={mutateuserFetchData}
        />
      )}

      <EditSocial
        setEditSocial={setEditSocial}
        editSocial={editSocial}
        userAbout={userAbout}
        mutateuserFetchData={mutateuserFetchData}
      />
      <AboutDialoge
        expAction={expAction}
        setexpAction={setexpAction}
        setEditExp={setEditExp}
        expId={expId}
        mutateuserFetchData={mutateuserFetchData}
        EduAction={EduAction}
        setEduAction={setEduAction}
        setEditEdu={setEditEdu}
        eduId={eduId}
      />
      <div className={styles.about_layout}>
        {(!profile || userAbout?.experience?.length > 0) && (
          <div className={styles.about}>
            <div
              className={styles.heading}
              style={{
                paddingBottom:
                  userAbout?.experience?.length > 0 ? "1rem" : "0rem",
              }}
            >
              <h3>Experience</h3>
              {profile ? (
                <></>
              ) : (
                <HiOutlinePlusSm
                  onClick={handleExpernce}
                  className={styles.edit}
                />
              )}
            </div>

            {userAbout?.experience
              .sort((a, b) => {
                if (b.joinYear - a.joinYear !== 0) {
                  return b.joinYear - a.joinYear;
                }
                const months = [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ];
                return (
                  months.indexOf(b.joinMonth) - months.indexOf(a.joinMonth)
                );
              })
              .map((exp, index) => {
                return (
                  <div className={styles.about_content} key={index}>
                    <div className={styles.logoProject}>
                      <Image
                        alt="award"
                        src={office}
                        priority
                         style={{
                  objectFit: "cover"
                }}
                         fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className={styles.content_text}>
                      <div className={styles.content_textCover}>
                        <h4>{exp.company}</h4>
                        {profile ? (
                          <></>
                        ) : (
                          <BsThreeDots
                            onClick={(e) => {
                              setcontrolEdit(true);
                              setexpAction(!expAction);
                              setexpId(exp._id);
                            }}
                            className={styles.editOn}
                          />
                        )}
                      </div>

                      <div className={styles.content_details}>
                        <div className={styles.sharp}>{exp.Role}</div>
                        {`${exp.joinMonth} ${exp.joinYear} - ${
                          exp.working === true
                            ? "Present"
                            : `${exp.endMonth} ${exp.endYear}`
                        } `}
                      </div>
                      {exp.description && (
                        <div className={styles.descriptionWrap} key={index}>
                          <pre
                            className={
                              readmoreExp[index]
                                ? styles.visible
                                : styles.hidden
                            }
                          >
                            {exp.description}
                          </pre>
                          <button
                            className={styles.seeMore}
                            onClick={() => experienceReadMore(index)}
                          >
                            {readmoreExp[index]
                              ? "read less..."
                              : "read more..."}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {(!profile || userAbout?.education.length > 0) && (
          <div className={styles.about}>
            <div
              className={styles.heading}
              style={{
                paddingBottom:
                  userAbout?.education?.length > 0 ? "1rem" : "0rem",
              }}
            >
              <h3>Education</h3>
              {profile ? (
                <></>
              ) : (
                <HiOutlinePlusSm
                  className={styles.edit}
                  onClick={handleEducation}
                />
              )}
            </div>
            {userAbout?.education
              .sort((a, b) => {
                if (b.joinYear - a.joinYear !== 0) {
                  return b.joinYear - a.joinYear;
                }
                const months = [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ];
                return (
                  months.indexOf(b.joinMonth) - months.indexOf(a.joinMonth)
                );
              })
              .map((edu, index) => {
                return (
                  <div className={styles.about_content} key={index}>
                    <div className={styles.logoProject}>
                      <Image
                        alt="award"
                        src={graduate}
                        priority
                         style={{
                  objectFit: "cover"
                }}
                         fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className={styles.content_text}>
                      <div className={styles.content_textCover}>
                        <h4>{edu.university}</h4>
                        {profile ? (
                          <></>
                        ) : (
                          <BsThreeDots
                            onClick={(e) => {
                              setcontrolEdu(true);
                              setEduAction(!EduAction);
                              seteduId(edu._id);
                            }}
                            className={styles.editOn}
                          />
                        )}
                      </div>

                      <div className={styles.content_details}>
                        <div className={styles.sharp}>{edu.college}</div>
                        <div className={styles.sharp}>{edu.course}</div>
                        {`${edu.joinMonth} ${edu.joinYear} - ${
                          edu.studying === true
                            ? "Pursuing"
                            : `${edu.endMonth} ${edu.endYear}`
                        } `}
                      </div>

                      {edu.description && (
                        <div className={styles.descriptionWrap} key={index}>
                          <pre
                            className={
                              readmoreEdu[index]
                                ? styles.visible
                                : styles.hidden
                            }
                          >
                            {edu.description}
                          </pre>
                          <button
                            className={styles.seeMore}
                            onClick={() => educationReadMore(index)}
                          >
                            {readmoreEdu[index]
                              ? "read less..."
                              : "read more..."}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {(!profile || userAbout?.social) && (
          <div className={styles.about}>
            <div
              className={styles.heading}
              style={{ paddingBottom: hasSocialLinks ? "1rem" : "0rem" }}
            >
              <h3>Social Media</h3>
              {profile ? (
                <></>
              ) : (
                <HiOutlinePlusSm
                  onClick={handleSocial}
                  className={styles.edit}
                />
              )}
            </div>
            <div
              className={styles.about_contentSocial}
              style={{
                borderTop: hasSocialLinks ? "1px solid #e6e6e6" : "none",
              }}
            >
              {userAbout?.social?.facebook?.includes("facebook.com") && (
                <div className={styles.logo1}>
                  <Link
                    href={userAbout?.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      alt="award"
                      src={facebook}
                      priority
                       style={{
                  objectFit: "cover"
                }}
                       fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>
                </div>
              )}
              {userAbout?.social?.linkdIn?.includes("linkedin.com") && (
                <Link
                  href={userAbout?.social.linkdIn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className={styles.logo1}>
                    <Image
                      alt="award"
                      src={linkedin}
                      priority
                       style={{
                  objectFit: "cover"
                }}
                       fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>
              )}
              {userAbout?.social?.github?.includes("github.com") && (
                <div className={styles.logo1}>
                  <Link
                    href={userAbout?.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      alt="award"
                      src={github}
                      priority
                       style={{
                  objectFit: "cover"
                }}
                       fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>
                </div>
              )}
              {userAbout?.social?.Instagram?.includes("instagram.com") && (
                <div className={styles.logo1}>
                  <Link
                    href={userAbout?.social.Instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      alt="award"
                      src={instagram}
                      priority
                       style={{
                  objectFit: "cover"
                }}
                       fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>
                </div>
              )}
              {userAbout?.social?.twitter?.includes("x.com") && (
                <div className={styles.logo1}>
                  <Link
                    href={userAbout?.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                   <FaXTwitter  style={{width:"100%", height:"100%"}} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default About;
