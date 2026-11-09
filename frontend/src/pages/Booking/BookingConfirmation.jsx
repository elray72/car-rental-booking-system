import { Link, useLocation } from 'react-router-dom';

import BookingReceipt from './BookingReceipt';
import BookingSteps from './BookingSteps';

const BookingConfirmation = () => {
  const booking = useLocation().state?.booking;

  return (
    <div className="min-h-[70vh] w-full bg-canvas text-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <BookingSteps className="mx-auto" current={4} />
        <div>
          <h1 className="text-2xl font-bold">Booking confirmation</h1>
        </div>
        {booking ? (
          <BookingReceipt booking={booking} />
        ) : (
          <p className="rounded border border-line bg-surface p-4 text-sm">
            This confirmation is unavailable.{' '}
            <Link className="font-medium underline" to="/">
              Back to home
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;
