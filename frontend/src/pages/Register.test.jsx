import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import axiosInstance from '../axiosConfig';
import Register from './Register';

const testUser = {
  name: 'Tommy Test',
  email: 'tommy@mailinator.com',
  password: 'password1',
};

jest.mock('../axiosConfig', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockLogin = jest.fn();
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

function renderRegisterPage() {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );
}

async function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/full name/i), {
    target: { value: testUser.name },
  });

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: testUser.email },
  });

  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: testUser.password },
  });
}

describe('Register page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the register page', () => {
    renderRegisterPage();

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
  });

  it('should create account and navigate to booking page on success', async () => {
    const userData = { ...testUser, token: 'token123' };
    axiosInstance.post.mockResolvedValue({ data: userData });
    renderRegisterPage();

    await fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/auth/register', {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      });
    });

    expect(mockLogin).toHaveBeenCalledWith(userData);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should display validation errors for required fields', async () => {
    renderRegisterPage();

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should display validation error for invalid email', async () => {
    renderRegisterPage();

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: testUser.name },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: testUser.password },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('should display an error when the email address is already registered', async () => {
    axiosInstance.post.mockRejectedValue({
      response: {
        status: 400,
        data: { message: 'User already exists' },
      },
    });
    renderRegisterPage();

    await fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/user already exists/i);
    });
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
