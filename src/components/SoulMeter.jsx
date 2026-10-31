import { money } from '@/lib/format';

export default function SoulMeter({ percent, spent, limit }) {
  const width = Math.max(0, Math.min(100, percent));
  return (
    <div>
      <div className="flex items-end justify-between">
        <span className="font-heading text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
          Soul meter
        </span>
        <span className="font-heading text-lg leading-none text-foreground/90">{percent}%</span>
      </div>
      <div className="mt-2.5 h-3.5 w-full overflow-hidden rounded-full border-2 border-[#231710] bg-[#1b120d] shadow-[inset_0_2px_0_rgba(0,0,0,0.6)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#8a1f08] via-[#f2701c] to-[#ffd066] transition-[width] duration-700 ease-out"
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