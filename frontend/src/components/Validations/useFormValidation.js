import { useState } from "react";

const useFormValidation = (initialValues, validationFunction) => {
  const [fields, setFields] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFields((prev) => ({ ...prev, [id]: value }));
  };

  const handleBlur = (e) => {
    const { id } = e.target;

    const validationErrors = validationFunction(fields);

    setErrors((prev) => ({
      ...prev,
      [id]: validationErrors[id] || "",
    }));
    setFocusedField(null);
  };

  const handleFocus = (e) => {
    const { id } = e.target;
    setFocusedField(id);

    setErrors((prev) => ({ ...prev, [id]: null }));
  };

  return {
    fields,
    errors,
    focusedField,
    handleInputChange,
    handleBlur,
    handleFocus,
  };
};

export default useFormValidation;
