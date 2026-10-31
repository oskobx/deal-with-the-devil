import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Flame, Loader2, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import DevilImp from '@/components/DevilImp';
import Footer from '@/components/Footer';
import PactHeader from '@/components/PactHeader';
import PactScroll from '@/components/PactScroll';
import SoulMeter from '@/components/SoulMeter';
import SinList from '@/components/SinList';
import VerdictCard from '@/components/VerdictCard';

const TEMPTATIONS = [
  'One little burrito...',
  'It is basically a salad with extra steps.',
  'Treat yourself, you are only mortal once.',
  'The delivery fee is practically a rounding error.',
  'Just one iced coffee. The weather demanded it.',
  'A rideshare is cheaper than regret.',
  'You have earned it. (You have not.)',
  'It was on sale, which means you saved money.',
  'Nobody will know. I will know, but I am on your side.',
  'The app had a little flame icon. You had no choice.'
];

export default function Witness() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');

  useEffect(() => {
    let alive = true;
    base44.functions
      .invoke('getPact', { token, view: 'witness' })
      .then((res) => {
        if (!alive) return;
        setData(res.data);
        setState('ready');
      })
      .catch(() => {
        if (alive) setState('missing');
      });
    return () => {
      alive = false;
    };
  }, [token]);

  const act = async (action, payload) => {
    setError('');
    setBusy(action);
    try {
      const res = await base44.functions.invoke('pactAction', {
        action,
        token,
        view: 'witness',
        ...payload
      });
      setData(res.data);
      return true;
    } catch (e) {
      setError(e?.response?.data?.error || 'That did not take. Try again.');
      return false;
    } finally {
      setBusy('');
    }
  };

  const countersign = async () => {
    if (!name.trim()) {
      setError('Add a nickname to countersign.');
      return;
    }
    const ok = await act('countersign', { nickname: name.trim() });
    if (ok) setName('');
  };

  const tempt = async (message) => {
    const ok = await act('tempt', { message });
    if (ok) {
      setSent(message);
      setTimeout(() => setSent(''), 2200);
    }
  };

  const header = (
    <header className="mx-auto flex max-w-md items-center gap-3 px-6 pt-8">
      <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <DevilImp className="h-8 w-8 -rotate-3" />
      <span className="font-heading text-[10px] uppercase tracking-[0.26em] text-foreground/70">
        Witness
      </span>
    </header>
  );

  if (state !== 'ready') {
    return (
      <div className="min-h-screen">
        {header}
        <main className="mx-auto max-w-md px-6 pt-16">
          {state === 'loading' ? (
            <p className="text-center text-[14px] text-muted-foreground">Opening the witness box…</p>
          ) : (
            <div className="ink-card bg-card px-6 py-7 text-center">
              <DevilImp className="mx-auto h-20 w-20 -rotate-2" />
              <h1 className="mt-4 font-display text-[24px]">This witness link is dead</h1>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                No pact answers to that code. Ask your friend to send the witness link again.
              </p>
              <Link
                to="/sign"
                className="btn-ink mt-5 inline-block border-2 border-[#1e0f06] bg-primary px-5 py-3 font-heading text-[10.5px] uppercase tracking-[0.2em] text-primary-foreground"
              >
                Sign your own pact
              </Link>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  const { pact } = data;
  const status = pact.status;
  const canTempt = status.witnessed && !status.finished;

  return (
    <div className="min-h-screen">
      {header}
      <main className="mx-auto max-w-md px-6">
        {!status.witnessed && (
          <section className="rise parchment mt-6">
            <div className="px-6 py-6">
              <p className="font-heading text-[9px] uppercase tracking-[0.3em] ink-muted">
                You have been summoned
              </p>
              <h1 className="mt-2 font-display text-[25px] leading-tight ink">
                Countersign this pact
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed ink-muted">
                {pact.nickname} has sworn off overspending on {pact.habit}. Add your nickname to
                make it official, then you may meddle freely.
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your nickname"
                maxLength={40}
                aria-label="Your witness nickname"
                className="mt-4 w-full rounded-sm border border-[#c2a679] bg-[#f8f0dd] px-3 py-3 text-[15px] text-[#2c1c0e] outline-none placeholder:text-[#b39a74] focus:border-[#8a4a20]"
              />
              <button
                type="button"
                onClick={countersign}
                disabled={!!busy}
                className="btn-ink mt-3 inline-flex w-full items-center justify-center gap-2 border-2 border-[#2a1206] bg-[#5a2410] px-5 py-3.5 font-heading text-[10.5px] uppercase tracking-[0.18em] text-[#f8f0dd] hover:opacity-90 disabled:opacity-60"
              >
                {busy === 'countersign' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Countersign as witness
              </button>
              {error && <p className="mt-2 text-[12.5px] text-[#8a2a10]">{error}</p>}
            </div>
          </section>
        )}

        <PactHeader pact={pact} />

        <div className="ink-card mt-6 bg-card/70 px-5 py-5">
          <SoulMeter percent={status.percentRemaining} spent={status.spent} limit={status.limit} />
        </div>

        {status.overLimit && !status.redeemed && (
          <div className="ink-card mt-4 border-primary/50 bg-primary/[0.1] px-5 py-4">
            <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#ff9a6a]">
              Damned
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground/80">
              {pact.nickname} has blown through the limit. The devil is insufferable about it.
            </p>
          </div>
        )}

        <VerdictCard pact={pact} />

        {canTempt && (
          <section className="mt-8">
            <h2 className="font-heading text-[10px] uppercase tracking-[0.28em] text-primary/80">
              Whisper a temptation
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Tap one. It appears on {pact.nickname}'s pact page and nowhere else.
            </p>
            <div className="mt-3 space-y-2">
              {TEMPTATIONS.map((message) => (
                <button
                  key={message}
                  type="button"
                  onClick={() => tempt(message)}
                  disabled={!!busy}
                  className="flex w-full items-center justify-between gap-3 rounded-[14px] border-2 border-border bg-card/60 px-4 py-3 text-left text-[14px] italic text-foreground/85 transition-colors hover:border-primary/60 hover:text-foreground disabled:opacity-50"
                >
                  <span>{message}</span>
                  {busy === 'tempt' ? (
                    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-primary/70" />
                  ) : (
                    <Flame className="h-3.5 w-3.5 shrink-0 text-primary/50" />
                  )}
                </button>
              ))}
            </div>
            {sent && <p className="mt-2 text-[12.5px] text-primary">Whispered: “{sent}”</p>}
            {error && <p className="mt-2 text-[12.5px] text-[#ff8a5c]">{error}</p>}
          </section>
        )}

        <PactScroll pact={pact} />

        <SinList logs={data.logs} />

        <section className="mt-9">
          <Link
            to="/sign"
            className="btn-ink flex w-full items-center justify-center gap-2 border-2 border-primary/50 bg-primary/[0.1] px-6 py-4 font-heading text-[10.5px] uppercase tracking-[0.18em] text-primary hover:bg-primary/[0.16]"
          >
            <Flame className="h-3.5 w-3.5" />
            Sign your own pact
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}