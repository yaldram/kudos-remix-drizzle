type ButtonProps = React.ComponentPropsWithoutRef<"button">;

export function Button({ type, className, ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-xl mt-2 bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1 ${className}`}
      {...rest}
    />
  );
}
