import { cn } from '@/lib/utils';

const TONES = {
  DAMNED: 'border-[#5a1c08] bg-[#d8451a] text-[#1e0d05]',
  REDEEMED: 'border-[#4a3410] bg-[#e9b843] text-[#2a1d05]',
  'IN GOOD STANDING': 'border-[#1c3212] bg-[#b6c96a] text-[#152009]',
  UNWITNESSED: 'border-[#3a302a] bg-[#2a2320] text-[#c9b7a4]'
};

export default function StatusBadge({ badge, className }) {
  return (
    <span
      className={cn(
        'inline-flex -rotate-1 items-center rounded-[10px] border-2 px-3 py-1 font-heading text-[10px] uppercase tracking-[0.18em] shadow-[2px_2px_0_rgba(0,0,0,0.5)]',
        TONES[badge] || TONES['UNWITNESSED'],
        className
      )}
    >
      {badge}
    </span>
  );
}