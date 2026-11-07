import { Link, useNavigate } from 'react-router-dom';
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
        <Link to="/register" className="bg-green-500 px-4 py-2 rounded hover:bg-green-700">
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
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-700">
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
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-700">
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
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </>
    );
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
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
