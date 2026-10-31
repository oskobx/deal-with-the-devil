export default function SignatureMark({ pact, className = '' }) {
  const drawn = pact?.signature_type === 'drawn' && pact?.signature_path;
  if (drawn) {
    return (
      <svg viewBox="0 0 300 120" className={`h-16 w-full max-w-[260px] ${className}`}>
        <path
          d={pact.signature_path}
          fill="none"
          stroke="#5a2410"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <span className={`font-display text-[26px] italic ink ${className}`}>
      {pact?.signature_text || pact?.nickname || ''}
    </span>
  );
}