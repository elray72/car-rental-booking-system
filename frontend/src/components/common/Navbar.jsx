import { Link, useNavigate } from 'react-router-dom';
import { GiStripedSun } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';

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
        <Link to="/login" className="mr-4">
          Login
        </Link>
        <Link
          to="/register"
          className="inline-block bg-yellow-500 px-4 py-2 rounded text-black font-medium hover:bg-yellow-600 transition-colors"
        >
          Register
        </Link>
      </>
    );
  };

  const renderCustomerMenu = () => {
    return (
      <>
        <Link to="/" className="mr-4">
          Book a car
        </Link>
        <Link to="/profile" className="mr-4">
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="rounded bg-white px-4 py-2 text-black ring-1 ring-inset ring-black hover:bg-gray-100"
        >
          Logout
        </button>
      </>
    );
  };

  const renderAdminMenu = () => {
    return (
      <>
        <Link to="/cars" className="mr-4">
          Cars
        </Link>
        <Link to="/locations" className="mr-4">
          Locations
        </Link>
        <Link to="/profile" className="mr-4">
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="rounded bg-white px-4 py-2 text-black ring-1 ring-inset ring-black hover:bg-gray-100"
        >
          Logout
        </button>
      </>
    );
  };

  const renderStaffMenu = () => {
    return (
      <>
        <Link to="/profile" className="mr-4">
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="rounded bg-white px-4 py-2 text-black ring-1 ring-inset ring-black hover:bg-gray-100"
        >
          Logout
        </button>
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
