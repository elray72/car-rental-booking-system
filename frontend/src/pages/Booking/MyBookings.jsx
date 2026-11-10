import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';

import axiosInstance from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { authConfig } from '../../helpers';
import MyBookingItem from './MyBookingItem';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get('/api/bookings', authConfig(user.token));
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load your bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user.token]);

  return (
    <div className="min-h-[70vh] w-full bg-canvas text-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <h1 className="text-2xl font-bold">My bookings</h1>

        {/* Loading state */}
        {loading ? <BounceLoader size={40} color="grey" /> : null}

        {/* Error state */}
        {!loading && error ? (
          <p className="rounded border border-danger bg-danger-light p-4 text-danger" role="alert">
            {error}
          </p>
        ) : null}

        {/* No bookings state */}
        {!loading && !error && bookings.length === 0 ? (
          <p className="rounded border border-line bg-surface p-4 text-sm">
            You have no bookings yet.{' '}
            <Link className="font-medium underline" to="/">
              Book a car
            </Link>
          </p>
        ) : null}

        {/* Bookings list */}
        {!loading && !error
          ? bookings.map((booking) => <MyBookingItem key={booking._id} booking={booking} />)
          : null}
      </div>
    </div>
  );
};

export default MyBookings;
