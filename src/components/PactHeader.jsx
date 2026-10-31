import StatusBadge from '@/components/StatusBadge';

export default function PactHeader({ pact }) {
  const status = pact.status;
  const chips = [status.badge];
  if (!status.witnessed && !status.finished) chips.push('UNWITNESSED');

  return (
    <section className="mt-7">
      <div className="flex flex-wrap items-center gap-1.5">
        {chips.map((chip) => (
          <StatusBadge key={chip} badge={chip} />
        ))}
      </div>
      <h1 className="mt-4 font-display text-[32px] leading-[1.06] tracking-tight">{pact.habit}</h1>
      <p className="mt-1.5 text-[14px] text-muted-foreground">
        Sworn by <span className="text-foreground/85">{pact.nickname}</span>
        {status.witnessed ? (
          <>
            {' '}
            · witnessed by <span className="text-foreground/85">{pact.witness_name}</span>
          </>
        ) : (
          ' · awaiting a witness'
        )}
      </p>
      <div className="mt-5 flex items-baseline gap-6">
        <div>
          <p className="font-heading text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
            Days left
          </p>
          <p className="mt-1 font-heading text-2xl leading-none">{status.daysLeft}</p>
        </div>
        <div>
          <p className="font-heading text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
            Limit
          </p>
          <p className="mt-1 font-heading text-2xl leading-none">${status.limit}</p>
        </div>
        <div>
          <p className="font-heading text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
            Spent
          </p>
          <p className="mt-1 font-heading text-2xl leading-none">
            ${status.spent % 1 === 0 ? status.spent : status.spent.toFixed(2)}
          </p>
        </div>
      </div>
    </section>
  );
}