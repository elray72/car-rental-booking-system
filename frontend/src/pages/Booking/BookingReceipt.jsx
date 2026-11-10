import { Link } from 'react-router-dom';

import { dateRangeDays, formatDay } from '../../helpers';
import StatusTag from '../../components/common/StatusTag';

const BookingReceipt = ({ booking }) => {
  const start = formatDay(booking.startDate, 'yyyy-MM-dd');
  const end = formatDay(booking.endDate, 'yyyy-MM-dd');
  const days = dateRangeDays(start, end);
  const car = booking.car;
  const statusVariant = booking.status === 'Confirmed' ? 'success' : 'error';

  return (
    <article className="booking-card relative flex-col items-stretch">
      <div className="absolute top-3 right-4">
        <StatusTag variant={statusVariant}>{booking.status}</StatusTag>
      </div>
      <p className="font-semibold">
        {car?.make} {car?.model}
      </p>
      <ul className="flex flex-col gap-3 text-sm my-1">
        <div className="flex justify-between gap-4">
          <div className="text-muted">Location</div>
          <div>
            {car?.location?.name} ({car?.location?.code})
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <div className="text-muted">Pickup date</div>
          <div>{formatDay(start)}</div>
        </div>
        <div className="flex justify-between gap-4">
          <div className="text-muted">Return date</div>
          <div>{formatDay(end)}</div>
        </div>
        <div className="flex justify-between gap-4">
          <div className="text-muted">Daily rate</div>
          <div>
            ${car?.dailyRate} x {days} days
          </div>
        </div>
        <div className="row-total">
          <div>Total</div>
          <div>${(car?.dailyRate || 0) * days}</div>
        </div>
      </ul>
      <Link className="button-link w-fit" to="/">
        Back to home
      </Link>
    </article>
  );
};

export default BookingReceipt;
