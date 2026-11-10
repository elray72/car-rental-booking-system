import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';

import axiosInstance from '../../axiosConfig';
import BookingReceipt from './BookingReceipt';
import { useAuth } from '../../context/AuthContext';
import { authConfig } from '../../helpers';

const BookingDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosInstance.get(`/api/bookings/${id}`, authConfig(user.token));
        setBooking(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load this booking.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, user.token]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelLoading(true);
    setCancelError('');
    try {
      const response = await axiosInstance.patch(
        `/api/bookings/${id}/cancel`,
        {},
        authConfig(user.token),
      );
      setBooking(response.data);
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Unable to cancel this booking.');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] w-full bg-canvas text-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <h1 className="text-2xl font-bold">Booking</h1>
        {/* Loading state */}
        {loading ? <BounceLoader size={40} color="grey" /> : null}

        {/* Error state */}
        {!loading && error ? (
          <p className="rounded border border-danger bg-danger-light p-4 text-danger" role="alert">
            {error}
          </p>
        ) : null}

        {/* Booking details */}
        {!loading && booking ? (
          <>
            <BookingReceipt booking={booking} />
            {cancelError ? (
              <p
                className="rounded border border-danger bg-danger-light p-4 text-danger"
                role="alert"
              >
                {cancelError}
              </p>
            ) : null}
            {booking.status === 'Confirmed' ? (
              <button
                type="button"
                className="button-link w-fit"
                onClick={handleCancel}
                disabled={cancelLoading}
              >
                {cancelLoading ? 'Cancelling…' : 'Cancel booking'}
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default BookingDetail;
