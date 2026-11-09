import { twMerge } from 'tailwind-merge';

const variants = {
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  error: 'bg-danger-light text-danger',
};

const StatusTag = ({ variant = 'success', className, style, children }) => {
  return (
    <span
      className={twMerge(
        'inline-flex w-fit items-center gap-1.5 rounded-full pl-2 pr-3 py-1 text-xs font-semibold',
        variants[variant],
        className,
        style,
      )}
    >
      <svg
        width="6"
        height="6"
        viewBox="0 0 6 6"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="3" cy="3" r="3" fill="currentColor" />
      </svg>
      {children}
    </span>
  );
};

export default StatusTag;
