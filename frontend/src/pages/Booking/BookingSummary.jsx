import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';

import axiosInstance from '../../axiosConfig';
import BookingSteps from './BookingSteps';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { authConfig, dateRangeDays, formatDay } from '../../helpers';

const BookingSummary = () => {
  const { user } = useAuth();
  const locationState = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const carId = searchParams.get('car') || '';
  const location = searchParams.get('location') || '';
  const start = searchParams.get('start') || '';
  const end = searchParams.get('end') || '';

  const [car, setCar] = useState(null);
  const [conflict, setConflict] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      setError('');
      setConflict('');

      try {
        const response = await axiosInstance.get('/api/cars/available', {
          params: { location, start, end },
        });
        const selectedCar = response.data.find((item) => item._id === carId);
        if (!selectedCar) {
          setCar(null);
          setConflict('This car is not available for the selected dates');
        } else {
          setCar(selectedCar);
        }
      } catch (err) {
        setCar(null);
        setError(err.response?.data?.message || 'Unable to load this car.');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId, location, start, end]);

  const days = dateRangeDays(start, end);
  const dayLabel = `${days} ${days === 1 ? 'day' : 'days'}`;
  const searchPath = `/booking/search?${new URLSearchParams({ location, start, end })}`;

  const backToResults = () => {
    navigate(searchPath);
  };

  const signInToConfirm = () => {
    navigate('/login', {
      state: {
        from: locationState,
        message: 'Sign in to confirm this booking.',
      },
    });
  };

  const createAccount = () => {
    navigate('/register', {
      state: {
        from: locationState,
        message: 'Create an account to confirm this booking.',
      },
    });
  };

  const confirmBooking = async () => {
    if (!user?.token) {
      signInToConfirm();
      return;
    }
    setSaving(true);
    setConflict('');

    try {
      const response = await axiosInstance.post(
        '/api/bookings',
        { car: carId, startDate: start, endDate: end },
        authConfig(user.token),
      );
      navigate('/booking/confirmation', { state: { booking: response.data } });
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to confirm this booking.';
      if (err.response?.status === 409) {
        setConflict(message);
      } else if (err.response?.status === 401) {
        signInToConfirm();
      } else {
        setError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[70vh] w-full bg-canvas text-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <BookingSteps className="mx-auto" current={3} />
        <div>
          <h1 className="text-2xl font-bold">Confirm your booking</h1>
        </div>

        {/* Loading state */}
        {loading ? <BounceLoader size={40} color="grey" /> : null}

        {/* Error state */}
        {!loading && error ? (
          <p className="rounded border border-danger bg-danger-light p-4 text-danger" role="alert">
            {error}
          </p>
        ) : null}

        {/* Car details */}
        {!loading && car ? (
          <article className="booking-card flex-col items-stretch sm:items-stretch">
            <h2 className="font-semibold">Booking summary</h2>
            <div className="flex items-center gap-4">
              <div className="card-image h-20 w-32" />
              <div>
                <p className="font-semibold">
                  {car.make} {car.model}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {car.year}, {car.tags.join(', ')}
                </p>
              </div>
            </div>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex justify-between gap-4">
                <div className="text-muted">Location</div>
                <div>
                  {car?.location?.name} ({car?.location?.code})
                </div>
              </li>
              <li className="flex justify-between gap-4">
                <div className="text-muted">Pickup date</div>
                <div>{formatDay(start)}</div>
              </li>
              <li className="flex justify-between gap-4">
                <div className="text-muted">Return date</div>
                <div>{formatDay(end)}</div>
              </li>
              <li className="flex justify-between gap-4">
                <div className="text-muted">Daily rate</div>
                <div>
                  ${car.dailyRate} x {dayLabel}
                </div>
              </li>
              <li className="row-total text-base">
                <div>Total</div>
                <div>${(car?.dailyRate || 0) * days}</div>
              </li>
            </ul>
          </article>
        ) : null}

        {/* Payment information */}
        {!loading && !error && car ? (
          <p className="rounded border border-warning bg-warning-light p-4 text-sm text-warning">
            Pay on pickup. Return the car to the same location.
          </p>
        ) : null}

        {/* Conflict state */}
        {!loading && conflict ? (
          <div className="flex flex-col gap-4">
            <p
              className="rounded border border-danger bg-danger-light p-4 text-danger"
              role="alert"
            >
              {conflict}
            </p>
            <Button variant="secondary" onClick={backToResults}>
              Back to search
            </Button>
          </div>
        ) : null}

        {/* Confirmation actions */}
        {!loading && !error && !conflict ? (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button variant="secondary" onClick={backToResults}>
              Back to results
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              {user?.token ? null : (
                <Button variant="secondary" onClick={createAccount} disabled={!car}>
                  Create an account
                </Button>
              )}
              <Button
                onClick={user?.token ? confirmBooking : signInToConfirm}
                disabled={saving || !car}
              >
                {saving ? 'Confirming…' : user?.token ? 'Confirm booking' : 'Sign in to confirm'}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BookingSummary;
