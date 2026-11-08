import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Book from './pages/Book';
import Cars from './pages/Cars';
import CarForm from './pages/CarForm';
import Locations from './pages/Locations';
import LocationForm from './pages/LocationForm';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
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

        {/* Staff routes (can also be used by admin) */}
        <Route
          path="/cars"
          element={
            <ProtectedRoute role={['admin', 'staff']}>
              <Cars />
            </ProtectedRoute>
          }
        />
        <Route
          path="/locations"
          element={
            <ProtectedRoute role={['admin', 'staff']}>
              <Locations />
            </ProtectedRoute>
          }
        />

        {/* Admin only routes */}
        <Route
          path="/cars/create"
          element={
            <ProtectedRoute role={['admin']}>
              <CarForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/locations/create"
          element={
            <ProtectedRoute role={['admin']}>
              <LocationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/locations/:id/edit"
          element={
            <ProtectedRoute role={['admin']}>
              <LocationForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
