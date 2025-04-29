const AccountValidation = {
  validateAccountForm: (fields, initialFields = {}) => {
    let errors = {};

    // Validate username 
    if (fields.username !== initialFields.username) {
      if (fields.username?.trim() && fields.username.trim().length < 3) {
        errors.username = "Username must be at least 3 characters long.";
      }
    }

    // Validate email 
    if (fields.email !== initialFields.email) {
      if (
        fields.email?.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)
      ) {
        errors.email = "Please enter a valid email address.";
      }
    }

    // Validate phone number 
    if (fields.phone !== initialFields.phone) {
      if (fields.phone?.trim() && !/^\d{10}$/.test(fields.phone)) {
        errors.phone = "Phone number must be 10 digits long.";
      }
    }

    // Validatte password 
    if (fields.newPassword !== initialFields.newPassword) {
      if (fields.newPassword?.trim()) {
        if (fields.newPassword.length < 6) {
          errors.newPassword =
            "New password must be at least 6 characters long.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(fields.newPassword)) {
          errors.newPassword =
            "New password must include at least one special character (!@#$%^&* etc.).";
        }
      }
    }

    // Validate confirm password 
    if (fields.newPassword !== initialFields.newPassword) {
      if (!fields.confirmPassword || fields.confirmPassword.trim() === "") {
        errors.confirmPassword =
          "Confirm password is required when updating the new password.";
      } else if (fields.confirmPassword !== fields.newPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    // Validate profile image 
    if (
      fields.profileImage &&
      fields.profileImage !== initialFields.profileImage
    ) {
      if (!fields.profileImage.type.startsWith("image/")) {
        errors.profileImage = "Only image files are allowed.";
      }
    }

    return errors;
  },
};

export default AccountValidation;
