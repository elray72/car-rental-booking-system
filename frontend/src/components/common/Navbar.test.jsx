import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import { AuthProvider } from '../../context/AuthContext';
import Navbar from './Navbar';

const testUser = { email: 'tommy@mailinator.com', token: 'token123' };

function renderNavbar() {
  render(
    <MemoryRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('Logout', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should clear the stored user and show the login link', () => {
    localStorage.setItem('user', JSON.stringify(testUser));
    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(localStorage.getItem('user')).toBeNull();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });
});
