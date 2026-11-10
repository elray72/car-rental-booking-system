import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { twMerge } from 'tailwind-merge';

import axiosInstance from '../../axiosConfig';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { authConfig, formatDay } from '../../helpers';
import MyBookingItem from './MyBookingItem';

const BookingChange = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Original booking details
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Change booking details
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [carId, setCarId] = useState('');
  const [changingCar, setChangingCar] = useState(false);
  const [carOptions, setCarOptions] = useState([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosInstance.get(`/api/bookings/${id}`, authConfig(user.token));
        const nextBooking = response.data;
        setBooking(nextBooking);
        setStartDate(formatDay(nextBooking.startDate, 'yyyy-MM-dd'));
        setEndDate(formatDay(nextBooking.endDate, 'yyyy-MM-dd'));
        setCarId(nextBooking.car?._id || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load this booking.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, user.token]);

  // Handle booking changes
  useEffect(() => {
    if (!changingCar || !booking?.car?.location?.code) return undefined;
    if (!startDate || !endDate || endDate < startDate) return undefined;
    let cancelled = false;

    const loadCars = async () => {
      setCarsLoading(true);
      try {
        const response = await axiosInstance.get('/api/cars/available', {
          params: {
            location: booking.car.location.code,
            start: startDate,
            end: endDate,
          },
        });

        const current = booking.car;
        const available = response.data || [];
        const includesCurrent = available.some((car) => car._id === current._id);
        const options = [...(includesCurrent ? available : [current, ...available])].sort(
          (a, b) => a.dailyRate - b.dailyRate,
        );

        if (!cancelled) {
          setCarOptions(options);
        }
      } catch (err) {
        if (!cancelled) {
          setSaveError(err.response?.data?.message || 'Unable to load cars.');
        }
      } finally {
        if (!cancelled) {
          setCarsLoading(false);
        }
      }
    };

    loadCars();
    return () => {
      cancelled = true;
    };
  }, [changingCar, startDate, endDate, booking]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaveLoading(true);
    setSaveError('');

    try {
      const response = await axiosInstance.patch(
        `/api/bookings/${id}`,
        { car: carId, startDate, endDate },
        authConfig(user.token),
      );

      navigate('/booking/confirmation', {
        state: { booking: response.data, showSteps: false },
      });
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Unable to update this booking.');
    } finally {
      setSaveLoading(false);
    }
  };

  const currentCar = booking?.car;
  return (
    <div className="min-h-[70vh] w-full bg-canvas text-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <h1 className="text-2xl font-bold">Change booking</h1>
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
            <MyBookingItem booking={booking} hideActions />
            {booking.status === 'Confirmed' ? (
              <form className="booking-card relative flex-col items-stretch" onSubmit={handleSave}>
                <h2 className="text-lg font-semibold">Change dates or car</h2>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <label className="flex flex-1 flex-col gap-2 text-sm">
                    <span className="font-medium">Pickup date</span>
                    <input
                      className="date-field"
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                    />
                  </label>
                  <label className="flex flex-1 flex-col gap-2 text-sm">
                    <span className="font-medium">Return date</span>
                    <input
                      className="date-field"
                      type="date"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                    />
                  </label>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <label for="car" className="font-medium">
                    Car
                  </label>
                  {changingCar ? (
                    <select
                      id="car"
                      className="field font-normal"
                      value={carId}
                      onChange={(event) => setCarId(event.target.value)}
                      disabled={carsLoading}
                    >
                      {carOptions.map((car) => (
                        <option key={car._id} value={car._id}>
                          {car.make} {car.model}
                          {car.dailyRate != null ? ` · $${car.dailyRate}/day` : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <p>
                        {currentCar?.make} {currentCar?.model}
                      </p>
                      <button
                        type="button"
                        className={twMerge('button-link-secondary w-fit px-2 py-1')}
                        onClick={() => {
                          setCarOptions(currentCar ? [currentCar] : []);
                          setChangingCar(true);
                        }}
                      >
                        Change car
                      </button>
                    </div>
                  )}
                  {changingCar && carsLoading ? <p className="text-muted">Loading cars…</p> : null}
                </div>
                {saveError ? (
                  <p
                    className="rounded border border-danger bg-danger-light p-4 text-danger"
                    role="alert"
                  >
                    {saveError}
                  </p>
                ) : null}
                <div className="flex justify-between">
                  <Link className="button-link-secondary w-fit" to={`/booking/${id}`}>
                    Back
                  </Link>
                  <Button type="submit" className="w-fit" disabled={saveLoading}>
                    {saveLoading ? 'Saving…' : 'Save changes'}
                  </Button>
                </div>
              </form>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default BookingChange;
