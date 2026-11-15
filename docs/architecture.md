## Architecture

Sunshine Car Rentals is a React web application with an Express API backend, connecting to a MongoDB database (via [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)). In dev mode there are 2 processes running:

| Process                 | Description    |
| ----------------------- | -------------- |
| `http://localhost:3000` | React Frontend |
| `http://localhost:5001` | Express API    |

### Production environment

The production environment is an Ubuntu instance on AWS EC2. In production, Express serves the frontend and the API from one process on Port `5001` and is managed by the `PM2` process manager. PM2 is a daemon process manager for Node.js. It was chosen just as an easy way to keep the application running after terminal session has ended.

### Roles

- Customer - Book a car, update their own profile
- Staff - All customer permissions
  - Can modify bookings on behalf of customer
- Admin - All staff permissions
  - Can add, edit and delete locations
  - Can add, edit and retire cars

### Entities

- Users - Used to identify individuals and stores their access credentials. May be assigned roles (as above).
- Car - Contains details of the rental vehicle, it's make, model, daily rate and searchable tags. May be assigned to a location.
- Locations - Represents each physical depot and contains the locations name, friendly code (used for urls an dis connected to the airport code). Cars must be assigned to a location before it can be booked.
- Booking - Holds the reservation a customer has made and contains references to:
  - The booking `owner` or customer who made the booking
  - The booked car
  - The start and end dates of the booking
  - And the status of the booking, a booking may be 'Cancelled' but not necessarily deleted. If booking is 'Active' then the associated car will not be able to be booked and will not appear in booking searches.

### Security and access control

- Username and password is exchanged for a JWT
- JWT is validated server-side for user authenticity and role
- The frontend has a protected route component which can read the user role and identity and determine if the user can access that page
- Credentials are persisted by cookies - cookies were chosen over local storage as local storage values do not expire (and you will not be automatically logged out) and over sessio storage as it does not persist across tabs.