function FormInput({ field, register, error }) {
  return (
    <div className="flex flex-col mb-4 gap-2">
      <label htmlFor={field.name}>{field.label}</label>
      <input
        className="w-full p-2 border rounded"
        type={field.type}
        id={field.name}
        autoComplete="off"
        {...register(field.name)}
      />
      {field.hint && !error ? <p className="text-sm text-gray-500">{field.hint}</p> : null}
      {error ? <p className="text-sm text-red-500">{error.message}</p> : null}
    </div>
  );
}

export default FormInput;
