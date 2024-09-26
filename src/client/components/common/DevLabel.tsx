type Props = {
  showProd?: boolean;
};

export default function DevLabel({ showProd }: Props) {
  const isDev = process.env.NODE_ENV === 'development';
  return (
    <span>
      {isDev && (
        <span className="bg-blue-500 text-white text-xs select-none px-0.5">
          DEV
        </span>
      )}
      {showProd && !isDev && (
        <span className="bg-orange-500 text-white text-xs select-none px-0.5">
          PROD
        </span>
      )}
    </span>
  );
}
