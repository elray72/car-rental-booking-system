import { useAuth } from '../context/AuthContext';

const Book = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <h1>Book a car</h1>
      {user && <p>Welcome {user.name}</p>}
    </div>
  );
};

export default Book;
