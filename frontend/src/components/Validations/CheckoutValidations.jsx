const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name) ? "" : "Full Name must only contain letters.";
};

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email) ? "" : "Enter a valid email address.";
};

const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;  
  return phoneRegex.test(phone) ? "" : "Phone number must be 10 digits numbers.";
};

const validateCity = (city) => {
  const cityRegex = /^[a-zA-Z0-9\s]+$/; 
  return cityRegex.test(city) ? "" : "City can only contain numbers and letters.";
};

const validateAddress = (address) => {
  const addressRegex = /^[a-zA-Z0-9\s,.-]+$/;
  return addressRegex.test(address) ? "" : "Address can only contain valid characters.";
};

const validateLandmark = (landmark) => {
  const landmarkRegex = /^[a-zA-Z0-9\s,.-]*$/;
  return landmarkRegex.test(landmark) ? "" : "Landmark can only contain valid characters.";
};

const validatePaymentMethod = (paymentMethod) => {
  return paymentMethod ? "" : "Select a payment method.";
};

const validateTermsAgreement = (agreeToTerms) => {
  return agreeToTerms ? "" : "You must agree to the Terms and Conditions.";
};


const validateField = (name, value) => {
  switch (name) {
    case 'name': return validateName(value);
    case 'email': return validateEmail(value);
    case 'phone': return validatePhone(value);
    case 'city': return validateCity(value);
    case 'address': return validateAddress(value);
    case 'landmark': return validateLandmark(value);
    case 'paymentMethod': return validatePaymentMethod(value);
    case 'agreeToTerms': return validateTermsAgreement(value);
    default: return '';
  }
};

const validateCheckoutForm = (formData) => {
  return {
    name: validateName(formData.name),
    email: validateEmail(formData.email),
    phone: validatePhone(formData.phone),
    city: validateCity(formData.city),
    address: validateAddress(formData.address),  
    landmark: validateLandmark(formData.landmark),
    paymentMethod: validatePaymentMethod(formData.paymentMethod),
    agreeToTerms: validateTermsAgreement(formData.agreeToTerms),
  };
};


export const CheckoutValidations = {
  validateName,
  validateEmail,
  validatePhone,
  validateCity,
  validateAddress,
  validateLandmark,
  validatePaymentMethod,
  validateTermsAgreement,
  validateField,
  validateCheckoutForm,
};
