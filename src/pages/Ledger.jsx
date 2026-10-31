import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Flame } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Sigil from '@/components/Sigil';
import Footer from '@/components/Footer';
import { money } from '@/lib/format';

const EMPTY = {
  pacts: 0,
  witnesses: 0,
  damned: 0,
  redeemed: 0,
  donations: 0,
  saved: 0
};

export default function Ledger() {
  const [totals, setTotals] = useState(null);
  const [recent, setRecent] = useState([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    base44.functions
      .invoke('ledgerStats', {})
      .then((res) => {
        if (!alive) return;
        setTotals(res.data.totals);
        setRecent(res.data.recent || []);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const shown = totals || EMPTY;
  const tiles = [
    { label: 'Pacts signed', value: shown.pacts },
    { label: 'Witnesses signed', value: shown.witnesses },
    { label: 'Souls currently damned', value: shown.damned },
    { label: 'Souls redeemed', value: shown.redeemed },
    { label: 'Reported donations', value: money(shown.donations) },
    { label: 'Dollars saved', value: money(shown.saved) }
  ];

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-md items-center gap-3 px-6 pt-8">
        <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Sigil className="h-6 w-6 text-primary" />
        <h1 className="font-heading text-[11px] uppercase tracking-[0.28em] text-foreground/80">
          The Ledger
        </h1>
      </header>

      <main className="mx-auto max-w-md px-6 pt-9">
        <h2 className="font-display text-[30px] leading-tight">Every soul, tallied</h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/60">
          Live totals from every pact ever sealed. Nicknames only, no names.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-2.5">
          {tiles.map((t) => (
            <div key={t.label} className="ink-card bg-card/70 px-4 py-4">
              <p className="font-heading text-2xl tracking-tight">{t.value}</p>
              <p className="mt-1 text-[10.5px] uppercase leading-snug tracking-[0.14em] text-muted-foreground">
                {t.label}
              </p>
            </div>
          ))}
        </div>

        {failed && (
          <p className="mt-3 text-center text-[12px] text-muted-foreground/70">
            The ledger is smudged. Pull to refresh in a moment.
          </p>
        )}

        <section className="mt-9">
          <h2 className="font-heading text-[10px] uppercase tracking-[0.32em] text-primary/80">
            Recent pacts
          </h2>
          {recent.length === 0 ? (
            <div className="mt-3 rounded-[16px] border-2 border-dashed border-border px-5 py-6 text-center">
              <p className="text-[13.5px] text-muted-foreground">
                No pacts yet. The ledger starts at zero.
              </p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-border border-y border-border">
              {recent.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] text-foreground/85">{r.nickname}</p>
                    <p className="truncate text-[12px] text-muted-foreground">{r.habit}</p>
                  </div>
                  <span className="shrink-0 font-heading text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                    {r.verdict || r.badge}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <Link
          to="/sign"
          className="btn-ink mt-9 flex w-full items-center justify-center gap-2 border-2 border-[#1e0f06] bg-primary px-6 py-4 font-heading text-[10.5px] uppercase tracking-[0.18em] text-primary-foreground hover:brightness-110"
        >
          <Flame className="h-3.5 w-3.5" />
          Add your soul to the ledger
        </Link>
      </main>

      <Footer />
    </div>
  );
}