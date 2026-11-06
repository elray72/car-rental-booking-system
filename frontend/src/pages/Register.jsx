import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import Form from '../components/form/Form';

const schema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

const fields = [
  { name: 'name', label: 'Full name', type: 'text', placeholder: 'Name' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Password',
  },
];

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (data, setError) => {
    try {
      const formData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const response = await axiosInstance.post('/api/auth/register', formData);
      login(response.data);
      navigate('/');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong, unable to create account.';
      setError('root', { message: errorMessage });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <Form
        className="mb-4"
        formTitle="Create account"
        fields={fields}
        schema={schema}
        submitLabel="Create account"
        onSubmit={handleSubmit}
      />
      <p className="text-center text-sm">
        Already have an account?{' '}
        <Link className="text-blue-500 hover:underline" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
