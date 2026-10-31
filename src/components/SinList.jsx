import { Flame, Sun } from 'lucide-react';
import { money, shortDate } from '@/lib/format';

export default function SinList({ logs, compact = false }) {
  if (!logs || logs.length === 0) {
    return (
      <section className="mt-8">
        <h2 className="font-heading text-[10px] uppercase tracking-[0.28em] text-foreground/70">
          Sins logged
        </h2>
        <p className="mt-2 text-[13.5px] text-muted-foreground">Nothing logged yet. Suspicious.</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="font-heading text-[10px] uppercase tracking-[0.28em] text-foreground/70">
        Sins logged <span className="text-muted-foreground/60">({logs.length})</span>
      </h2>
      <ul className="mt-3 divide-y divide-border border-y border-border">
        {logs.slice(0, compact ? 5 : 40).map((log) => (
          <li key={log.id} className="py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2.5">
                {log.kind === 'sin' ? (
                  <Flame className="mt-[2px] h-3.5 w-3.5 shrink-0 text-primary" />
                ) : (
                  <Sun className="mt-[2px] h-3.5 w-3.5 shrink-0 text-emerald-400/80" />
                )}
                <div className="min-w-0">
                  <p className="text-[14px] text-foreground/85">
                    {log.kind === 'sin' ? log.label || 'A sin' : 'A clean day'}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
                    {shortDate(log.created_date)}
                  </p>
                </div>
              </div>
              <span className="shrink-0 font-heading text-[14px] text-foreground/85">
                {log.kind === 'sin' ? money(log.amount) : '—'}
              </span>
            </div>
            {log.devil_reply && (
              <p className="mt-2 border-l border-primary/40 pl-3 text-[13px] italic leading-relaxed text-muted-foreground">
                {log.devil_reply}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}