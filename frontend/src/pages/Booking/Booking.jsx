import { useEffect, useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';

import homeBanner from '../../assets/home-banner.jpg';
import axiosInstance from '../../axiosConfig';
import Button from '../../components/common/Button';
import { showError } from '../../components/common/ErrorToast';

const CAR_LIMIT = 8;

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [locations, setLocations] = useState([]);
  const [cars, setCars] = useState([]);
  const [formError, setFormError] = useState('');
  const [locationCode, setLocationCode] = useState(searchParams.get('location') || '');
  const [pickupDate, setPickupDate] = useState(searchParams.get('start') || '');
  const [returnDate, setReturnDate] = useState(searchParams.get('end') || '');

  const handleSearch = (event) => {
    event.preventDefault();
    if (!locationCode) {
      setFormError('A valid location is required');
      return;
    }

    if (!pickupDate || !returnDate) {
      setFormError('Pickup and return dates are required');
      return;
    }

    if (returnDate < pickupDate) {
      setFormError('Return date must be on or after the pickup date');
      return;
    }

    setFormError('');
    const params = new URLSearchParams({
      location: locationCode,
      start: pickupDate,
      end: returnDate,
    });
    navigate(`/booking/search?${params}`);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosInstance.get('/api/locations');
        setLocations(response.data);
      } catch (err) {
        showError(err.response?.data?.message || 'Unable to load locations.');
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axiosInstance.get('/api/cars/featured');
        setCars(response.data.slice(0, CAR_LIMIT));
      } catch (err) {
        showError(err.response?.data?.message || 'Unable to load cars.');
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Banner */}
      <div
        className="flex h-[60vh] md:h-[60vh] items-center justify-center bg-cover bg-bottom bg-no-repeat px-6"
        style={{ backgroundImage: `url(${homeBanner})` }}
      >
        <form
          className="black-glass mx-auto w-full max-w-4xl p-6 pb-8 md:w-4/5"
          onSubmit={handleSearch}
        >
          <div className="mb-4 flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Find a car</h1>
            <p className="mt-1">Pay on pickup, return to the same location.</p>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex flex-col gap-4 md:flex-row md:items-end lg:flex-1">
              <label className="flex flex-1 flex-col gap-2 text-sm">
                <span className="font-medium">Pickup location</span>
                <select
                  className="field font-normal"
                  value={locationCode}
                  style={{ height: '40px' }}
                  onChange={(event) => setLocationCode(event.target.value)}
                >
                  <option value="">Select a location</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location.code}>
                      {location.name} ({location.code})
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-1 flex-col gap-2 text-sm">
                <span className="font-medium">Pickup date</span>
                <input
                  className="date-field"
                  type="date"
                  value={pickupDate}
                  onChange={(event) => setPickupDate(event.target.value)}
                />
              </label>
              <label className="flex flex-1 flex-col gap-2 text-sm">
                <span className="font-medium">Return date</span>
                <input
                  className="date-field"
                  type="date"
                  value={returnDate}
                  onChange={(event) => setReturnDate(event.target.value)}
                />
              </label>
            </div>
            <div className="flex md:justify-end">
              <Button
                type="submit"
                className="field-focus mt-2 w-full whitespace-nowrap md:mt-0 md:w-auto"
              >
                Search cars
              </Button>
            </div>
          </div>
          {formError ? (
            <p className="mt-4 rounded bg-danger-light p-2 text-sm text-danger" role="alert">
              {formError}
            </p>
          ) : null}
        </form>
      </div>

      {/* Main */}
      <div className="w-full bg-canvas text-black">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:gap-8">
          {/* Locations */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold my-1">Our locations</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {locations.map((location) => (
                <article
                  key={location._id}
                  className="rounded border border-line bg-surface p-4 shadow-md"
                >
                  <h3 className="font-semibold mb-2">
                    <FiMapPin
                      className="mr-1 inline-block text-accent-strong"
                      style={{ marginTop: '-2px' }}
                    />{' '}
                    {location.name} ({location.code})
                  </h3>
                  <p className="text-sm text-muted">{location.address}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Cars */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold my-1">Our cars</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {cars.map((car) => (
                <article
                  key={car._id}
                  className="overflow-hidden rounded border border-line bg-surface shadow-md"
                >
                  <div className="flex h-32 items-center justify-center bg-subtle text-muted md:h-40 lg:h-52">
                    {/* Placeholder image */}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">
                      {car.make} {car.model}
                    </h3>
                    <p className="mb-1 text-sm text-muted">
                      '{car.nickname}' in {car.location?.name}
                    </p>
                    <p className="text-sm text-muted">${car.dailyRate}/day</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
