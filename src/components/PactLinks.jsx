import { useState } from 'react';
import { Copy, Check, Link2 } from 'lucide-react';
import { copyText } from '@/lib/clipboard';

function CopyRow({ label, hint, value }) {
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    const ok = await copyText(value);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-sm border border-border bg-card/60 px-4 py-3.5">
      <p className="font-heading text-[9.5px] uppercase tracking-[0.24em] text-primary/80">{label}</p>
      <p className="mt-1.5 break-all text-[12px] leading-snug text-muted-foreground">{value}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[11px] text-muted-foreground/70">{hint}</span>
        <button
          type="button"
          onClick={handle}
          className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 font-heading text-[9.5px] uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:border-primary/60 hover:text-primary"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

export default function PactLinks({ pact }) {
  if (!pact) return null;
  const origin = window.location.origin;
  const privateUrl = `${origin}/p/${pact.public_token}`;
  const witnessUrl = `${origin}/w/${pact.witness_token}`;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2">
        <Link2 className="h-3.5 w-3.5 text-primary/70" />
        <h2 className="font-heading text-[10px] uppercase tracking-[0.3em] text-foreground/70">
          Your two links
        </h2>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        Bookmark the first for yourself. Send the second to a friend, who must countersign. The app
        sends no messages, so pass them along yourself.
      </p>
      <div className="mt-3 space-y-2.5">
        <CopyRow label="Your private pact link" hint="Keep this one" value={privateUrl} />
        <CopyRow label="Witness link" hint="Send to a friend" value={witnessUrl} />
      </div>
    </section>
  );
}