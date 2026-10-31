import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Loader2, PenLine, Hand } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Sigil from '@/components/Sigil';
import Footer from '@/components/Footer';
import EmberBurst from '@/components/EmberBurst';
import SignaturePad from '@/components/SignaturePad';
import { HABIT_OPTIONS, money } from '@/lib/format';

const field =
  'w-full rounded-sm border border-border bg-background px-3 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary/70';
const label = 'font-heading text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground';

export default function Sign() {
  const navigate = useNavigate();
  const [stage, setStage] = useState('form');
  const [habitType, setHabitType] = useState('');
  const [customHabit, setCustomHabit] = useState('');
  const [nickname, setNickname] = useState('');
  const [normal, setNormal] = useState('');
  const [limit, setLimit] = useState('');
  const [limitTouched, setLimitTouched] = useState(false);
  const [contract, setContract] = useState('');
  const [refusal, setRefusal] = useState('');
  const [sigMode, setSigMode] = useState('typed');
  const [sigText, setSigText] = useState('');
  const [sigPath, setSigPath] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [burning, setBurning] = useState(false);

  const habit =
    habitType === 'custom'
      ? customHabit.trim()
      : HABIT_OPTIONS.find((h) => h.id === habitType)?.label || '';

  const onNormal = (raw) => {
    const value = raw.replace(/[^0-9.]/g, '');
    setNormal(value);
    if (!limitTouched) {
      const n = Number(value);
      setLimit(n > 0 ? String(Math.round((n / 2) * 100) / 100) : '');
    }
  };

  const onLimit = (raw) => {
    setLimitTouched(true);
    setLimit(raw.replace(/[^0-9.]/g, ''));
  };

  const validate = () => {
    if (!habit) return 'Choose the habit you are forswearing.';
    if (!nickname.trim()) return 'The devil needs a nickname to address you by.';
    const n = Number(normal);
    if (!Number.isFinite(n) || n <= 0) return 'Enter your normal weekly spend.';
    const l = Number(limit);
    if (!Number.isFinite(l) || l <= 0) return 'Enter a weekly limit above zero.';
    if (l >= n) return 'The limit must be lower than your normal weekly spend.';
    return '';
  };

  const draft = async () => {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setBusy('draft');
    try {
      const res = await base44.functions.invoke('draftContract', {
        nickname: nickname.trim(),
        habit,
        habit_type: habitType || 'custom',
        normal_spend: Number(normal),
        limit_amount: Number(limit)
      });
      if (res.data.status === 'refuse') {
        setRefusal(res.data.reply);
        setStage('refused');
      } else {
        setContract(res.data.contract);
        setStage('contract');
      }
    } catch (e) {
      setError(e?.response?.data?.error || 'The devil is not answering. Try again.');
    } finally {
      setBusy('');
    }
  };

  const seal = async () => {
    if (sigMode === 'typed' && !sigText.trim()) {
      setError('Type your signature to seal it.');
      return;
    }
    if (sigMode === 'drawn' && sigPath.length < 20) {
      setError('Draw your signature to seal it.');
      return;
    }
    setError('');
    setBusy('seal');
    setBurning(true);
    try {
      const res = await base44.functions.invoke('createPact', {
        nickname: nickname.trim(),
        habit,
        habit_type: habitType || 'custom',
        normal_spend: Number(normal),
        limit_amount: Number(limit),
        contract_text: contract,
        signature_type: sigMode,
        signature_text: sigMode === 'typed' ? sigText.trim() : '',
        signature_path: sigMode === 'drawn' ? sigPath : ''
      });
      navigate(`/p/${res.data.pact.public_token}`, { state: { fresh: true }, replace: true });
    } catch (e) {
      setError(e?.response?.data?.error || 'The ink did not take. Try again.');
      setBurning(false);
      setBusy('');
    }
  };

  return (
    <div className="min-h-screen">
      <EmberBurst active={burning} />
      <header className="mx-auto flex max-w-md items-center gap-3 px-6 pt-8">
        <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Sigil className="h-6 w-6 text-primary" />
        <span className="font-heading text-[10px] uppercase tracking-[0.26em] text-foreground/70">
          Sign the pact
        </span>
      </header>

      <main className="mx-auto max-w-md px-6 pb-4">
        {stage === 'form' && (
          <div className="rise">
            <h1 className="mt-8 font-display text-[34px] leading-[1.05] tracking-tight">
              What are you
              <span className="block text-primary">forswearing?</span>
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/65">
              One habit. Seven days. A limit you will almost certainly break.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-2">
              {HABIT_OPTIONS.map((h) => {
                const active = habitType === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setHabitType(h.id)}
                    className={
                      active
                        ? 'rounded-sm border border-primary bg-primary/15 px-3 py-3 text-left font-heading text-[11px] uppercase tracking-[0.14em] text-primary transition-all'
                        : 'rounded-sm border border-border bg-card/40 px-3 py-3 text-left font-heading text-[11px] uppercase tracking-[0.14em] text-foreground/70 transition-all hover:border-primary/40 hover:text-foreground'
                    }
                  >
                    {h.label}
                  </button>
                );
              })}
            </div>

            {habitType === 'custom' && (
              <div className="mt-3">
                <input
                  value={customHabit}
                  onChange={(e) => setCustomHabit(e.target.value)}
                  placeholder="Your spending habit"
                  maxLength={60}
                  className={field}
                  aria-label="Your own spending habit"
                />
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label className={label} htmlFor="nickname">
                  Your infernal nickname
                </label>
                <input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Morticia"
                  maxLength={40}
                  className={`${field} mt-2`}
                />
              </div>

              <div>
                <label className={label} htmlFor="normal">
                  Normal weekly spend
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground">
                    $
                  </span>
                  <input
                    id="normal"
                    value={normal}
                    onChange={(e) => onNormal(e.target.value)}
                    inputMode="decimal"
                    placeholder="70"
                    className={`${field} pl-7`}
                  />
                </div>
              </div>

              <div>
                <label className={label} htmlFor="limit">
                  Weekly limit you promise
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground">
                    $
                  </span>
                  <input
                    id="limit"
                    value={limit}
                    onChange={(e) => onLimit(e.target.value)}
                    inputMode="decimal"
                    placeholder="35"
                    className={`${field} pl-7`}
                  />
                </div>
                <p className="mt-1.5 text-[11.5px] text-muted-foreground/70">
                  Half of normal, as the devil prefers.
                </p>
              </div>
            </div>

            {error && <p className="mt-4 text-[13px] text-[#ff8a5c]">{error}</p>}

            <button
              type="button"
              onClick={draft}
              disabled={!!busy}
              className="ember-glow mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-4 font-heading text-[11.5px] uppercase tracking-[0.22em] text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
            >
              {busy === 'draft' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  The devil is writing
                </>
              ) : (
                <>
                  <Flame className="h-4 w-4" />
                  Draft the contract
                </>
              )}
            </button>
          </div>
        )}

        {stage === 'refused' && (
          <div className="rise">
            <div className="mt-10 rounded-sm border border-border bg-card px-6 py-7">
              <Sigil className="h-8 w-8 text-muted-foreground" />
              <p className="mt-4 text-[16px] leading-relaxed text-foreground/85">{refusal}</p>
              <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                No pact was signed, and nothing was saved.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStage('form');
                setRefusal('');
                setHabitType('');
                setCustomHabit('');
              }}
              className="mt-5 w-full rounded-sm border border-border px-6 py-3.5 font-heading text-[10.5px] uppercase tracking-[0.2em] text-foreground/75 transition-colors hover:border-primary/50 hover:text-primary"
            >
              Back
            </button>
          </div>
        )}

        {stage === 'contract' && (
          <div className="rise">
            <p className="mt-8 text-center font-heading text-[9.5px] uppercase tracking-[0.36em] text-primary/80">
              Read it carefully
            </p>
            <h1 className="mt-3 text-center font-display text-[28px] leading-tight">
              The contract
            </h1>

            <div className="parchment mt-6 rounded-sm">
              <div className="px-6 py-7">
                <p className="whitespace-pre-line text-[15.5px] leading-[1.68] ink">{contract}</p>
                <div className="my-5 h-px bg-[#c2a679]/60" />
                <p className="text-[12.5px] ink-muted">
                  {money(Number(normal))} normally · {money(Number(limit))} limit · 7 days
                </p>
              </div>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between">
                <span className={label}>Your signature</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setSigMode('typed')}
                    className={
                      sigMode === 'typed'
                        ? 'inline-flex items-center gap-1.5 rounded-sm border border-primary/60 bg-primary/10 px-2.5 py-1 font-heading text-[9px] uppercase tracking-[0.16em] text-primary'
                        : 'inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1 font-heading text-[9px] uppercase tracking-[0.16em] text-muted-foreground'
                    }
                  >
                    <PenLine className="h-3 w-3" />
                    Type
                  </button>
                  <button
                    type="button"
                    onClick={() => setSigMode('drawn')}
                    className={
                      sigMode === 'drawn'
                        ? 'inline-flex items-center gap-1.5 rounded-sm border border-primary/60 bg-primary/10 px-2.5 py-1 font-heading text-[9px] uppercase tracking-[0.16em] text-primary'
                        : 'inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1 font-heading text-[9px] uppercase tracking-[0.16em] text-muted-foreground'
                    }
                  >
                    <Hand className="h-3 w-3" />
                    Draw
                  </button>
                </div>
              </div>

              <div className="mt-2">
                {sigMode === 'typed' ? (
                  <input
                    value={sigText}
                    onChange={(e) => setSigText(e.target.value)}
                    placeholder="Type your name"
                    maxLength={60}
                    className="w-full rounded-sm border border-[#c2a679] bg-[#f4e9d2] px-4 py-6 text-center font-display text-[26px] italic text-[#5a2410] outline-none placeholder:not-italic placeholder:text-[15px] placeholder:text-[#b39a74] focus:border-[#8a4a20]"
                    aria-label="Type your signature"
                  />
                ) : (
                  <SignaturePad value={sigPath} onChange={setSigPath} />
                )}
              </div>

              {error && <p className="mt-3 text-[13px] text-[#ff8a5c]">{error}</p>}

              <button
                type="button"
                onClick={seal}
                disabled={!!busy}
                className="ember-glow mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-4 font-heading text-[11.5px] uppercase tracking-[0.22em] text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
              >
                {busy === 'seal' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sealing
                  </>
                ) : (
                  <>
                    <Flame className="h-4 w-4" />
                    Seal the pact
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground/60">
                Seven days begin the moment you seal it.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}