import { useState } from 'react';
import { Flame, Sun, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function LogSpend({ token, cleanLoggedToday, disabled, onDone }) {
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const run = async (action, payload) => {
    setError('');
    setBusy(action);
    try {
      const res = await base44.functions.invoke('pactAction', {
        action,
        token,
        view: 'owner',
        ...payload
      });
      setAmount('');
      onDone(res.data);
    } catch (e) {
      setError(e?.response?.data?.error || 'The ledger jammed. Try that again.');
    } finally {
      setBusy('');
    }
  };

  const logSin = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter an amount above zero.');
      return;
    }
    run('log_sin', { amount: value });
  };

  if (disabled) {
    return (
      <section className="ink-card mt-8 bg-card/70 px-5 py-5">
        <p className="font-heading text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
          The ledger is closed
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
          Seven days have passed. Nothing more can be logged.
        </p>
      </section>
    );
  }

  return (
    <section className="ink-card mt-8 bg-card/70 px-5 py-5">
      <h2 className="font-heading text-[10px] uppercase tracking-[0.28em] text-foreground/70">
        Log it
      </h2>
      <div className="mt-3 flex items-center gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground">
            $
          </span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            inputMode="decimal"
            placeholder="0.00"
            aria-label="Amount spent"
            className="w-full rounded-[12px] border-2 border-[#3a2a20] bg-[#160e09] py-3 pl-7 pr-3 font-heading text-[18px] text-foreground outline-none transition-colors focus:border-primary/70"
          />
        </div>
        <button
          type="button"
          onClick={logSin}
          disabled={!!busy}
          className="btn-ink inline-flex items-center gap-2 border-2 border-[#1e0f06] bg-primary px-4 py-3.5 font-heading text-[10px] uppercase tracking-[0.18em] text-primary-foreground hover:brightness-110 disabled:opacity-50"
        >
          {busy === 'log_sin' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Flame className="h-3.5 w-3.5" />}
          Log a sin
        </button>
      </div>
      <button
        type="button"
        onClick={() => run('log_clean', {})}
        disabled={!!busy || cleanLoggedToday}
        className="btn-ink mt-2.5 inline-flex w-full items-center justify-center gap-2 border-2 border-border px-4 py-3 font-heading text-[10px] uppercase tracking-[0.18em] text-foreground/75 hover:border-accent/60 hover:text-accent disabled:opacity-40"
      >
        {busy === 'log_clean' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sun className="h-3.5 w-3.5" />}
        {cleanLoggedToday ? 'Clean day already logged' : 'Log a clean day'}
      </button>
      {error && <p className="mt-2.5 text-[12.5px] text-[#ff8a5c]">{error}</p>}
      <p className="mt-2.5 text-[11px] text-muted-foreground/70">
        One clean day per day. The devil counts them himself.
      </p>
    </section>
  );
}