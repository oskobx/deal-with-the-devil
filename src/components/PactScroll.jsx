import SignatureMark from '@/components/SignatureMark';
import { shortDate } from '@/lib/format';

export default function PactScroll({ pact }) {
  const status = pact.status;
  return (
    <section className="parchment mt-8 rounded-sm">
      <div className="px-6 py-7">
        <div className="flex items-center justify-between">
          <p className="font-heading text-[9px] uppercase tracking-[0.3em] ink-muted">
            Pact of restraint
          </p>
          <p className="font-heading text-[9px] uppercase tracking-[0.18em] ink-muted">
            {shortDate(pact.started_at)} – {shortDate(pact.ends_at)}
          </p>
        </div>
        <div className="my-4 h-px bg-[#c2a679]/60" />
        <p className="whitespace-pre-line text-[15.5px] leading-[1.65] ink">
          {pact.contract_text}
        </p>
        <div className="my-5 h-px bg-[#c2a679]/60" />
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-heading text-[8.5px] uppercase tracking-[0.24em] ink-muted">
              Signed
            </p>
            <div className="mt-1">
              <SignatureMark pact={pact} />
            </div>
          </div>
          <div className="text-right">
            <p className="font-heading text-[8.5px] uppercase tracking-[0.24em] ink-muted">
              Witness
            </p>
            <p className="mt-2 font-display text-[17px] italic ink-muted">
              {status.witnessed ? pact.witness_name : 'Unwitnessed'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}