export default function DevLabel() {
  const isDev = process.env.NODE_ENV === 'development';
  return (
    <span>
      {isDev && (
        <span className="bg-blue-500 text-white text-xs select-none px-0.5">
          DEV
        </span>
      )}
    </span>
  );
}
