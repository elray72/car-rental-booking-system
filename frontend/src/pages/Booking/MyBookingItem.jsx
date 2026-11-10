import { Link } from 'react-router-dom';

import StatusTag from '../../components/common/StatusTag';
import { formatDay } from '../../helpers';

const MyBookingItem = ({ booking, hideActions = false }) => {
  const car = booking.car;
  const statusVariant = booking.status === 'Confirmed' ? 'success' : 'error';

  return (
    <article className="booking-card sm:items-stretch">
      <div
        className="card-image h-36 w-full shrink-0 sm:h-auto sm:w-40 sm:self-stretch"
        aria-hidden="true"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <p className="font-semibold">
            {car?.make} {car?.model}
          </p>
          <StatusTag variant={statusVariant}>{booking.status}</StatusTag>
        </div>
        <ul className="flex flex-col gap-3 text-sm">
          <li className="flex justify-between gap-4">
            <div className="text-muted">Location</div>
            <div>
              {car?.location?.name} ({car?.location?.code})
            </div>
          </li>
          <li className="flex justify-between gap-4">
            <div className="text-muted">Pickup date</div>
            <div>{formatDay(booking.startDate)}</div>
          </li>
          <li className="flex justify-between gap-4">
            <div className="text-muted">Return date</div>
            <div>{formatDay(booking.endDate)}</div>
          </li>
        </ul>
        {!hideActions ? (
          <div className="mt-auto flex justify-end">
            <Link className="button-link w-fit" to={`/booking/${booking._id}`}>
              View booking
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default MyBookingItem;
