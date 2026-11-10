import { Link, useNavigate } from 'react-router-dom';
import { GiStripedSun } from 'react-icons/gi';

import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderPublicMenu = () => {
    return (
      <>
        <Link to="/login" className="nav-link mr-4">
          Login
        </Link>
        <Link to="/register" className="inline-block button-link">
          Register
        </Link>
      </>
    );
  };

  const renderCustomerMenu = () => {
    return (
      <>
        <Link to="/" className="nav-link mr-4">
          Book a car
        </Link>
        <Link to="/bookings" className="nav-link mr-4">
          My bookings
        </Link>
        <Link to="/profile" className="nav-link mr-4">
          Profile
        </Link>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </>
    );
  };

  const renderAdminMenu = () => {
    return (
      <>
        <Link to="/bookings" className="nav-link mr-4">
          My bookings
        </Link>
        <Link to="/cars" className="nav-link mr-4">
          Cars
        </Link>
        <Link to="/locations" className="nav-link mr-4">
          Locations
        </Link>
        <Link to="/profile" className="nav-link mr-4">
          Profile
        </Link>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </>
    );
  };

  const renderStaffMenu = () => {
    return (
      <>
        <Link to="/bookings" className="nav-link mr-4">
          My bookings
        </Link>
        <Link to="/profile" className="nav-link mr-4">
          Profile
        </Link>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </>
    );
  };

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white p-4 text-black">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-black">
        <div className="p-1 rounded bg-yellow-500">
          <GiStripedSun className="h-6 w-6 text-black" />
        </div>
        Sunshine Car Rentals
      </Link>
      <div>
        {!user ? renderPublicMenu() : null}
        {user && user.role === 'customer' ? renderCustomerMenu() : null}
        {user && user.role === 'admin' ? renderAdminMenu() : null}
        {user && user.role === 'staff' ? renderStaffMenu() : null}
      </div>
    </nav>
  );
};

export default Navbar;
