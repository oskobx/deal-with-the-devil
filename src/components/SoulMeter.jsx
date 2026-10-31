import { money } from '@/lib/format';

export default function SoulMeter({ percent, spent, limit }) {
  const width = Math.max(0, Math.min(100, percent));
  return (
    <div>
      <div className="flex items-end justify-between">
        <span className="font-heading text-[9.5px] uppercase tracking-[0.3em] text-muted-foreground">
          Soul meter
        </span>
        <span className="font-heading text-lg leading-none text-foreground/90">{percent}%</span>
      </div>
      <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full border border-border/70 bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7c1d0c] via-[#e2701c] to-[#f2c35a] transition-[width] duration-700 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="mt-2 text-[12.5px] text-muted-foreground">
        <span className="text-foreground/80">{money(spent)}</span> spent of{' '}
        <span className="text-foreground/80">{money(limit)}</span> limit
      </p>
    </div>
  );
}