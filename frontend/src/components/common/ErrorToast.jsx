import toast from 'react-hot-toast';

const ErrorToastContent = ({ message, toastId }) => (
  <div className="flex items-center gap-3">
    <span>{message}</span>
    <button
      type="button"
      className="text-sm text-red-600 rounded border border-red-500 font-medium px-2 py-1"
      aria-label="Dismiss"
      onClick={() => toast.dismiss(toastId)}
    >
      Dismiss
    </button>
  </div>
);

export const showError = (message) => {
  toast.error((t) => <ErrorToastContent message={message} toastId={t.id} />, {
    id: message,
    duration: Infinity,
    style: {
      background: '#fff2f3',
    },
  });
};

export default ErrorToastContent;
