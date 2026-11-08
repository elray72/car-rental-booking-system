import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { BounceLoader } from 'react-spinners';

import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { authConfig } from '../helpers';

const CAR_TAGS = [
  'small',
  'medium',
  'large',
  'suv',
  'van',
  'ute',
  'ev',
  'hybrid',
  'luxury',
  'sports',
];

const TAG_OPTIONS = CAR_TAGS.map((tag) => ({ label: tag, value: tag }));

const Cars = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [carTags, setCarTags] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ locationId: '', status: '', tags: [] });

  useEffect(() => {
    // Make both requests in parallel, allows use to combine error/loading handling
    const fetchCarsAndLocations = async () => {
      try {
        const [carsResponse, tagsResponse, locationsResponse] = await Promise.all([
          axiosInstance.get('/api/cars', authConfig(user.token)),
          axiosInstance.get('/api/cars/tags'),
          axiosInstance.get('/api/locations'),
        ]);
        setCars(carsResponse.data);
        setCarTags(tagsResponse.data.map((tag) => ({ label: tag, value: tag })));
        setLocations(locationsResponse.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCarsAndLocations();
  }, [user.token]);

  const setFilter = (key) => (event) => {
    setFilters((current) => ({ ...current, [key]: event.target.value }));
  };

  const setTags = (tags) => {
    setFilters((current) => ({ ...current, tags: tags ?? [] }));
  };

  if (error) {
    <div className="flex justify-center mt-20">
      <p className="text-center text-red-500 mt-20">{error}</p>;
    </div>;
  }

  // Filter cars based on location, status, and tag
  const visibleCars = cars
    .filter((car) => {
      const locationId = car.location?._id || car.location;
      const locationMatches = !filters.locationId || locationId === filters.locationId;
      const statusMatches = !filters.status || car.status === filters.status;
      const selectedTags = filters.tags.map((option) => option.value);
      const tagMatches =
        selectedTags.length === 0 || selectedTags.some((tag) => (car.tags || []).includes(tag));
      return locationMatches && statusMatches && tagMatches;
    })
    .sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model));

  return (
    <div className="max-w-6xl mx-auto mt-20">
      <div className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Cars</h1>
        <div className="flex justify-end mb-4">
          {user?.role === 'admin' ? (
            <Link to="/cars/create" className="bg-blue-600 text-white px-4 py-2 rounded">
              Add car
            </Link>
          ) : null}
        </div>
        <div className="flex gap-4 mb-4 justify-end">
          <select
            className="p-2 border rounded"
            value={filters.locationId}
            onChange={setFilter('locationId')}
          >
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location._id} value={location._id}>
                {location.code} {location.name}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded"
            value={filters.status}
            onChange={setFilter('status')}
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Retired">Retired</option>
          </select>
          <Select
            options={TAG_OPTIONS}
            value={filters.tags}
            placeholder="All tags"
            aria-label="Tags"
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isMulti
            onChange={setTags}
            styles={{
              control: (base) => ({ ...base, minHeight: 42 }),
              menu: (base) => ({ ...base, zIndex: 1 }),
              placeholder: (base) => ({ ...base, color: 'black' }),
            }}
          />
        </div>
        <div className="flex justify-center mt-20">
          {visibleCars.length <= 0 ? (
            <p className="text-center">
              {cars.length === 0 ? 'No cars yet.' : 'No cars match your criteria.'}
            </p>
          ) : (
            <>
              {loading ? (
                <BounceLoader size={40} color="grey" />
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Make</th>
                      <th className="p-2 border-b">Model</th>
                      <th className="p-2 border-b">Year</th>
                      <th className="p-2 border-b">Nickname</th>
                      <th className="p-2 border-b">Rego</th>
                      <th className="p-2 border-b">Colour</th>
                      <th className="p-2 border-b">Daily rate</th>
                      <th className="p-2 border-b">Location</th>
                      <th className="p-2 border-b">Tags</th>
                      <th className="p-2 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCars.map((car) => (
                      <tr key={car._id}>
                        <td className="p-2 border-b">{car.make}</td>
                        <td className="p-2 border-b">{car.model}</td>
                        <td className="p-2 border-b">{car.year}</td>
                        <td className="p-2 border-b">{car.nickname}</td>
                        <td className="p-2 border-b">{car.rego}</td>
                        <td className="p-2 border-b">{car.color}</td>
                        <td className="p-2 border-b">{car.dailyRate}</td>
                        <td className="p-2 border-b">{car.location ? car.location.name : ''}</td>
                        <td className="p-2 border-b">{(car.tags || []).join(', ')}</td>
                        <td className="p-2 border-b">{car.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cars;
