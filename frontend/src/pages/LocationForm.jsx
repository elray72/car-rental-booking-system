import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { z } from 'zod';

import axiosInstance from '../axiosConfig';
import Form from '../components/form/Form';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  address: z.string().min(1, 'Address is required'),
});

const fields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'code', label: 'Code', type: 'text' },
  { name: 'address', label: 'Address', type: 'text' },
];

const LocationCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchLocation = async () => {
      try {
        const response = await axiosInstance.get('/api/locations');
        const match = response.data.find((item) => item._id === id);
        if (!match) {
          setLoadError('Location not found.');
        } else {
          setLocation(match);
        }
      } catch (error) {
        setLoadError('Failed to load location.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleSubmit = async (data, setError) => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      if (id) {
        await axiosInstance.put(`/api/locations/${id}`, data, config);
      } else {
        await axiosInstance.post('/api/locations', data, config);
      }
      navigate('/locations');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to save location.';
      if (error.response?.status === 409) {
        setError('code', { message });
        return;
      }
      setError('root', { message });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this location?')) return;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };

    try {
      await axiosInstance.delete(`/api/locations/${id}`, config);
      navigate('/locations');
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'Unable to delete location.');
    }
  };

  if (loadError) {
    return <p className="text-center text-red-500 mt-20">{loadError}</p>;
  }

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
        formTitle={id ? 'Edit location' : 'Add location'}
        fields={fields}
        formError={deleteError}
        schema={schema}
        submitLabel={id ? 'Save changes' : 'Add location'}
        defaultValues={
          location
            ? { name: location.name, code: location.code, address: location.address }
            : undefined
        }
        onSubmit={handleSubmit}
        onDelete={id ? handleDelete : undefined}
      />
      <p className="text-center text-sm mt-4">
        <Link className="text-blue-500 hover:underline" to="/locations">
          Back to locations
        </Link>
      </p>
    </div>
  );
};

export default LocationCreate;
