type InputFieldProps = {
  label: string;
  error?: string;
  errorId?: string;
} & React.ComponentPropsWithoutRef<"input">;

export function InputField({
  name,
  id,
  label,
  type = "text",
  value,
  error = "",
  errorId,
  ...rest
}: InputFieldProps) {
  return (
    <>
      <label htmlFor={id} className="text-blue-600 font-semibold">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        className="w-full p-2 rounded-xl my-2"
        value={value}
        {...rest}
      />
      <div
        id={errorId}
        className="text-xs font-semibold text-center tracking-wide text-red-500 w-full"
      >
        {error}
      </div>
    </>
  );
}
