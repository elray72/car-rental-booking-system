function FormSelect({ field, register, error }) {
  return (
    <div className="flex flex-col mb-4 gap-2">
      <label htmlFor={field.name}>{field.label}</label>
      <select className="w-full p-2 border rounded" id={field.name} {...register(field.name)}>
        <option value="">Select</option>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {field.hint && !error ? <p className="text-sm text-gray-500">{field.hint}</p> : null}
      {error ? <p className="text-sm text-red-500">{error.message}</p> : null}
    </div>
  );
}

export default FormSelect;
