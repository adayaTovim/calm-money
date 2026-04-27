import { useStore } from '../../store/useStore';

interface DateInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function DateInput({ value, onChange, className }: DateInputProps) {
  const language = useStore((s) => s.language);
  return (
    <input
      type="date"
      lang={language}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}
