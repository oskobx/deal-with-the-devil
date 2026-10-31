import { money } from '@/lib/format';

const LINES = {
  Clean: 'You kept the promise. The devil is sulking in a corner.',
  Redeemed: 'You overspent, then did a good deed. The devil has filed a complaint.',
  Damned: 'You broke the pact. The devil is insufferable about it.'
};

export default function VerdictCard({ pact }) {
  const status = pact.status;
  const verdict = status.verdict;
  if (!verdict) return null;

  const spend = status.normalSpend - status.spent;

  return (
    <section className="mt-8 rounded-sm border border-border bg-card px-5 py-6">
      <p className="text-center font-heading text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
        Verdict
      </p>
      <p
        className={
          verdict === 'Clean'
            ? 'mt-2 text-center font-display text-[40px] leading-none text-emerald-300'
            : verdict === 'Redeemed'
              ? 'mt-2 text-center font-display text-[40px] leading-none text-[#e8c073]'
              : 'mt-2 text-center font-display text-[40px] leading-none text-[#ff8a5c]'
        }
      >
        {verdict}
      </p>
      <p className="mx-auto mt-3 max-w-[300px] text-center text-[13px] leading-relaxed text-muted-foreground">
        {LINES[verdict]}
      </p>
      <div className="mt-6 divide-y divide-border border-y border-border">
        <div className="flex items-center justify-between py-3">
          <span className="text-[12.5px] uppercase tracking-[0.14em] text-muted-foreground">
            Normal weekly spend
          </span>
          <span className="font-heading text-[16px]">{money(status.normalSpend)}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-[12.5px] uppercase tracking-[0.14em] text-muted-foreground">
            Actual spend
          </span>
          <span className="font-heading text-[16px]">{money(status.spent)}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-[12.5px] uppercase tracking-[0.14em] text-muted-foreground">
            Money saved
          </span>
          <span className="font-heading text-[16px] text-[#f2c35a]">
            {spend >= 0 ? money(spend) : `-${money(Math.abs(spend))}`}
          </span>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground/60">
        {pact.nickname} · {pact.habit} · 7 day pact
      </p>
    </section>
  );
}