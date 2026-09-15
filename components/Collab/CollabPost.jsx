import React, { useState, useContext, useEffect } from "react";
import styles from "../../styles/EditProfile.module.scss";
import ClosePart from "../../components/profileComp/ClosePart";
import SkillsCollab from "../../layouts/collabSkills";
import axios from "axios";
import DesignationModel from "./DesignationModel";
import { ContextProvider } from "../../global/context";

import designationJson from "../../JsonFile/designationJson.json";

function ProjectDialoge({
  collabID,
  ImageData,
  mutateImageData,
  setOpenDetails,
  isEditCollab,
  setIsEditCollab,
}) {
  const [selectedColab, setsSelectedColab] = useState(
    isEditCollab ? ImageData?.skills?.map((value) => value.skill) : []
  );
  const [title, setTitle] = useState(isEditCollab ? ImageData?.title : "");
  const [collaborators, setCollaborators] = useState(
    isEditCollab ? ImageData?.collaborators : ""
  );
  const [rate, setRate] = useState(isEditCollab ? ImageData?.rate : "");
  const [description, setDescription] = useState(
    isEditCollab ? ImageData?.desc : ""
  );
  const [skillModal, setSkillModal] = useState(false);
  const [collabType, setCollabType] = useState(
    isEditCollab ? ImageData?.collaborationType : ""
  );
  const [skillsIndex, setSkillsIndex] = useState();
  const [desigIndex, setdesigIndex] = useState();
  const [durationReq, setDurationReq] = useState(
    isEditCollab ? ImageData?.durationReq : ""
  );
  const [dropdown, setDropdown] = useState(false);
  const [designationModel, setDesignationModel] = useState(false);


  const [inputs, setInputs] = useState(
    isEditCollab && ImageData?.roles
      ? ImageData.roles.map((role) => ({
        role: role.role,
        count: role.count,
        skills: role.skills,
      }))
      : [{ role: "", count: 1, skills: "" }]
  );
  const [selectedDesignation, setSelectedDesignation] = useState(
    isEditCollab && ImageData?.roles ? inputs.map((value) => value.role) : ""
  );

  // Effect to update collaborators and selectedDesignation when inputs change
  useEffect(() => {
    if (isEditCollab) {
      setCollaborators(inputs.length);
      if (inputs.length > 0) {
        setSelectedDesignation(inputs[0].role);
      }
    }
  }, [inputs, isEditCollab]);

  // Handler to add a new input field
  const addInput = () => {
    setInputs([...inputs, { role: "", count: 1, skills: "" }]);
    setSelectedDesignation('')

  };
  // Handler to remove an input field
  const removeInput = (index) => {
    const updatedInputs = inputs.filter((_, i) => i !== index);
    setInputs(updatedInputs);
  };

  // Handler to update input values
  const handleChange = (index, field, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index][field] = value;

    setInputs(updatedInputs);
  };
  const handleDesignationSelect = (index, selectedDesignation) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].role = selectedDesignation; // Update the role with the selected designation
    setInputs(updatedInputs);
  };

  const durationFunc = (e) => {
    setDurationReq(e.target.value);
  };

  const collabTypeFunc = (e) => {
    setCollabType(e.target.value);
  };

  const toggleSkillsModal = (index) => {
    setIsEditCollab(false)
    if (inputs[index]["skills"] != "") {
      setIsEditCollab(true)
    }
    setSkillsIndex(index);
    setSkillModal(!skillModal);
  };

  const closeModal = (e) => {
    if (e.target.getAttribute("id") === "main") {
      setOpenDetails(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const collaboratorChange = (e) => {
    setCollaborators(e.target.value);
  };

  const handleTimeRequiredChange = (e) => {
    setRate(e.target.value);
  };

  const handleRateChange = (e) => {
    setRate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      title,
      roles: inputs,
      rate,
      durationReq,
      collaborationType: collabType,
      description,
    };
    try {
      if (isEditCollab) {
        await axios.put(`/api/collab/addDetails`, { projectData, collabID });
      } else {
        await axios.post(`/api/collab/addDetails`, { projectData });
      }
      mutateImageData();
      setOpenDetails(false);
    } catch (error) {
      console.error(error);
    }
  };

  const titleUpdate = isEditCollab
    ? "Update Details"
    : "Collaboration Details Form";

  return (
    <>
      {designationModel && (
        <DesignationModel
          setDesignationModel={setDesignationModel}
          setSelectedDesignation={setSelectedDesignation}
          selectedDesignation={selectedDesignation}
          handleChange={handleChange}
          desigIndex={desigIndex}
          inputs={inputs}
          isEditCollab={isEditCollab}
          setIsEditCollab={setIsEditCollab}
        />
      )}
      {skillModal && (
        <SkillsCollab
          setsSelectedColab={setsSelectedColab}
          selectedColab={selectedColab}
          ImageData={ImageData}
          isEditCollab={isEditCollab}
          setSkillModal={setSkillModal}
          handleChange={handleChange}
          skillsIndex={skillsIndex}
          inputs={inputs}
          setIsEditCollab={setIsEditCollab}
          collabType={"collab"}
        />
      )}

      <div className={styles.main} id="main" onClick={closeModal}>
        <div className={styles.fullEdit}>
          <ClosePart title={titleUpdate} CloseTheModal={setOpenDetails} />

          <form className={styles.upperPortion} onSubmit={handleSubmit}>
            <div className={styles.input_bx}>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={title}
                onChange={handleTitleChange}
              />
              <span className={styles.label}>Collaboration title</span>
            </div>

            <div className={styles.input_bx}>
              <input
                type="number"
                min="0"
                id="company"
                name="company"
                required
                value={collaborators}
                onChange={collaboratorChange}
              />
              <span className={styles.label}>
                Number of Collaborators Needed:
              </span>
            </div>
            {collaborators > 1 && (
              <div className={styles.addMoreRole}>
                <input
                  type="button"
                  value="Add Role"
                  className={styles.addMoreRoleButt}
                  onClick={addInput}
                />
              </div>
            )}
            {collaborators > 0 &&
              inputs.map((input, index) => (
                <div key={index} className={styles.DeveloperNeed}>
                  {inputs.length > 1 && (
                    <input
                      type="button"
                      value="Remove X"
                      className={styles.removeRoleButt}
                      onClick={() => removeInput(index)}
                    />
                  )}
                  <div className={styles.roleCount}>
                    <div className={styles.input_bx}>
                      <input
                        type="text"
                        value={input?.role}
                        onChange={(e) => {
                          setDesignationModel(true);
                          handleChange(index, "role", e.target.value);
                        }}
                        onClick={() => {
                          setDesignationModel(true);
                          setdesigIndex(index);
                        }}
                        style={{ marginTop: "1rem" }}
                        placeholder="e.g. Frontend Developer"
                      />
                      <span className={styles.labelRole}>Role</span>
                    </div>
                    {/* {dropdown && (
                      <div className={styles.options}>
                        {filteredLanguages.map((option) => {
                          return (
                            <div
                              className={styles.dropdown_item}
                              key={option.id}
                              onClick={() => setDesignationModel(true)}
                            >
                              {option.skill}
                            </div>
                          );
                        })}
                      </div>
                    )} */}
                  </div>
                  <div
                    className={styles.input_bx}
                    onClick={() => {
                      toggleSkillsModal(index);
                    }}
                  >
                    <input type="text" required value={input.skills} />
                    <span className={styles.label}>Skills</span>
                  </div>
                </div>
              ))}

            <div className={styles.feedback_Button}>
              <span className={styles.label1}>Expected Duration:</span>
              <div className={styles.radio_button}>
                <label
                  className={styles.l_radio}
                  style={{
                    background:
                      durationReq === "Less than a week"
                        ? "#F1F0ED"
                        : undefined,
                  }}
                >
                  <input
                    type="radio"
                    id="v-option"
                    name="selector1"
                    value="Less than a week"
                    checked={durationReq === "Less than a week"}
                    onChange={durationFunc}
                    className={styles.Input}
                  />
                  <span
                    className={styles.checkmark}
                    style={{
                      color:
                        durationReq === "Less than a week"
                          ? "#044280"
                          : undefined,
                    }}
                  >
                    Less than a week
                  </span>
                </label>

                <label
                  className={styles.l_radio}
                  style={{
                    background:
                      durationReq === "1-2 weeks" ? "#F1F0ED" : undefined,
                  }}
                >
                  <input
                    type="radio"
                    id="w-option"
                    name="selector1"
                    value="1-2 weeks"
                    checked={durationReq === "1-2 weeks"}
                    onChange={durationFunc}
                    className={styles.Input}
                  />
                  <span
                    className={styles.checkmark}
                    style={{
                      color:
                        durationReq === "1-2 weeks" ? "#044280" : undefined,
                    }}
                  >
                    1-2 weeks
                  </span>
                </label>

                <label
                  className={styles.l_radio}
                  style={{
                    background:
                      durationReq === "1 month" ? "#F1F0ED" : undefined,
                  }}
                >
                  <input
                    type="radio"
                    id="x-option"
                    name="selector1"
                    value="1 month"
                    checked={durationReq === "1 month"}
                    onChange={durationFunc}
                    className={styles.Input}
                  />
                  <span
                    className={styles.checkmark}
                    style={{
                      color: durationReq === "1 month" ? "#044280" : undefined,
                    }}
                  >
                    1 month
                  </span>
                </label>
                <label
                  className={styles.l_radio}
                  style={{
                    background:
                      durationReq === "more than a month"
                        ? "#F1F0ED"
                        : undefined,
                  }}
                >
                  <input
                    type="radio"
                    id="y-option"
                    name="selector1"
                    value="more than a month"
                    checked={durationReq === "more than a month"}
                    onChange={durationFunc}
                    className={styles.Input}
                  />
                  <span
                    className={styles.checkmark}
                    style={{
                      color:
                        durationReq === "more than a month"
                          ? "#044280"
                          : undefined,
                    }}
                  >
                    more than a month
                  </span>
                </label>
              </div>
            </div>

            <div
              className={styles.feedback_Button}
              style={{ marginTop: "1rem" }}
            >
              <span className={styles.label1}>Collaboration Type:</span>
              <div className={styles.radio_button}>
                <label
                  className={styles.l_radio}
                  style={{
                    background: collabType === "Paid" ? "#F1F0ED" : undefined,
                  }}
                >
                  <input
                    type="radio"
                    id="Paid"
                    name="selector"
                    value="Paid"
                    checked={collabType === "Paid"}
                    onChange={collabTypeFunc}
                    className={styles.Input}
                  />
                  <span
                    className={styles.checkmark}
                    style={{
                      color: collabType === "Paid" ? "#044280" : undefined,
                    }}
                  >
                    Paid Collaboration
                  </span>
                </label>

                {collabType !== "Paid" ? (
                  <label
                    className={styles.l_radio}
                    style={{
                      background: collabType === "Free" ? "#F1F0ED" : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      id="Free"
                      name="selector"
                      value="Free"
                      checked={collabType === "Free"}
                      onChange={collabTypeFunc}
                      className={styles.Input}
                    />
                    <span
                      className={styles.checkmark}
                      style={{
                        color: collabType === "Free" ? "#044280" : undefined,
                      }}
                    >
                      Volunteer/Free Collaboration
                    </span>
                  </label>
                ) : (
                  <div
                    className={styles.input_bx}
                    style={{
                      width: "53.5%",
                      position: "relative",
                      marginLeft: "2rem",
                    }}
                  >
                    <input
                      type="number"
                      min="0"
                      id="URL"
                      name="URL"
                      required
                      value={rate}
                      onChange={handleTimeRequiredChange}
                      style={{ marginTop: "0rem", height: " 4.5rem" }}
                    />
                    <span className={styles.labelRate}>
                      Price / hr, &#8377;
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.inputDesc}>
              <textarea
                className={styles.textArea}
                id="description"
                name="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className={styles.labelInputDesc}>
                Describe what you need
              </span>
            </div>

            <div className={styles.input_bxButton}>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProjectDialoge;