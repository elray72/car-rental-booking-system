import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import LocationForm from './pages/LocationForm';
import Locations from './pages/Locations';
import Book from './pages/Book';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Book />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Admin routes */}
        <Route
          path="/locations"
          element={
            <ProtectedRoute role={['admin', 'staff']}>
              <Locations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/locations/create"
          element={
            <ProtectedRoute role="admin">
              <LocationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/locations/:id/edit"
          element={
            <ProtectedRoute role="admin">
              <LocationForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
