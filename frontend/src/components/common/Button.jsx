import { twMerge } from 'tailwind-merge';

const variants = {
  default: 'bg-accent text-black hover:brightness-90 font-medium',
  secondary: 'bg-surface text-black border border-black hover:brightness-90 font-medium',
};

const Button = ({ variant = 'default', className, type = 'button', children, ...props }) => {
  return (
    <button
      type={type}
      className={twMerge('rounded px-4 py-2 font-medium transition', variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
