import React, { useState } from "react";
import styles from "../../styles/EditProfile.module.scss";
import ClosePart from "../profileComp/ClosePart";
import SkillsCollab from "../../layouts/collabSkills";
import axios from "axios";
import { Button, Upload, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { submitProposalValidate } from "../../lib/validate";
function SubmitProposal({
  isEditCollab,
  mutateImageData,
  setSubRequest,
  ImageData,
  setIsEditCollab
}) {
  const collbId = ImageData?._id;

  const [selectedColab, setSelectedColab] = useState(
    isEditCollab ? ImageData?.skills?.map((value) => value.skill) : []
  );
  const [skillModal, setSkillModal] = useState(false);
  const [attachProof, setAttachProof] = useState();

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      approach: "",
      rate: "",
    },
    validate: submitProposalValidate,
    onSubmit: async (values) => {
      const submissionData = new FormData();
      submissionData.append("title", values.title);
      submissionData.append("description", values.description);
      submissionData.append("approach", values.approach);
      submissionData.append("rate", values.rate || '');
      submissionData.append("selectedColab", JSON.stringify(selectedColab));

      if (attachProof) {
        submissionData.append("attachProof", attachProof);
      }

      try {
        const response = await axios.put(
          `/api/collab/reqCollab?collabId=${collbId}`,
          submissionData
        );
        setSubRequest(false);
        mutateImageData();
        if (response.status === 200) {
          message.success(`${response.data.message} `);
        }else{

          message.error("Failed to submit proposal. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const toggleSkillsModal = (index) => {
    setIsEditCollab(false)
    if (selectedColab != "") {
      setIsEditCollab(true)
    }
    setSkillModal(!skillModal);
  };
  const closeModal = (e) => {
    if (e.target.getAttribute("id") === "main") {
      setSubRequest(false);
    }
  };

  const handleSkillInputChange = (e) => {
    if (!e?.target?.value) return;
    const skillsArray = e.target.value.split(",").map((skill) => skill.trim());
    setSelectedColab(skillsArray);
  };

  const handleUploadChange = ({ file }) => {
    setAttachProof(file.originFileObj || file);
  };
  return (
    <>
      {skillModal && (
        <SkillsCollab
          setsSelectedColab={setSelectedColab}
          selectedColab={selectedColab}
          ImageData={ImageData}
          isEditCollab={isEditCollab}
          setSkillModal={setSkillModal}
          handleChange={handleSkillInputChange}
          setIsEditCollab={setIsEditCollab}
          collabType={"proposal"}
        />
      )}

      <div className={styles.main} id="main" onClick={closeModal}>
        <div className={styles.fullEdit}>
          <ClosePart
            title="Collaboration Proposal Form"
            CloseTheModal={setSubRequest}
          />

          <form className={styles.upperPortion} onSubmit={formik.handleSubmit}>
            {/* Title Input */}
            <div className={styles.input_bxSub}>
              <span className={styles.labelSubmit}>
                Collaboration Title Applying For:
              </span>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Title"
              />
              {formik.touched.title && formik.errors.title && (
                <div className={styles.error}>{formik.errors.title}</div>
              )}
            </div>

            {/* Skills Input */}
            <div className={styles.input_bxSub} onClick={toggleSkillsModal}>
              <span className={styles.labelSubmit}>Skills</span>
              <input
                type="text"
                id="Role"
                name="Role"
                required
                placeholder="Skills"
                value={selectedColab?.join(", ")}
                readOnly
              />
            </div>

            {/* Relevant Experience Input */}
            <div className={styles.input_bxSub}>
              <span className={styles.labelSubmit}>Relevant Experience:</span>
              <textarea
                className={styles.textAreaSu}
                id="description"
                name="description"
                required
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Describe your background and why you're qualified"
              />
              {formik.touched.description && formik.errors.description && (
                <div className={styles.error}>{formik.errors.description}</div>
              )}
            </div>

            {/* Proposed Approach Input */}
            <div className={styles.input_bxSub}>
              <span className={styles.labelSubmit}>Proposed Approach:</span>
              <textarea
                className={styles.textAreaSu}
                id="approach"
                name="approach"
                required
                rows={4}
                value={formik.values.approach}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Describe how you plan to contribute to the collaboration"
              />
              {formik.touched.approach && formik.errors.approach && (
                <div className={styles.error}>{formik.errors.approach}</div>
              )}
            </div>

            {/* Compensation Input */}
            {ImageData?.collaborationType === 'Paid' && <div className={styles.input_bxSub}>
              <span className={styles.labelSubmit}>Compensation:</span>
              <input
                type="text"
                id="rate"
                name="rate"
                value={formik.values.rate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Expected Rate/Budget"
              />
              {formik.touched.rate && formik.errors.rate && (
                <div className={styles.error}>{formik.errors.rate}</div>
              )}
            </div>}

            {/* File Upload */}
            <div className={styles.input_bxSub1}>
              <label className={styles.labelSubmit}>
                Want to share something extra? (Optional)
              </label>
              <Upload
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => onSuccess("ok"), 0);
                }}
                showUploadList={false}
                onChange={handleUploadChange}
                accept="image/*,application/pdf,.docx,.xlsx"
              >
                <Button>Upload</Button>
              </Upload>
            </div>

            {/* Attached File Display */}
            {attachProof && (
              <div className={styles.input_bxSub1}>
                <p className={styles.attached}>Attached_file</p>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => setAttachProof()}
                />
              </div>
            )}

            {/* Submit Button */}
            <div className={styles.input_bxButton}>
              <button type="submit">Submit Proposal</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SubmitProposal;
