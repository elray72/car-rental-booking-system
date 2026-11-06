import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders heading lement', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>,
  );
  const headingElement = screen.getByText(/Sunshine Car Rentals/i);
  expect(headingElement).toBeInTheDocument();
});
