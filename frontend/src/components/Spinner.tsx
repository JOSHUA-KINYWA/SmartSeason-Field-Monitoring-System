interface SpinnerProps {
  size?: 'w-4 h-4' | 'w-5 h-5' | 'w-6 h-6' | 'w-7 h-7' | 'w-8 h-8';
  className?: string;
}

export default function Spinner({ size = 'w-6 h-6', className = '' }: SpinnerProps) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${size} ${className}`} aria-hidden="true" />;
}
