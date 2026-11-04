import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function Form({ formTitle, className, fields, schema, submitLabel, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
  });
  console.log(errors);
  return (
    <form
      className={clsx('bg-white p-6 shadow-md rounded', className)}
      noValidate
      onSubmit={handleSubmit((data) => onSubmit(data, setError))}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">{formTitle}</h1>
      {fields.map((field) => (
        <div className="flex flex-col mb-4 gap-2" key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            className="w-full p-2 border rounded"
            type={field.type}
            id={field.name}
            autoComplete="off"
            {...register(field.name)}
          />
          {field.hint && !errors[field.name] ? (
            <p className="text-sm text-gray-500">{field.hint}</p>
          ) : null}
          {errors[field.name] ? (
            <p className="text-sm text-red-500">hello{errors[field.name].message}</p>
          ) : null}
        </div>
      ))}
      <button className="w-full bg-blue-600 text-white p-2 rounded" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

export default Form;
