import { useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { zodResolver } from '@hookform/resolvers/zod';

import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormMultiSelect from './FormMultiSelect';

function Form({
  formTitle,
  className,
  fields,
  formError,
  schema,
  submitLabel,
  defaultValues = {},
  onDelete,
  onSubmit,
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  return (
    <form
      className={twMerge('bg-white p-6 shadow-md rounded', className)}
      noValidate
      onSubmit={handleSubmit((data) => onSubmit(data, setError))}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">{formTitle}</h1>
      {fields.map((field) =>
        field.type === 'select' ? (
          <FormSelect
            key={field.name}
            field={field}
            register={register}
            error={errors[field.name]}
          />
        ) : field.type === 'multi-select' ? (
          <FormMultiSelect
            key={field.name}
            field={field}
            control={control}
            error={errors[field.name]}
          />
        ) : (
          <FormInput
            key={field.name}
            field={field}
            register={register}
            error={errors[field.name]}
          />
        ),
      )}
      {errors.root ? (
        <p className="text-sm text-red-500 mb-4 text-center" role="alert">
          {errors.root.message}
        </p>
      ) : null}
      {formError ? (
        <p className="text-sm text-red-500 mt-4 text-center" role="alert">
          {formError}
        </p>
      ) : null}
      <button className="w-full bg-blue-600 text-white p-2 rounded" type="submit">
        {submitLabel}
      </button>
      {onDelete ? (
        <button
          className="w-full mt-2 bg-red-500 text-white p-2 rounded"
          type="button"
          onClick={onDelete}
        >
          Delete location
        </button>
      ) : null}
    </form>
  );
}

export default Form;
