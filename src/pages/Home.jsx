import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ScrollText, Users, TrendingDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Sigil from '@/components/Sigil';
import Footer from '@/components/Footer';
import { money } from '@/lib/format';

export default function Home() {
  const [totals, setTotals] = useState(null);

  useEffect(() => {
    let alive = true;
    base44.functions
      .invoke('ledgerStats', {})
      .then((res) => {
        if (alive) setTotals(res.data.totals);
      })
      .catch(() => {
        if (alive) setTotals(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  const t = totals || { pacts: 0, witnesses: 0, redeemed: 0, saved: 0 };
  const STATS = [
    { label: 'Pacts signed', value: t.pacts, icon: ScrollText },
    { label: 'Witnesses', value: t.witnesses, icon: Users },
    { label: 'Souls redeemed', value: t.redeemed, icon: Flame },
    { label: 'Dollars saved', value: money(t.saved), icon: TrendingDown },
  ];
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-md items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-2 text-primary">
          <Sigil className="h-7 w-7 flicker" />
          <span className="font-heading text-[13px] uppercase tracking-[0.28em] text-foreground/80">
            Deal with the Devil
          </span>
        </div>
        <Link
          to="/ledger"
          className="font-heading text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
        >
          Ledger
        </Link>
      </header>

      <main className="mx-auto max-w-md px-6">
        <section className="pt-14 text-center">
          <p className="font-heading text-[10px] uppercase tracking-[0.42em] text-primary/80">
            Halloween season · seven days only
          </p>
          <h1 className="mt-5 font-display text-[42px] leading-[1.02] tracking-tight">
            Sell your soul
            <span className="block text-primary">for cheap</span>
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-foreground/70">
            Pick one habit. Halve what you usually spend on it. Sign in blood-red ink and let a
            friend watch. The devil takes the overage.
          </p>
        </section>

        <div className="mt-10">
          <Link
            to="/sign"
            className="ember-glow btn-ink flex w-full items-center justify-center gap-2 border-2 border-[#1e0f06] bg-primary px-6 py-4 font-heading text-[13px] uppercase tracking-[0.22em] text-primary-foreground hover:brightness-110"
          >
            <Flame className="h-4 w-4" />
            Sign the pact
          </Link>
          <Link
            to="/ledger"
            className="btn-ink mt-3 flex w-full items-center justify-center border-2 border-border px-6 py-3.5 font-heading text-[11px] uppercase tracking-[0.22em] text-foreground/60 hover:border-primary/60 hover:text-primary"
          >
            Consult the ledger
          </Link>
        </div>

        <section className="parchment mt-12">
          <div className="px-6 py-7">
            <h2 className="text-center font-heading text-[11px] uppercase tracking-[0.32em] ink-muted">
              The terms
            </h2>
            <ol className="mt-5 space-y-4">
              {[
                'Name your habit and your weekly limit.',
                'The devil drafts a contract in his own voice.',
                'Sign it. A friend countersigns as witness.',
                'Log every sin, or proudly log a clean day.',
                'Go over your limit and your soul is forfeit.',
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-[3px] font-heading text-[13px] ink-muted">{i + 1}.</span>
                  <span className="text-[15px] leading-snug ink">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-9 grid grid-cols-2 gap-2.5">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="ink-card bg-card/70 px-4 py-4">
              <Icon className="h-3.5 w-3.5 text-primary/70" />
              <p className="mt-3 font-heading text-2xl tracking-tight">{value}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </section>
        <p className="mt-3 text-center text-[11px] text-muted-foreground/60">
          Live totals across all pacts. Starts at zero.
        </p>
      </main>

      <Footer />
    </div>
  );
}