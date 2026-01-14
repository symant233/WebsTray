type Props = {
  cb: () => void;
  label: string;
  type?: 'primary' | 'secondary';
  disabled?: boolean;
};

export default function Button({ cb, label, type, disabled = false }: Props) {
  return (
    <button
      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors data-[type=primary]:bg-blue-500 data-[type=primary]:hover:bg-blue-600 data-[type=primary]:active:bg-blue-700 data-[type=primary]:text-white data-[type=secondary]:border data-[type=secondary]:border-solid data-[type=secondary]:dark:border-gray-600 data-[type=secondary]:dark:text-gray-200 rounded-lg text-sm data-[type]:shadow-sm disabled:grayscale disabled:cursor-not-allowed dark:text-gray-200"
      data-type={type}
      onClick={cb}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
