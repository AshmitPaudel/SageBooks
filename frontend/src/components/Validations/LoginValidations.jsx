const validateEmail = (email) => {
  if (!email) {
    return "Email is required.";
  }
  return null;
};

const validatePassword = (password) => {
  if (!password) {
    return "Password is required.";
  }
  return null;
};

const validateForm = (email, password) => {
  let errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

export const Validations = {
  validateEmail,
  validatePassword,
  validateForm,
};
