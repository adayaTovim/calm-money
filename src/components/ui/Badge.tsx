interface BadgeProps {
  type: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
}

const styles = {
  success: 'bg-calm-green-light text-calm-green',
  warning: 'bg-calm-amber-light text-calm-amber',
  danger: 'bg-calm-red-light text-calm-red',
  info: 'bg-calm-blue-light text-calm-blue',
  neutral: 'bg-beige-100 text-gray-500',
};

export function Badge({ type, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
      {children}
    </span>
  );
}
