import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Validations } from '../components/Validations/LoginValidations';

const useLogin = (role, onLoginSuccess) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = Validations.validateForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (role === 'admin' && window.location.pathname !== '/admin') {
      setApiError('Admins must log in from /admin.');
      return;
    }

    if (role === 'user' && window.location.pathname === '/admin') {
      setApiError('Users cannot log in from the admin page.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/api/login/', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, role: serverRole, user_id } = response.data;

        if (serverRole !== role) {
          setApiError('Invalid login. Please use the correct login page.');
          setLoading(false);
          return;
        }

        login(serverRole, token, user_id);

        localStorage.setItem('token', token);
        localStorage.setItem('role', serverRole);
        localStorage.setItem('user_id', user_id);

        console.log('Login successful:', { token, role: serverRole, user_id });

        onLoginSuccess(serverRole);

      }
    } catch (error) {
      setApiError('Login failed. Please check your credentials.');
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    errors,
    loading,
    apiError,
    handleSubmit,
  };
};

export default useLogin;
