import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

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
});
