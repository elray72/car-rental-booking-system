import { useEffect, useState } from 'react';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';

import axiosInstance from '../axiosConfig';
import { dateRangeDays, formatDay } from '../helpers';
import Button from '../components/common/Button';

const BookingSearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location') || '';
  const start = searchParams.get('start') || '';
  const end = searchParams.get('end') || '';

  const [cars, setCars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError('');

      try {
        const locationsResponse = await axiosInstance.get('/api/locations');
        setLocations(locationsResponse.data);

        const carsResponse = await axiosInstance.get('/api/cars/available', {
          params: { location, start, end },
        });
        const sorted = carsResponse.data.sort((a, b) => a.dailyRate - b.dailyRate);
        setCars(sorted);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || 'Unable to search cars.');
      }

      setLoading(false);
    };

    fetchResults();
  }, [location, start, end]);

  const rentalDays = dateRangeDays(start, end);
  const rentalDaysLabel = `${rentalDays} ${rentalDays === 1 ? 'day' : 'days'}`;
  const selectedLocation = locations.find((l) => l.code === location.toUpperCase());
  const locationLabel = selectedLocation
    ? `${selectedLocation.name} (${selectedLocation.code})`
    : 'Selected location';

  const changeSearch = () => {
    const params = new URLSearchParams({ location, start, end });
    navigate(`/?${params}`);
  };

  return (
    <div className="min-h-[70vh] w-full bg-canvas text-black">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        {/* Search results summary */}
        <div className="booking-card sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1">
              <FiMapPin className="text-accent-strong" />
              {locationLabel}
            </span>
            <span className="text-muted"> - </span>
            <span className="inline-flex items-center gap-1">
              <FiCalendar className="text-accent-strong" />
              {formatDay(start)} – {formatDay(end)}
            </span>
            <span className="text-muted"> - </span>
            <span>{rentalDaysLabel}</span>
          </div>
          <Button variant="secondary" onClick={changeSearch}>
            Change search
          </Button>
        </div>
        {/* Loading state */}
        {loading ? <BounceLoader size={40} color="grey" /> : null}

        {/* Error state */}
        {!loading && error ? (
          <p className="rounded border border-danger bg-danger-light p-4 text-danger" role="alert">
            {error}
          </p>
        ) : null}

        {/* Cars available heading */}
        {!loading && !error && cars.length > 0 ? (
          <h1 className="text-xl font-semibold">
            {cars.length} {cars.length === 1 ? 'car' : 'cars'} available
          </h1>
        ) : null}

        {/* No cars available */}
        {!loading && !error && cars.length === 0 ? (
          <article className="booking-card flex-col items-center p-8 text-center">
            <h2 className="text-xl font-semibold m-2">No cars available for these dates</h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              All cars at {locationLabel} are booked for {formatDay(start)} – {formatDay(end)}. Try
              different dates or another depot.
            </p>
            <Button className="mt-6" variant="secondary" onClick={changeSearch}>
              Change search
            </Button>
          </article>
        ) : null}

        {/* Cars available list */}
        {!loading && !error && cars.length > 0 ? (
          <div className="flex flex-col gap-4">
            {cars.map((car) => {
              const tags = (car.tags || []).filter((tag) => tag !== 'featured');
              return (
                <article key={car._id} className="booking-card">
                  <div className="card-image h-24 sm:w-36">{/* Placeholder */}</div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">
                      {car.make} {car.model}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      <strong>Location:</strong> {car.location?.name} ({car.location?.code})
                    </p>
                    {tags.length > 0 ? (
                      <p className="mt-1 text-sm text-muted">{tags.join(', ')}</p>
                    ) : null}
                  </div>
                  <div className="sm:text-right">
                    <p className="text-lg font-semibold">
                      ${car.dailyRate} <span className="text-sm font-normal text-muted">/ day</span>
                    </p>
                    <p className="text-sm text-muted">
                      Total ${car.dailyRate * rentalDays} for {rentalDaysLabel}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BookingSearchResults;
