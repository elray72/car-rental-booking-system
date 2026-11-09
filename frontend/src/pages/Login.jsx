import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();

  const from = location.state?.from;
  const notice = location.state?.message;
  const registerState = from
    ? { from, message: 'Create an account to confirm this booking.' }
    : undefined;

  const handleSubmit = async (data, setError) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', data);
      login(response.data);
      navigate(from ? `${from.pathname}${from.search || ''}` : '/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError('root', { message: errorMessage });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      {notice ? (
        <p className="auth-notice" role="status">
          {notice}
        </p>
      ) : null}
      <Form
        className="bg-white p-6 shadow-md rounded mb-4"
        formTitle="Login"
        fields={fields}
        schema={schema}
        submitLabel="Login"
        onSubmit={handleSubmit}
      />
      <p className="text-center text-sm">
        Don't have an account?{' '}
        <Link className="text-blue-500 hover:underline" state={registerState} to="/register">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
