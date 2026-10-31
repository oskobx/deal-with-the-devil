import { useState } from 'react';
import { HeartHandshake, ExternalLink, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function DamnedPanel({ token, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const redeem = async () => {
    setError('');
    setBusy(true);
    try {
      const res = await base44.functions.invoke('pactAction', {
        action: 'redeem',
        token,
        view: 'owner'
      });
      onDone(res.data);
    } catch (e) {
      setError(e?.response?.data?.error || 'The good deed did not register. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="ember-glow mt-8 rounded-sm border border-primary/50 bg-gradient-to-b from-[#3b0f08] to-[#1b0a07] px-5 py-6">
      <p className="font-heading text-[10px] uppercase tracking-[0.34em] text-[#ff9a6a]">
        Damned
      </p>
      <h2 className="mt-2 font-display text-[26px] leading-tight text-[#ffd9c2]">
        You went over. Your soul is on the table.
      </h2>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#e8b7a0]">
        There is one way out, and it is embarrassingly wholesome. Donate $20 to SF-Marin Food Bank,
        then report the good deed below.
      </p>
      <a
        href="https://donate.sfmfoodbank.org/page/92219/donate/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#f2c35a] px-4 py-3.5 font-heading text-[10.5px] uppercase tracking-[0.2em] text-[#2b1608] transition-all hover:brightness-105"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Buy back your soul: donate $20
      </a>
      <button
        type="button"
        onClick={redeem}
        disabled={busy}
        className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-[#f2c35a]/40 px-4 py-3.5 font-heading text-[10.5px] uppercase tracking-[0.2em] text-[#f7d79a] transition-colors hover:bg-[#f2c35a]/10 disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <HeartHandshake className="h-3.5 w-3.5" />}
        I did the good deed
      </button>
      {error && <p className="mt-2 text-[12px] text-[#ffb199]">{error}</p>}
      <p className="mt-3 text-[11px] leading-relaxed text-[#c79a86]">
        The app takes no payment and never sees your donation. Declining is free; the pact simply
        continues.
      </p>
    </section>
  );
}