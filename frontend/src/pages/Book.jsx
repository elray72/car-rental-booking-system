import { useEffect, useState } from 'react';
import { FiMapPin } from 'react-icons/fi';

import homeBanner from '../assets/home-banner.jpg';
import axiosInstance from '../axiosConfig';
import { showError } from '../components/common/ErrorToast';

const CAR_LIMIT = 8;

const Book = () => {
  const [locations, setLocations] = useState([]);
  const [cars, setCars] = useState([]);
  const [locationId, setLocationId] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

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
        className="flex h-[67vh] items-center justify-center bg-cover bg-bottom bg-no-repeat px-6"
        style={{ backgroundImage: `url(${homeBanner})` }}
      >
        {/* TODO: Search form */}
        <form className="mx-auto w-full md:w-2/3 rounded-xl border-none bg-white/20 p-6 pb-8 backdrop-blur-md">
          <div className="mb-4 flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Find a car</h1>
            <p className="mt-1">Pay on pickup, return to the same location.</p>
          </div>
          <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-end">
            <label className="flex flex-1 flex-col gap-2 text-sm">
              <span className="font-medium">Pick-up location</span>
              <select
                className="rounded border border-white/60 bg-white/80 p-2 font-normal"
                value={locationId}
                onChange={(event) => setLocationId(event.target.value)}
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.name} ({location.code})
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-1 flex-col gap-2 text-sm">
              <span className="font-medium">Pick-up date</span>
              <input
                className="rounded border border-white/60 bg-white/80 p-2"
                type="date"
                value={pickupDate}
                onChange={(event) => setPickupDate(event.target.value)}
              />
            </label>
            <label className="flex flex-1 flex-col gap-2 text-sm">
              <span className="font-medium">Return date</span>
              <input
                className="rounded border border-white/60 bg-white/80 p-2"
                type="date"
                value={returnDate}
                onChange={(event) => setReturnDate(event.target.value)}
              />
            </label>
            <button className="rounded bg-blue-600 px-4 py-2 text-white" type="button">
              Search cars
            </button>
          </div>
        </form>
      </div>

      {/* Main */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:gap-8">
        {/* Locations */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold my-1">Our locations</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {locations.map((location) => (
              <article key={location._id} className="rounded border bg-white p-4 shadow-md">
                <h3 className="font-semibold mb-2">
                  <FiMapPin className="inline-block mr-1" style={{ marginTop: '-2px' }} />{' '}
                  {location.name} ({location.code})
                </h3>
                <p className="text-sm text-gray-500">{location.address}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Cars */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold my-1">Our cars</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {cars.map((car) => (
              <article key={car._id} className="rounded border bg-white shadow-md overflow-hidden">
                <div className="flex h-32 items-center justify-center bg-gray-100 text-gray-400 md:h-40 lg:h-52">
                  {/* Placeholder image */}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    '{car.nickname}' in {car.location?.name}
                  </p>
                  <p className="text-sm text-gray-500">${car.dailyRate}/day</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
