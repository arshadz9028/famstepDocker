import styles from "../../styles/adminLogin.module.scss";
import { useFormState } from "react-dom";
// import { authenticate } from "@/app/lib/actions";

const LoginForm = () => {
  // const [state, formAction] = useFormState(authenticate, undefined);

  return (
    <form action={'formAction'} className={styles.form}>
      <h1>Login</h1>
      <input type="text" placeholder="username" name="username" />
      <input type="password" placeholder="password" name="password" />
      <button>Login</button>
      {/* {state && state} */}
    </form>
  );
};

export default LoginForm;
