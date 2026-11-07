import { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';
import axiosInstance from '../axiosConfig';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosInstance.get('/api/locations');
        setLocations(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-20">
      <div className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Locations</h1>
        <div className="flex justify-center items-center">
          {loading ? (
            <BounceLoader size={40} color="grey" />
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : locations.length <= 0 ? (
            <p className="text-center">No locations yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2 border-b">Code</th>
                  <th className="p-2 border-b">Name</th>
                  <th className="p-2 border-b">Address</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location._id}>
                    <td className="p-2 border-b">{location.code}</td>
                    <td className="p-2 border-b">{location.name}</td>
                    <td className="p-2 border-b">{location.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Locations;
