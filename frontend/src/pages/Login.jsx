import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { z } from 'zod';

import axiosInstance from '../axiosConfig';
import Form from '../components/form/Form';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const fields = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Password' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data, setError) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', data);
      login(response.data);
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <Form
        title="Login"
        fields={fields}
        schema={schema}
        submitLabel="Login"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Login;
