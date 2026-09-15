import styles from "../../styles/adminLogin.module.scss";
import LoginForm from "../../layouts/Admin/loginform";

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <LoginForm/>
    </div>
  );
};

export default LoginPage;
