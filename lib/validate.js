export const forgetValidate = (values) => {
  const errors = {};

  // Validation email
  if (!values.email) {
    errors.email = "Please enter your email or username";
  }
  return errors;
};

export const loginValidate = (values) => {
  const errors = {};

  // Validation email
  if (!values.email) {
    errors.email = "Please enter your email or username";
  }
  if (!values.password) {
    errors.password = "Please enter your password";
  }
  return errors;
};

export const passUpdateValidate = (values) => {
  const errors = {};

  // Validation password
  if (!values.password) {
    errors.password = "Please enter your password";
  } else if (values.password.length < 6) {
    errors.password = "Password must be 6 characters or more";
  }

  if (values.password !== values.cpassword) {
    errors.cpassword = "Passwords don't match.";
  }
  return errors;
};

export const ragisterValidate = (values) => {
  const errors = {};

  // Validation email
  if (!values.email) {
    errors.email = "Please enter your  email";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) &&
    !/^\d{10}$/i.test(values.email)
  ) {
    errors.email = "Please enter your a valid email";
  }

  // Validation email
  if (!values.fullname) {
    errors.fullname = "Please enter your full name";
  } else if (!/^[a-zA-Z'-]+(\s[a-zA-Z'-]+){1,2}$/i.test(values.fullname)) {
    errors.fullname = "Please enter your first and last names";
  }

  // Validation password
  if (!values.password) {
    errors.password = "Please enter your password";
  } else if (values.password.length < 6) {
    errors.password = "Password must be 6 characters or more";
  }

  return errors;
};
export const feedbackValidate = (values) => {
  const errors = {};

  // Validation email

  // Validation email
  if (!values.fullname) {
    errors.fullname = "Please enter your full name";
  } else if (!/^[a-zA-Z'-]+(\s[a-zA-Z'-]+){1,2}$/i.test(values.fullname)) {
    errors.fullname = "Please enter your first and last names";
  }

  return errors;
};

export const contactUsValidate = (values) => {
  const errors = {};

  // Validation email
  if (!values.email) {
    errors.email = "Please enter your  email";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) &&
    !/^\d{10}$/i.test(values.email)
  ) {
    errors.email = "Please enter your a valid phone or email";
  }

  // Validation email
  if (!values.fullname) {
    errors.fullname = "Please enter your full name";
  } else if (!/^[a-zA-Z'-]+(\s[a-zA-Z'-]+){1,2}$/i.test(values.fullname)) {
    errors.fullname = "Please enter your first and last names";
  }

  // Validation password
  if (!values.description) {
    errors.description = "Please enter message";
  }

  return errors;
};

export const registerMoreInfoValidate = (values) => {
  const errors = {};
  if (!values.designation) {
    errors.designation = "Please enter your designation";
  }
  if (values.userHobbies.length == 0) {
    errors.userHobbies = "Please enter your Hobbies";
  }
  if (values.userSkills.length == 0) {
    errors.userSkills = "Please enter your skills";
  }
  if (!values.locationUser) {
    errors.locationUser = "Please enter your location";
  }

  return errors;
};
export const submitProposalValidate = (values) => {
  const errors = {};
  if (!values.title) {
    errors.title = "Please enter your title";
  }
    if (!values.description) {
    errors.description = "Please enter description";
  }
    if (!values.approach) {
    errors.approach = "Please enter your approach";
  }
  
 

  return errors;
};

export const registerLocation = (values) => {
  const errors = {};

  if (!values.country) {
    errors.country = "Please enter your country";
  }
  if (!values.city) {
    errors.city = "Please enter your city";
  }

  return errors;
};
export const registerskills = (values) => {
  const errors = {};
  if (values.skillsOption?.length == 0) {
    errors.skillsOption = "Please ensure you select at least one skill.";
  } else if (
    !/^[a-zA-Z0-9#\+]+([a-zA-Z0-9.\s'-]*[a-zA-Z0-9#\+])?$/.test(values.skillsOption) ||
    /(\s{2,}|\.{2,})/.test(values.skillsOption) ||
    /[,\n]/.test(values.skillsOption) 
  ) {
    errors.skillsOption =
      "Please enter one skill at a time";
  }
  return errors;
};
export const registerHobbies = (values) => {
  const errors = {};

  if (values.hobbyOption.length == 0) {
    errors.hobbyOption = "Please ensure you select at least one hobby.";
  }

  return errors;
};

export const registerDesignation = (values) => {
  const errors = {};

  if (!values.designationOption) {
    errors.designationOption = "Please ensure you select or type designation.";
  }

  return errors;
};
