import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Sigil from '@/components/Sigil';
import Footer from '@/components/Footer';
import PactHeader from '@/components/PactHeader';
import PactScroll from '@/components/PactScroll';
import SoulMeter from '@/components/SoulMeter';
import PactLinks from '@/components/PactLinks';
import LogSpend from '@/components/LogSpend';
import SinList from '@/components/SinList';
import TemptationList from '@/components/TemptationList';
import DamnedPanel from '@/components/DamnedPanel';
import VerdictCard from '@/components/VerdictCard';

export default function Pact() {
  const { token } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading');
  const [flash, setFlash] = useState('');

  useEffect(() => {
    let alive = true;
    setState('loading');
    base44.functions
      .invoke('getPact', { token, view: 'owner' })
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

  const header = (
    <header className="mx-auto flex max-w-md items-center gap-3 px-6 pt-8">
      <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <Sigil className="h-6 w-6 text-primary" />
      <span className="font-heading text-[10px] uppercase tracking-[0.26em] text-foreground/70">
        Your pact
      </span>
    </header>
  );

  if (state !== 'ready') {
    return (
      <div className="min-h-screen">
        {header}
        <main className="mx-auto max-w-md px-6 pt-16">
          {state === 'loading' ? (
            <p className="text-center text-[14px] text-muted-foreground">Consulting the archive…</p>
          ) : (
            <div className="rounded-sm border border-border bg-card px-6 py-7 text-center">
              <Sigil className="mx-auto h-9 w-9 text-muted-foreground/60" />
              <h1 className="mt-4 font-display text-[24px]">This link leads nowhere</h1>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                No pact answers to that code. Check the link you bookmarked, or sign a fresh one.
              </p>
              <Link
                to="/sign"
                className="mt-5 inline-block rounded-sm bg-primary px-5 py-3 font-heading text-[10.5px] uppercase tracking-[0.2em] text-primary-foreground"
              >
                Sign a pact
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

  return (
    <div className="min-h-screen">
      {header}
      <main className="mx-auto max-w-md px-6">
        {location.state?.fresh && (
          <div className="rise mt-6 rounded-sm border border-primary/40 bg-primary/[0.08] px-5 py-4">
            <p className="font-heading text-[9.5px] uppercase tracking-[0.28em] text-primary">
              The pact is sealed
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/75">
              Bookmark your private link and send the witness link to a friend. Both are below.
            </p>
          </div>
        )}

        <PactHeader pact={pact} />

        <div className="mt-6 rounded-sm border border-border bg-card/60 px-5 py-5">
          <SoulMeter percent={status.percentRemaining} spent={status.spent} limit={status.limit} />
        </div>

        {flash && (
          <div className="rise mt-4 rounded-sm border border-primary/30 bg-primary/[0.06] px-5 py-4">
            <p className="font-heading text-[9px] uppercase tracking-[0.28em] text-primary/80">
              The devil says
            </p>
            <p className="mt-2 text-[15px] italic leading-relaxed text-foreground/90">{flash}</p>
          </div>
        )}

        <PactScroll pact={pact} />

        {status.overLimit && !status.redeemed && !status.finished && (
          <DamnedPanel
            token={token}
            onDone={(payload) => {
              setData(payload);
              setFlash('');
            }}
          />
        )}

        <VerdictCard pact={pact} />

        <PactLinks pact={pact} />

        <LogSpend
          token={token}
          cleanLoggedToday={data.cleanLoggedToday}
          disabled={status.finished}
          onDone={(payload) => {
            setData(payload);
            setFlash(payload.logs?.[0]?.devil_reply || '');
          }}
        />

        <TemptationList temptations={data.temptations} />

        <SinList logs={data.logs} />
      </main>

      <Footer />
    </div>
  );
}