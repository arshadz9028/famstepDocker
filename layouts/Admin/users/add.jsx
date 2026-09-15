import styles from "../../../styles/admin.module.scss";

const AddUserPage = () => {
  return (
    <div className={styles.container_addUser}>
      <form  className={styles.form_addUser}>
        <input type="text" placeholder="Mobile Number or Email" name="email" required />
        <input type="text" placeholder="Full Name (First & Last Name)" name="fullname" required />
        <input type="text" placeholder="Username" name="username" required />
        <input
          type="password"
          placeholder="password"
          name="password"
          required
        />
        <input type="text" placeholder="Current Designation/Aspiring Role" name="designation" />
        <input type="text" placeholder="Current Status" name="currentStatus" />
        <select name="isAdmin" id="isAdmin">
          <option value={false}>
            Is Admin?
          </option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <select name="isActive" id="isActive">
          <option value={true}>
            Is NewUser?
          </option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <textarea
          name="address"
          id="address"
          rows="16"
          placeholder="Address"
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddUserPage;
