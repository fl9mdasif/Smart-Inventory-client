"use client";
import { useFormContext, Controller } from "react-hook-form";

type RInputProps = {
  name: string;
  label?: string;
  type?: string;
  fullWidth?: boolean;
  required?: boolean;
};

const RInput = ({
  name,
  label,
  type = "text",
  fullWidth,
  required,
}: RInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col w-full">
          {label && (
            <label
              htmlFor={name}
              className="mb-1 text-sm text-left text-gray-800"
            >
              {label}
            </label>
          )}
          <input
            {...field}
            id={name}
            type={type}
            required={required}
            value={field.value || ""}
            className={`
              px-3 py-2 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${fullWidth ? "w-full" : ""}
              ${error ? "border-red-500" : ""}
            `}
          />
          {error && (
            <p className="mt-1 text-xs text-left text-red-600">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default RInput;
