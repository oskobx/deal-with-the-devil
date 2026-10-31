import { cn } from '@/lib/utils';

export default function Sigil({ className }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn('h-8 w-8', className)}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* horns */}
      <path d="M21 21C16.5 14 15 8.5 16 5c4 2 7.2 7 9 13.5" />
      <path d="M43 21C47.5 14 49 8.5 48 5c-4 2-7.2 7-9 13.5" />
      {/* head + tapered chin */}
      <path d="M32 17c9.8 0 16.6 7 16.6 16 0 9.6-7.2 18.4-16.6 18.4S15.4 42.6 15.4 33C15.4 24 22.2 17 32 17Z" />
      {/* brows */}
      <path d="M20.5 28.5c3-2.4 6.4-2.6 9-1" />
      <path d="M43.5 28.5c-3-2.4-6.4-2.6-9-1" />
      {/* eyes */}
      <ellipse cx="24.8" cy="34" rx="3.1" ry="3.5" fill="currentColor" stroke="none" />
      <ellipse cx="39.2" cy="34" rx="3.1" ry="3.5" fill="currentColor" stroke="none" />
      {/* snout */}
      <path d="M29.6 38.4h4.8l-2.4 3.2-2.4-3.2Z" fill="currentColor" stroke="none" />
      {/* grin */}
      <path d="M23.5 44.6c2.6 3.6 14.4 3.6 17 0" />
      <path d="M28 46.4l1.6 3 1.6-3" fill="currentColor" stroke="none" />
      <path d="M34.4 46.4l1.6 3 1.6-3" fill="currentColor" stroke="none" />
    </svg>
  );
}