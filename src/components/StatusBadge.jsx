import { cn } from '@/lib/utils';

const TONES = {
  DAMNED: 'border-primary/60 bg-primary/15 text-[#ff8a5c]',
  REDEEMED: 'border-[#c99a3a]/60 bg-[#c99a3a]/10 text-[#e8c073]',
  'IN GOOD STANDING': 'border-emerald-800/60 bg-emerald-950/40 text-emerald-300/90',
  UNWITNESSED: 'border-border bg-secondary text-muted-foreground'
};

export default function StatusBadge({ badge, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 font-heading text-[9.5px] uppercase tracking-[0.22em]',
        TONES[badge] || TONES['UNWITNESSED'],
        className
      )}
    >
      {badge}
    </span>
  );
}