import React, { useState, useEffect } from "react";
import styles from "../../styles/feedback.module.scss";
import Navbar from "../../layouts/NoSessionNavbar";
import { getSession } from "next-auth/react";
import MegaFooter from "../../components/LandingPage/MegaFooter";
import { useFormik } from "formik";
import { feedbackValidate } from "../../lib/validate";
import axios from "axios";
import { message } from "antd";
function Feedback({ session }) {
  const [resError, setResError] = useState("none");
  const [result, setResult] = useState("");
  const [errorOne, setErrorOne] = useState("");
  const [errorTwo, setErrorTwo] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [userDevice, setUserDevice] = useState("");

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    setErrorOne("")
  };
  const usersDevice = (e) => {
    setUserDevice(e.target.value);
    setErrorTwo("")
  };
  useEffect(() => {
    formik.setFieldValue("fullname", session?.user.name);

  }, [session])


  const formik = useFormik({
    initialValues: {
      fullname: "",
      Improvement: "",
      Features: "",
      Thoughts: "",
      additional: "",
      phoneEmail:""

    },
    validate: feedbackValidate,
    onSubmit,
  });

  // api request to server
  async function onSubmit(values) {
    if (!selectedOption) {
       message.info("Please fill the required option!");
      setErrorOne("Please share your overall experience with Famstep.")
      return; // Prevent further execution if validation fails
    } if (!userDevice) {
       message.info("Please fill the required option!");
      setErrorTwo("Please let us know which device you are using to provide your feedback.")
      return; // Prevent further execution if validation fails
    }
    try {
      const response = await axios.post("/api/auth/feedback", {
        values,
        selectedOption,
        userDevice
      });
      if (response.data.success === "success") {
         message.success(
          `Thank you ${values.fullname} for your feedback! Your input is valuable to us`
        );
        formik.setFieldValue("Improvement", "");
        formik.setFieldValue("Features", "");
        formik.setFieldValue("Thoughts", "");
      }
    } catch (error) {
      console.log(error.response.data.error);

      setResult(error.response.data.error);
      formik.resetForm();
      setResError("transparent");
    }
  }
  // removing the error from form after onclick input
  const removeError = () => {
    setResult("");
  };

  return (
    <>
      <Navbar select={"Contact"} session={session} />
      <div className={styles.main}>
        <div className={styles.center}>
          <div className={styles.signup_form_cover}>
            <div className={styles.signup_form}>
              <div>
                <div className={styles.login_title}>
                  <span className={styles.join_famstep}> Feedback Form </span>
                </div>
                {result != "" && (
                  <span className={styles.errorLine}>{result}</span>
                )}
                <form onSubmit={formik.handleSubmit} autoComplete="off">
                  <div className={styles.input_bx}>
                    <span className={styles.label}>
                      Full Name (First & Last Name)
                    </span>
                    <input
                      onClick={removeError}
                      type="text"
                      id="fullname"
                      placeholder="e.g., Farhan khan"
                      name="fullname"
                      required="required"
                      {...formik.getFieldProps("fullname")}
                      style={
                        formik.errors.fullname && formik.touched.fullname
                          ? { outline: "1px solid red" }
                          : null
                      }
                    />

                    {formik.errors.fullname && formik.touched.fullname && (
                      <div className={styles.errorLine}>
                        {formik.errors.fullname}
                      </div>
                    )}
                  </div>

                  <div className={styles.feedback_Button}>
                    <span className={styles.label1}>
                      How would you rate your overall experience with Famstep (1 = Poor, 5 = Excellent)? <i style={{ color: "red", fontSize: "2rem" }}>*</i>
                    </span>

                    <div className={styles.radio_button}>
                      <label
                        className={styles.l_radio}
                        style={{
                          background:
                            selectedOption === "excellent"
                              ? "#F1F0ED"
                              : undefined,
                        }}
                      >
                        <input
                          type="radio"
                          id="f-option"
                          name="selector"
                          value="excellent"
                          checked={selectedOption === "excellent"}
                          onChange={handleChange}
                          className={styles.Input}
                        />
                        <span className={styles.checkmark}>Excellent</span>
                      </label>

                      <label
                        className={styles.l_radio}
                        style={{
                          background:
                            selectedOption === "very-good"
                              ? "#F1F0ED"
                              : undefined,
                        }}
                      >
                        <input
                          type="radio"
                          id="s-option"
                          name="selector"
                          value="very-good"
                          checked={selectedOption === "very-good"}
                          onChange={handleChange}
                          className={styles.Input}
                        />
                        <span className={styles.checkmark}>Very Good</span>
                      </label>

                      <label
                        className={styles.l_radio}
                        style={{
                          background:
                            selectedOption === "good" ? "#F1F0ED" : undefined,
                        }}
                      >
                        <input
                          type="radio"
                          id="t-option"
                          name="selector"
                          value="good"
                          checked={selectedOption === "good"}
                          onChange={handleChange}
                          className={styles.Input}
                        />
                        <span className={styles.checkmark}>Good</span>
                      </label>

                      <label
                        className={styles.l_radio}
                        style={{
                          background:
                            selectedOption === "average"
                              ? "#F1F0ED"
                              : undefined,
                        }}
                      >
                        <input
                          type="radio"
                          id="u-option"
                          name="selector"
                          value="average"
                          checked={selectedOption === "average"}
                          onChange={handleChange}
                          className={styles.Input}
                        />
                        <span className={styles.checkmark}>Average</span>
                      </label>

                      <label
                        className={styles.l_radio}
                        style={{
                          background:
                            selectedOption === "poor" ? "#F1F0ED" : undefined,
                        }}
                      >
                        <input
                          type="radio"
                          id="d-option"
                          name="selector"
                          value="poor"
                          checked={selectedOption === "poor"}
                          onChange={handleChange}
                          className={styles.Input}
                        />
                        <span className={styles.checkmark}>Poor</span>
                      </label>
                    </div>
                    {errorOne != "" && (
                      <span className={styles.errorLine1}>{errorOne}</span>
                    )}
                  </div>
                  <div className={styles.feedback_Button}>
                    <span className={styles.label1}>
                      Which device are you using to access Famstep? <i style={{ color: "red", fontSize: "2rem" }}>*</i>
                    </span>
                    <div className={styles.radio_button}>
                      <label
                        className={styles.l_radio}
                        style={{
                          background:
                            userDevice === "Laptop"
                              ? "#F1F0ED"
                              : undefined,
                        }}
                      >
                        <input
                          type="radio"
                          id="v-option"
                          name="selector1"
                          value="Laptop"
                          checked={userDevice === "Laptop"}
                          onChange={usersDevice}
                          className={styles.Input}
                        />
                        <span className={styles.checkmark}>Desktop/Laptop</span>
                      </label>

                      <label
                        className={styles.l_radio}
                        style={{
                          background:
                            userDevice === "Smartphone"
                              ? "#F1F0ED"
                              : undefined,
                        }}
                      >
                        <input
                          type="radio"
                          id="w-option"
                          name="selector1"
                          value="Smartphone"
                          checked={userDevice === "Smartphone"}
                          onChange={usersDevice}
                          className={styles.Input}
                        />
                        <span className={styles.checkmark}>Smartphone</span>
                      </label>

                      <label
                        className={styles.l_radio}
                        style={{
                          background:
                            userDevice === "Tablet" ? "#F1F0ED" : undefined,
                        }}
                      >
                        <input
                          type="radio"
                          id="x-option"
                          name="selector1"
                          value="Tablet"
                          checked={userDevice === "Tablet"}
                          onChange={usersDevice}
                          className={styles.Input}
                        />
                        <span className={styles.checkmark}>Tablet</span>
                      </label>
                    </div>
                    {errorTwo != "" && (
                      <span className={styles.errorLine1}>{errorTwo}</span>
                    )}
                  </div>
                  <div className={styles.inputDesc}>
                    <span className={styles.labelInputDesc}>
                      What features or sections felt unclear or could be improved?
                    </span>
                    <textarea
                      className={styles.textArea}
                      type="text"
                      id="description"
                      name="description"
                      placeholder="What can we improve?"
                      rows={1}
                      {...formik.getFieldProps("Improvement")}
                    />
                  </div>
                  <div className={styles.inputDesc}>
                    <span className={styles.labelInputDesc}>
                      What tools or changes would make Famstep more useful or engaging for you?
                    </span>
                    <textarea
                      className={styles.textArea}
                      type="text"
                      id="description"
                      name="description"
                      placeholder="What features do you need?"
                      rows={1}
                      {...formik.getFieldProps("Features")}
                    />
                  </div>
                  <div className={styles.inputDesc}>
                    <span className={styles.labelInputDesc}>
                      If you could change or add one thing to Famstep, what would it be?
                    </span>
                    <textarea
                      className={styles.textArea}
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Your ideas or changes?"
                      rows={1}
                      {...formik.getFieldProps("Thoughts")}
                    />
                  </div>
                  <div className={styles.inputDesc}>
                    <span className={styles.labelInputDesc}>
                      Other Feedback or Suggestions
                    </span>
                    <textarea
                      className={styles.textArea}
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Share any additional thoughts or feedback you have about Famstep."
                      rows={1}
                      {...formik.getFieldProps("additional")}
                    />
                  </div>
                  <div className={styles.inputDesc}>
                    <span className={styles.labelInputDesc}>
                      Your email or Phone Number (Optional)
                    </span>
                    <input type="text" name="phoneEmail" id="phoneEmail"
                      {...formik.getFieldProps("phoneEmail")}
                    />

                  </div>

                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <MegaFooter />
      </div>
    </>
  );
}
export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
export default Feedback;
