import React, { useState } from "react";
import ProjectIcon from "../assets/newIcons/innovation.png";
import styles from "../styles/aboutprofile.module.scss";
import Image from "next/image";
import Link from "next/link";
import { HiOutlinePlusSm } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import ProjectDialoge from "../layouts/models/ProjectDialoge";
import { useRouter } from "next/router";
import AboutDialoge from "../layouts/models/AboutDialoge";

function ProjectsProfile({ userAbout, mutateuserFetchData, userId }) {
  const [readmore, setReadmore] = useState(
    Array(userAbout?.project.length).fill(false)
  );

  const [addProj, setAddProj] = useState(false);
  const [editEdu, setEditEdu] = useState(false);
  const [editSocial, setEditSocial] = useState(false);
  /* this action for handling edit and delete action on experience tab */
  const [proAction, setproAction] = useState(false);
  const [controlEdit, setcontrolEdit] = useState(false);
  const [projId, setprojId] = useState();
  /* this action for handling edit and delete action on education tab */
  const [eduId, seteduId] = useState();
  const router = useRouter();
  const { profile } = router.query;

  const handleProjects = async () => {
    setAddProj(!addProj);
    setcontrolEdit(false);
  };
  const toggleReadMore = (index) => {
    const newReadmore = [...readmore];
    newReadmore[index] = !newReadmore[index];
    setReadmore(newReadmore);
  };
  return (
    <>
      <AboutDialoge
        proAction={proAction}
        setproAction={setproAction}
        setAddProj={setAddProj}
        addProj={addProj}
        projId={projId}
        mutateuserFetchData={mutateuserFetchData}
        eduId={eduId}
        setEditEdu={setEditEdu}
      />

      <ProjectDialoge
        setAddProj={setAddProj}
        addProj={addProj}
        projId={projId}
        controlEdit={controlEdit}
        userAbout={userAbout}
        mutateuserFetchData={mutateuserFetchData}
      />

      <div className={styles.about_layout}>
        {(!profile || userAbout?.project?.length > 0) && (
          <div className={styles.about}>
            <div className={styles.heading} style={{paddingBottom : userAbout?.project?.length > 0? "1rem" : "0rem"}}>
              <h3>Projects</h3>
              {profile ? (
                <></>
              ) : (
                <HiOutlinePlusSm
                  onClick={handleProjects}
                  className={styles.edit}
                />
              )}
            </div>

            {userAbout?.project.map((exp, index) => {
              return (
                <div className={styles.about_content} key={index}>
                  <div className={styles.logoProject}>
                    <Image
                      alt="award"
                      src={ProjectIcon}
                      priority
                       style={{
                  objectFit: "cover"
                }}
                       fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className={styles.content_text}>
                    <div className={styles.content_textCover} >
                      <h4>{exp.name}</h4>
                      {profile ? (
                      <></>
                    ) : (
                      <BsThreeDots
                        onClick={(e) => {
                          setproAction(!proAction);
                          setprojId(exp._id);
                          setcontrolEdit(true);
                        }}
                        className={styles.editOn}
                      />
                    )}
                    </div>

                      <div className={styles.content_details}>
                        <div className={styles.sharp}>{exp.tech}</div>
                        <div className={styles.sharp}>{exp.url}</div>
                        {`${exp.joinMonth} ${exp.joinYear} - ${
                          exp.ongoing === true
                            ? "Present"
                            : `${exp.endMonth} ${exp.endYear}`
                        } `}
                      </div>

                    {exp.description && (
                      <div className={styles.descriptionWrap}  key={index} >
                        <pre
                          className={
                            readmore[index] ? styles.visible : styles.hidden
                          }
                        >
                          {exp.description}
                        </pre>
                        <button
                          className={styles.seeMore}
                          onClick={() => toggleReadMore(index)}
                        >
                          {readmore[index] ? "read less..." : "read more..."}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default ProjectsProfile;
