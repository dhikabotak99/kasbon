import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldProps {
  label: string;
  error?: string;
}

export function Field({
  label,
  error,
  children,
}: FieldProps & { children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}

const inputClasses = (hasError: boolean) =>
  `w-full rounded-lg border px-3 py-2 text-sm shadow-xs placeholder:text-gray-400 focus:outline-2 focus:outline-offset-1 ${
    hasError
      ? "border-red-300 focus:outline-red-500"
      : "border-gray-300 focus:outline-indigo-600"
  }`;

export function TextInput({
  label,
  error,
  className = "",
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label} error={error}>
      <input className={`${inputClasses(Boolean(error))} ${className}`} {...props} />
    </Field>
  );
}

export function TextArea({
  label,
  error,
  className = "",
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Field label={label} error={error}>
      <textarea
        className={`${inputClasses(Boolean(error))} ${className} resize-none`}
        {...props}
      />
    </Field>
  );
}
