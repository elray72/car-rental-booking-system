import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import { AuthProvider } from '../../context/AuthContext';
import Navbar from './Navbar';

const testUser = { email: 'tommy@mailinator.com', token: 'token123', role: 'customer' };

function setUserCookie(user) {
  document.cookie = `userData=${encodeURIComponent(JSON.stringify(user))}; path=/`;
}

function clearUserCookie() {
  document.cookie = 'userData=; max-age=0; path=/';
}

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
    clearUserCookie();
  });

  it('should clear the stored user and show the login link', () => {
    setUserCookie(testUser);
    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(document.cookie).not.toContain('userData=');
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });
});
