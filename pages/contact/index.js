import React, { useState, useEffect } from "react";
import styles from "../../styles/contactUsPage.module.scss";
import Navbar from "../../layouts/NoSessionNavbar";
import { getSession } from "next-auth/react";
import MegaFooter from "../../components/LandingPage/MegaFooter";
import { useFormik } from "formik";
import { contactUsValidate } from "../../lib/validate";
import axios from "axios";
function ContactPage({session}) {
  const [resError, setResError] = useState("none");
  const [result, setResult] = useState("");
  useEffect(() => {
    formik.setFieldValue("fullname", session?.user.name);
    formik.setFieldValue("email", session?.user.email);
  
  }, [session])
  
  const formik = useFormik({
    initialValues: {
      email: "",
      fullname: "",
      description: "",
    },
    validate: contactUsValidate,
    onSubmit,
  });

  async function onSubmit(values) {

    try {
      const response = await axios.post("/api/auth/contact", {
        values,
      });
      if (response.data.success === "success") {
        alert("message sent");
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
          <div className={styles.contact_directly}>
            <div className={styles.contact_directlyUpper}>
              <p className={styles.also1}>Contact Us</p>
              <p className={styles.also2}>
                At Famstep, we&apos;re always excited to hear from you. Whether
                you have a question, need support or just want to say hello,
                we&apos;re here to help. Fill out the form, and we&apos;ll get
                back to you as soon as possible.
              </p>
            </div>
            <p className={styles.also}>You can also reach us directly at:</p>
            <div className={styles.email}>
              <h2>Email:</h2>
              <p>contact@famstep.com</p>
            </div>
            <div className={styles.email}>
              <h2>Phone:</h2>
              <p>+91 96195 27143</p>
            </div>
          </div>

          <div className={styles.signup_form_cover}>
            <div className={styles.contact_directlyMob}>
              <p className={styles.also1}>Contact Us</p>
              <p className={styles.also2}>
                At Famstep, we&apos;re always excited to hear from you. Whether
                you have a question, need support or just want to say hello,
                we&apos;re here to help. Fill out the below form, and we&apos;ll
                get back to you as soon as possible.
              </p>
            </div>
            <div className={styles.signup_form}>
              <div>
                <div className={styles.login_title}>
                  <span className={styles.join_famstep}> Contact Form </span>
                </div>
                <form onSubmit={formik.handleSubmit} autoComplete="off">
                  {result != "" && (
                    <span className={styles.errorLine}>{result}</span>
                  )}
                  <div className={styles.input_bx}>
                    <input
                      onClick={removeError}
                      type="text"
                      id="fullname"
                      name="fullname"
                      required="required"
                      {...formik.getFieldProps("fullname")}
                      style={
                        formik.errors.fullname && formik.touched.fullname
                          ? { outline: "1px solid red" }
                          : null
                      }
                    />
                    <span className={styles.label}>
                      Full Name (First & Last Name)
                    </span>
                    {formik.errors.fullname && formik.touched.fullname && (
                      <div className={styles.errorLine}>
                        {formik.errors.fullname}
                      </div>
                    )}
                  </div>

                  <div className={styles.input_bx}>
                    <input
                      onClick={removeError}
                      type="text"
                      id="email"
                      name="email"
                      required="required"
                      {...formik.getFieldProps("email")}
                      style={
                        formik.errors.email && formik.touched.email
                          ? { outline: "1px solid red" }
                          : null
                      }
                    />
                    <span className={styles.label}> Email</span>
                    {formik.errors.email && formik.touched.email && (
                      <div className={styles.errorLine}>
                        {formik.errors.email}
                      </div>
                    )}
                  </div>

                  <div className={styles.inputDesc}>
                    <textarea
                      className={`${styles.textArea} ${
                        formik.errors.description && formik.touched.description
                          ? styles.textAreaError
                          : undefined
                      }`}
                      type="text"
                      id="description"
                      name="description"
                      required="required"
                      rows={4}
                      {...formik.getFieldProps("description")}
                    />
                    <span className={styles.labelInputDesc}>Message</span>
                    {formik.errors.description &&
                      formik.touched.description && (
                        <div className={styles.errorLine}>
                          {formik.errors.description}
                        </div>
                      )}
                  </div>

                  <button type="submit">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.megaFooterCover}>
          <MegaFooter />
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  return {
    props: {
      session,
    },
  };
}
export default ContactPage;
