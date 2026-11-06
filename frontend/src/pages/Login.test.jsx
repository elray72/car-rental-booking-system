import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import axiosInstance from '../axiosConfig';
import Login from './Login';

const testUser = {
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

function renderLoginPage() {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

async function fillLoginForm() {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: testUser.email },
  });

  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: testUser.password },
  });
}

describe('Login page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the login page', () => {
    renderLoginPage();

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute('href', '/register');
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should login and navigate to booking page on success', async () => {
    const userData = { ...testUser, token: 'token123' };
    axiosInstance.post.mockResolvedValue({ data: userData });
    renderLoginPage();

    await fillLoginForm();
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/auth/login', {
        email: testUser.email,
        password: testUser.password,
      });
    });
    expect(mockLogin).toHaveBeenCalledWith(userData);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should display validation errors for required fields', async () => {
    renderLoginPage();

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should display an error when the credentials are invalid', async () => {
    axiosInstance.post.mockRejectedValue({
      response: {
        status: 401,
        data: { message: 'Invalid email or password' },
      },
    });
    renderLoginPage();

    await fillLoginForm();
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/auth/login', {
        email: testUser.email,
        password: testUser.password,
      });
    });
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
