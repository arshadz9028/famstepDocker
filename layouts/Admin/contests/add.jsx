import styles from "../../../styles/admin.module.scss";
import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { resizeImage } from "../../../utils/resizeImage";
const AddProductPage = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [level, setlevel] = useState("");
  const [ContestName, setContestName] = useState("");
  const [startTime, setstartTime] = useState("");
  const [endTime, setendTime] = useState("");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [prize, setprize] = useState("");
  const [users, setusers] = useState("");
  const [language, setlanguage] = useState("");
  const [desc, setdesc] = useState("");
  const [about, setAbout] = useState("");
  const [rule, setRule] = useState("");
  const [codeAnswer, setCodeAnswer] = useState("");


  const [checked, setChecked] = useState(false);
  // const [isDataType, setisDataType] = useState("");

  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [input3, setInput3] = useState('')

  const [output1, setOutput1] = useState('')
  const [output2, setOutput2] = useState('')
  const [output3, setOutput3] = useState('')
  

  const handleImageSelect = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file) {
        const maxWidth = 400; // Set the desired maximum width
        const maxHeight = 400; // Set the desired maximum height
        const resizedImage = await resizeImage(file, maxWidth, maxHeight);
  
      // Update the state with the resized image
      setSelectedFile(resizedImage);
      }
    }
  };
  const handleChecked = (event) => {
    setChecked(event.target.checked);
  }; //handle checkbox

  // const handleRadio = (e) => {
  //   setisDataType(e.target.value);
  // };
  const finalImage = selectedFile;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append("image", finalImage);
    form.append("level", level);
    form.append("ContestName", ContestName);
    form.append("startTime", startTime);
    form.append("endTime", endTime);
    form.append("startDate", startDate);
    form.append("endDate", endDate);
    form.append("prize", prize);
    form.append("users", users);
    form.append("language", language);
    form.append("desc", desc);
    form.append("codeAnswer", codeAnswer);
    form.append("about", about);
    form.append("rule", rule);
    form.append("requiredInput", checked);
    // form.append("isDataType", isDataType);
    form.append("input1", input1);
    form.append("input2", input2);
    form.append("input3", input3);
    form.append("output1", output1);
    form.append("output2", output2);
    form.append("output3", output3);

    try {
      await axios.post("/api/code/competition", form);
      // await axios.post("/api/admin/adminAccess");

      // Optionally, you can redirect the user or show a success message
    } catch (error) {
      console.error("Error adding product:", error.message);
      // Handle errors, show an error message to the user, etc.
    }
    router.push(`/dashboard/contests`);
    await axios.put("/api/notification/contestNotification");
    mutate(`/api/code/codeLevel`);
  };
  return (
    <div className={styles.container_addUser}>
      <form className={styles.form_addUser} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Level"
          name="level"
          value={level}
          onChange={(e) => {
            setlevel(e.target.value);
          }}
          //required
        />
        <input
          type="text"
          placeholder="ContestName"
          name="ContestName"
          value={ContestName}
          onChange={(e) => {
            setContestName(e.target.value);
          }}
          //required
        />
        <input
          type="time"
          placeholder="Time 1"
          name="startTime"
          value={startTime}
          onChange={(e) => {
            setstartTime(e.target.value);
          }}
          //required
        />
        <input
          type="date"
          placeholder="Date 1"
          name="startDate"
          value={startDate}
          onChange={(e) => {
            setstartDate(e.target.value);
          }}
          //required
        />
        <input
          type="time"
          placeholder="Time 2"
          name="endTime"
          value={endTime}
          onChange={(e) => {
            setendTime(e.target.value);
          }}
          //required
        />
        <input
          type="date"
          placeholder="Date 2"
          name="endDate"
          value={endDate}
          onChange={(e) => {
            setendDate(e.target.value);
          }}
          //required
        />
        <input
          type="text"
          placeholder="Prize"
          name="prize"
          value={prize}
          onChange={(e) => {
            setprize(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Allowable number of users"
          name="users"
          value={users}
          onChange={(e) => {
            setusers(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Language"
          name="language"
          value={language}
          onChange={(e) => {
            setlanguage(e.target.value);
          }}
        />
        <input
          type="file"
          multiple
          id="image"
          name="image"
          accept="image/*"
          // value={formData.image}
          onChange={handleImageSelect}
        />
        <label>
          <input
            className={styles.check_Answer}
            type="checkbox"
            checked={checked}
            onChange={handleChecked}
          />
          <p className={styles.tagd}>click if input is required</p>
        </label>
        {/* {
          checked && <>
          <label>
            <input
            className={styles.check_Answer}
              type="radio"
              value="String"
              checked={isDataType === "String"}
              onChange={handleRadio}
            />
            <p className={styles.tagd}>String</p>
          </label>
          <label>
            <input
            className={styles.check_Answer}
              type="radio"
              value="Number"
              checked={isDataType === "Number"}
              onChange={handleRadio}
            />
            <p className={styles.tagd}>Number</p>
          </label>
          <label>
            <input
            className={styles.check_Answer}
              type="radio"
              value="Float"
              checked={isDataType === "Float"}
              onChange={handleRadio}
            />
            <p className={styles.tagd}>Float</p>
          </label>
        </>} */}
       {checked && <div className={styles.input_fields}>
          <input
          className={styles.hidden_values}
            type="text"
            placeholder="hidden input 1"
            name="hidden input 1"
            value={input1}
            onChange={(e) => {
              setInput1(e.target.value);
            }}
          />
          <input
          className={styles.hidden_values}
            type="text"
            placeholder="hidden input 2"
            name="hidden input 2"
            value={input2}
            onChange={(e) => {
              setInput2(e.target.value);
            }}
          />
          <input
          className={styles.hidden_values}
            type="text"
            placeholder="hidden input 3"
            name="hidden input 3"
            value={input3}
            onChange={(e) => {
              setInput3(e.target.value);
            }}
          />
         
        </div>}
        {checked && <div className={styles.input_fields}>
          <input
          className={styles.hidden_values}
            type="text"
            placeholder="hidden output 1"
            name="hidden output 1"
            value={output1}
            onChange={(e) => {
              setOutput1(e.target.value);
            }}
          />
          <input
          className={styles.hidden_values}
            type="text"
            placeholder="hidden output 2"
            name="hidden output 2"
            value={output2}
            onChange={(e) => {
              setOutput2(e.target.value);
            }}
          />
          <input
          className={styles.hidden_values}
            type="text"
            placeholder="hidden output 3"
            name="hidden output 3"
            value={output3}
            onChange={(e) => {
              setOutput3(e.target.value);
            }}
          />
          
        </div>}
        <textarea
          //required
          name="desc"
          id="desc"
          rows="16"
          placeholder="Question"
          value={desc}
          onChange={(e) => {
            setdesc(e.target.value);
          }}
        ></textarea>
        <textarea
          //required
          name="answer"
          id="answer"
          rows="16"
          placeholder="Output"
          value={codeAnswer}
          onChange={(e) => {
            setCodeAnswer(e.target.value);
          }}
        ></textarea>
        <textarea
          //required
          name="about"
          id="about"
          rows="16"
          placeholder="About"
          value={about}
          onChange={(e) => {
            setAbout(e.target.value);
          }}
        ></textarea>
        <textarea
          //required
          name="rule"
          id="rule"
          rows="16"
          placeholder="Rules"
          value={rule}
          onChange={(e) => {
            setRule(e.target.value);
          }}
        ></textarea>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};
export default AddProductPage;
