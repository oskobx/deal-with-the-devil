import { cn } from '@/lib/utils';

export default function Sigil({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('h-8 w-8', className)} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
      <path
        d="M32 10 L37 26 L52 26 L40 35 L45 50 L32 41 L19 50 L24 35 L12 26 L27 26 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}