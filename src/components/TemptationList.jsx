import { Flame } from 'lucide-react';

export default function TemptationList({ temptations }) {
  if (!temptations || temptations.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="font-heading text-[10px] uppercase tracking-[0.28em] text-primary/80">
        Whispers from your witness
      </h2>
      <ul className="mt-3 space-y-2">
        {temptations.map((t) => (
          <li
            key={t.id}
            className="rise rounded-sm border border-primary/25 bg-primary/[0.07] px-4 py-3"
          >
            <p className="flex items-start gap-2 text-[14.5px] italic leading-snug text-foreground/90">
              <Flame className="mt-[3px] h-3.5 w-3.5 shrink-0 text-primary/80" />
              {t.message}
            </p>
            <p className="mt-1 pl-[22px] text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground/70">
              {t.witness_name || 'Your witness'}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}