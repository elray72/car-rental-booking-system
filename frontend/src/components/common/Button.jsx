import { twMerge } from 'tailwind-merge';

const variants = {
  default: 'bg-accent text-black hover:brightness-95',
  secondary: 'bg-surface text-black border border-line',
};

const Button = ({ variant = 'default', className, type = 'button', children, ...props }) => {
  return (
    <button
      type={type}
      className={twMerge(
        'rounded-lg px-4 py-2 font-medium transition-colors',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
