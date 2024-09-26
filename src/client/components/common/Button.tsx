type Props = {
  cb: () => void;
  label: string;
  type?: 'primary' | 'secondary';
  disabled?: boolean;
};

export default function Button({ cb, label, type, disabled = false }: Props) {
  return (
    <button
      className="px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors data-[type=primary]:bg-blue-500 data-[type=primary]:hover:bg-blue-600 data-[type=primary]:active:bg-blue-700 data-[type=primary]:text-white data-[type=secondary]:border data-[type=secondary]:border-solid rounded-lg text-sm data-[type]:shadow-sm disabled:grayscale disabled:cursor-not-allowed"
      data-type={type}
      onClick={cb}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
