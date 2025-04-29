import React, { useState, useEffect } from "react";
import "./UserAccount.css";
import ImageOverlay from "../../../components/ImageOverlay/ImageOverlay";
import AccountValidation from "../../../components/Validations/AccountValidations";
import { useAuth } from "../../../context/AuthContext";
import useNotificationToast from "../../../components/NotificationToast/NotificationToast";

const AccountPage = () => {
  const { isAuthenticated } = useAuth();
  const placeholderImage = "/images/userplaceholder.jpg";
  const notify = useNotificationToast();

  const [profileImage, setProfileImage] = useState(placeholderImage);
  const [fields, setFields] = useState({
    username: "",
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
    profileImage: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const userId = localStorage.getItem("user_id");
      if (userId) {
        fetch(`http://127.0.0.1:8000/api/manage-users/${userId}/`)
          .then((response) => response.json())
          .then((data) => {
            const profileImageUrl = data.profile_image
              ? `http://127.0.0.1:8000${data.profile_image}`
              : placeholderImage;

            setFields({
              username: data.username,
              email: data.email,
              phone: data.phone_number || "",
              profileImage: null,
            });
            setProfileImage(profileImageUrl);
          })
          .catch(console.error);
      }
    }
  }, [isAuthenticated]);

  const handleInputChange = ({ target: { id, value } }) => {
    setFields((prev) => ({ ...prev, [id]: value }));
  };

  const handleBlur = ({ target: { id } }) => {
    const validationErrors = AccountValidation.validateAccountForm(fields);
    setErrors((prev) => ({
      ...prev,
      [id]: validationErrors[id] || "",
    }));
  };

  const handleFocus = ({ target: { id } }) => {
    setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFields((prev) => ({ ...prev, profileImage: file }));
      setProfileImage(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, profileImage: null }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = AccountValidation.validateAccountForm(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const formData = new FormData();
      formData.append("phone_number", fields.phone);
      formData.append("username", fields.username);
      formData.append("email", fields.email);
      if (fields.newPassword) formData.append("password", fields.newPassword);
      if (fields.profileImage && typeof fields.profileImage !== "string") {
        formData.append("profile_image", fields.profileImage);
      }

      const userId = localStorage.getItem("user_id");
      fetch(`http://127.0.0.1:8000/api/update-user/${userId}/`, {
        method: "PATCH",
        body: formData,
      })
        .then((response) => response.json())
        .then(() => {
          setFields((prev) => ({
            ...prev,
            newPassword: "",
            confirmPassword: "",
          }));

          notify({
            message: "Profile updated successfully!",
            type: "success",
          });
        })
        .catch(() => {});
    }
  };

  return (
    <form className="profile-container" onSubmit={handleSave}>
      <h2 className="account-heading">My Account</h2>
      <div className="account-wrapper">
        <div className="profile-image-container">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-image"
            onClick={() =>
              profileImage !== placeholderImage && setShowOverlay(true)
            }
          />
          <label className="choose-photo">
            Choose Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden-file-input"
            />
          </label>
          {isSubmitted && errors.profileImage && (
            <p className="error-message">{errors.profileImage}</p>
          )}
        </div>

        <div className="user-info">
          {["username", "email", "phone", "newPassword", "confirmPassword"].map(
            (field) => (
              <div className="input-group" key={field}>
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() +
                    field.slice(1).replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field.includes("Password") ? "password" : "text"}
                  id={field}
                  value={fields[field]}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  className={`input-field ${errors[field] ? "error" : ""}`}
                  required={["username", "email"].includes(field)}
                  placeholder={`Enter your ${
                    field.charAt(0).toUpperCase() +
                    field.slice(1).replace(/([A-Z])/g, " $1")
                  }`}
                />
                {errors[field] && (
                  <p className="error-message">{errors[field]}</p>
                )}
              </div>
            )
          )}
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </div>
      </div>

      <ImageOverlay
        showOverlay={showOverlay}
        onClose={() => setShowOverlay(false)}
        imageSrc={profileImage}
      />
    </form>
  );
};

export default AccountPage;
