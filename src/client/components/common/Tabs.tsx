import { clsx } from 'clsx';
import { useState, type ReactNode } from 'react';

export type ITabOption = {
  label: string;
  render?: ReactNode;
  disabled?: boolean;
};

type Props = {
  options: ITabOption[];
  onChange?: (value: string) => void;
};

export default function Tabs({ options, onChange }: Props) {
  const [checked, setChecked] = useState<string>(options?.[0].label || '');

  return (
    <>
      <div className="text-base p-3 h-full min-h-10 flex flex-col gap-2 border-r dark:border-neutral-700 select-none pt-5 shadow-sm bg-white dark:bg-neutral-900 transition-colors">
        {options &&
          options.map((i) => {
            return (
              <span
                key={i.label}
                className={clsx(
                  'cursor-pointer text-center',
                  'px-2.5 py-1.5 rounded-sm transition-colors',
                  {
                    'bg-blue-500 text-white': checked === i.label,
                    'hover:bg-gray-100 dark:hover:bg-neutral-700 active:bg-gray-200 dark:active:bg-neutral-600 dark:text-neutral-200': checked !== i.label,
                    '!cursor-not-allowed': i.disabled,
                  },
                )}
                onClick={() => {
                  if (i.disabled) return;
                  setChecked(i.label);
                  onChange?.(i.label);
                }}
              >
                {i.label}
              </span>
            );
          })}
      </div>
      {options.find((f) => f.label === checked)?.render}
    </>
  );
}
