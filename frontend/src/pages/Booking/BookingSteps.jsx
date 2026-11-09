import { twMerge } from 'tailwind-merge';

const STEPS = ['Search', 'Pick car', 'Confirm', 'Done'];

const BookingSteps = ({ current, className }) => {
  return (
    <ol className={twMerge('flex flex-wrap items-center gap-x-8 gap-y-2 text-sm', className)}>
      {STEPS.map((label, index) => {
        const number = index + 1;
        const active = number === current;
        const bgColor = active ? 'bg-accent' : number < current ? 'bg-line' : 'bg-white';
        return (
          <li key={label} className="flex items-center gap-2">
            <span className={`step-circle ${bgColor}`}>{number}</span>
            <span className={active ? 'font-semibold' : 'text-muted'}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default BookingSteps;
