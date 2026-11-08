import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { z } from 'zod';

import axiosInstance from '../axiosConfig';
import Form from '../components/form/Form';
import { useAuth } from '../context/AuthContext';
import { authConfig } from '../helpers';

const schema = z.object({
  nickname: z.string().min(1, 'Nickname is required'),
  rego: z.string().min(1, 'Rego is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().int().positive('Please enter a valid year'),
  color: z.string().min(1, 'Colour is required'),
  dailyRate: z.coerce.number(),
  location: z.string(),
  tags: z.array(z.string()),
});

const CarForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [locationsResponse, tagsResponse] = await Promise.all([
          axiosInstance.get('/api/locations'),
          axiosInstance.get('/api/cars/tags', authConfig(user.token)),
        ]);
        setLocations(locationsResponse.data);
        setTagOptions(tagsResponse.data.map((tag) => ({ label: tag, value: tag })));
      } catch (error) {
        setLoadError(error.response?.data?.message || 'Failed to load car form.');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [user.token]);

  const fields = [
    { name: 'make', label: 'Make', type: 'text' },
    { name: 'model', label: 'Model', type: 'text' },
    { name: 'year', label: 'Year', type: 'number' },
    { name: 'nickname', label: 'Nickname', type: 'text' },
    { name: 'rego', label: 'Rego', type: 'text' },
    { name: 'color', label: 'Colour', type: 'text' },
    { name: 'dailyRate', label: 'Daily rate', type: 'number' },
    {
      name: 'location',
      label: 'Location',
      type: 'select',
      options: locations.map((location) => ({
        value: location._id,
        label: `${location.name} (${location.code})`,
      })),
    },
    { name: 'tags', label: 'Tags', type: 'multi-select', options: tagOptions },
  ];

  const handleSubmit = async (data, setError) => {
    try {
      await axiosInstance.post('/api/cars', data, authConfig(user.token));
      navigate('/cars');
    } catch (error) {
      const { message, field } = error.response?.data || {};
      const text = message || 'Unable to save car.';
      if (field) {
        setError(field, { message: text });
        return;
      }
      setError('root', { message: text });
    }
  };

  if (loadError) return <p className="text-center text-red-500 mt-20">{loadError}</p>;

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <BounceLoader size={40} color="grey" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <Form
        formTitle="Add car"
        fields={fields}
        schema={schema}
        submitLabel="Add car"
        defaultValues={{ location: '', dailyRate: 0, tags: [] }}
        onSubmit={handleSubmit}
      />
      <p className="text-center text-sm mt-4">
        <Link className="text-blue-500 hover:underline" to="/cars">
          Back to cars
        </Link>
      </p>
    </div>
  );
};

export default CarForm;
