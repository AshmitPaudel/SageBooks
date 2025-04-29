const validateUsername = (username) => {
  return username.length >= 3;
};

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
  return passwordRegex.test(password);
};

const validateForm = (username, email, password) => {
  let errors = {};

  if (!validateUsername(username)) {
    errors.username = "Username must be at least 3 characters long.";
  }

  if (!validateEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!validatePassword(password)) {
    errors.password = "Password must be at least 6 characters long and contain a special character.";
  }

  return errors;
};

export const SignUpValidations = {
  validateUsername,
  validateEmail,
  validatePassword,
  validateForm,
};
