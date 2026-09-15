import React, { useState, useContext } from "react";
import styles from "../../styles/EditProfile.module.scss";
import ClosePart from "../profileComp/ClosePart";
import { ContextProvider } from "../../global/context";
import axios from "axios";
import Image from "next/image";
import { mutate } from "swr";
import { useRouter } from "next/router";

function ViewProposal({ PropData, setViewProp }) {
  const { selectedColab, setSelectedColab } = useContext(ContextProvider);
  const [rate, setRate] = useState(""); // State for Time required input
  const [skillModal, setSkillModal] = useState(false); // State for Skills modal visibility
  const router = useRouter();

  // Open/close the skills modal
  const toggleSkillsModal = () => setSkillModal(!skillModal);

  // Close modal if clicking outside
  const closeModal = (e) => {
    if (e.target.getAttribute("id") === "main") {
      setViewProp(false);
    }
  };

  const collabID = PropData.collabID
  const reqID = PropData._id
  const handleremove = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(
        `/api/collab/acceptedCollab?collabId=${collabID}&reqId=${reqID}`
      );
    } catch (error) {
      console.error("Error accepting the request:", error);
    }
    mutate(`/api/collab/collabFetch`)
    // mutateImageData();
    setViewProp(false);

  }
  const newSelected = PropData?.userid?._id
  const chatWithSelected = async () => {
    try {
      const res = await axios.post(`/api/message/chat`, { newSelected });
      await router.push(`/message/${res.data._id}`);
      handleChatClick(res.data._id);
      props.setNewmessage(false);
      setToggle(true);
    } catch (error) {
      return <> Failed to load profile page. </>;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Collect all form data
    try {
      await axios.put(
        `/api/collab/acceptedCollab?collabId=${collabID}&reqId=${reqID}`
      );
    } catch (error) {
      console.error("Error accepting the request:", error);
    }
    setViewProp(false);
    mutate(`/api/collab/collabFetch`)
  };
  const [proposals, setProposals] = useState();

  const handleStatusChange = (proposalId, newStatus) => {
    setProposals(prev => prev.map(p =>
      p.id === proposalId ? { ...p, status: newStatus } : p
    ));
  };
  const proposalData = PropData?.proposals[0]
  const handleAttachement = async () => {
    try {
      const res = await fetch(proposalData?.attachProof);
      const arrayBuffer = await res.arrayBuffer();

      // Extract file extension from the URL
      const urlParts = proposalData?.attachProof.split(".");
      const fileExtension =
        urlParts[urlParts.length - 1]?.toLowerCase();

      // Define MIME types for different file types
      const mimeTypes = {
        pdf: "application/pdf",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };

      const mimeType =
        mimeTypes[fileExtension] || "application/octet-stream";
      const fileName = `downloaded_file.${fileExtension}`;

      const file = new File([arrayBuffer], fileName, {
        type: mimeType,
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(file);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }
  const GoToProfile = (id) => {
    router.push(`/profile/${id}`);
  };
  return (
    <>

      <div className={styles.main} id="main" onClick={closeModal}>
        <div className={styles.proposalCard} style={{ height: "auto" }}>
          <ClosePart title="Submitted Proposals" CloseTheModal={setViewProp} />
          <div className={`${styles.proposalCard1} `}>
            <div className={styles.collaboratorHeader}>
              <div className={styles.avatarImg} onClick={() => GoToProfile(PropData?.userid?._id)} >
                <Image
                  src={PropData?.userid?.image}
                  alt={"proposal.collaborator.name"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                />

              </div>
              <div className={styles.collaboratorInfo}>
                <h2>{PropData?.userid?.name}</h2>
                <div className={styles.skillTags}>
                  {proposalData?.skills.map(skill => (
                    <span key={skill?._id} className={styles.tag}>{skill?.skill}</span>
                  ))}

                </div>
                <div className={styles.rating}>
                Level {PropData?.userid?.level}
                </div>
              </div>
            </div>

            <div className={styles.proposalDetails}>
              <div className={styles.proposalSection}>
                <h3 className={styles.sectionTitle}>Collaboration Title</h3>
                <p className={styles.contentText}>{proposalData?.title}</p>
              </div>

              <div className={styles.proposalSection}>
                <h3 className={styles.sectionTitle}>Relevant Experience</h3>
                <p className={styles.contentText}>{proposalData?.coverLetter}</p>
              </div>

              <div className={styles.proposalSection}>
                <h3 className={styles.sectionTitle}>Proposed Approach</h3>
                <p className={styles.contentText}>{proposalData?.approach}</p>
              </div>

              {proposalData?.rate && <div className={styles.compensation}>
                <h3 className={styles.sectionTitle}>Compensation</h3>
                <p className={styles.contentText}>{proposalData?.rate}</p>
              </div>}

              {proposalData?.attachProof && <div className={styles.attachments}>
                <h4 className={styles.sectionTitle} >Attachments:</h4>
                <p onClick={handleAttachement} className={styles.attachmentLink}>attached_doc</p>
              </div>}
            </div>

            <div className={styles.action}>
              {/* <span className={styles.status_indicator}>Status: pending</span> */}
              <button className={`${styles.btn} ${styles.accept_btn}`} onClick={handleSubmit}>Accept Proposal</button>
              <button className={`${styles.btn} ${styles.reject_btn}`} onClick={handleremove}>Reject</button>
              <button className={`${styles.btn} ${styles.message_btn}`} onClick={chatWithSelected}>Message</button>
            </div>
          </div>

          {/* <form className={styles.upperPortion} >
          
            <div className={styles.input_bxButton} style={{ gap: "1rem" }}>
              <button onClick={handleSubmit} type="submit">Accept</button>
              <button onClick={handleremove} type="submit">Reject</button>
            </div>
          </form> */}
        </div>
      </div >
    </>
  );
}

export default ViewProposal;
