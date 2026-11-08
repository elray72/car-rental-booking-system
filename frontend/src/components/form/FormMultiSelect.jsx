import Select from 'react-select';
import { Controller } from 'react-hook-form';

function FormMultiSelect({ field, control, error }) {
  return (
    <div className="flex flex-col mb-4 gap-2">
      <label htmlFor={field.name}>{field.label}</label>
      <Controller
        name={field.name}
        control={control}
        render={({ field: input }) => (
          <Select
            inputId={field.name}
            options={field.options}
            placeholder={field.name}
            value={field.options.filter((option) => (input.value || []).includes(option.value))}
            closeMenuOnSelect={false}
            isMulti
            hideSelectedOptions={false}
            onChange={(selected) => input.onChange((selected || []).map((option) => option.value))}
            styles={{
              control: (base) => ({ ...base, minHeight: 42 }),
              menu: (base) => ({ ...base, zIndex: 1 }),
              placeholder: (base) => ({ ...base, color: 'black' }),
            }}
          />
        )}
      />
      {field.hint && !error ? <p className="text-sm text-gray-500">{field.hint}</p> : null}
      {error ? <p className="text-sm text-red-500">{error.message}</p> : null}
    </div>
  );
}

export default FormMultiSelect;
