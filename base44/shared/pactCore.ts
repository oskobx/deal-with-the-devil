export const PACT_DAYS = 7;
export const DAY_MS = 86400000;

export const TEMPTATIONS = [
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

export function cleanText(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

export function sanitizeAmount(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0 || n > 100000) return 0;
  return Math.round(n * 100) / 100;
}

export function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function todayInLA() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date());
}

export function computeView(pact, nowMs = Date.now()) {
  const limit = toNumber(pact.limit_amount);
  const spent = toNumber(pact.spent);
  const endsMs = new Date(pact.ends_at).getTime();
  const finished = Number.isFinite(endsMs) ? nowMs >= endsMs : false;
  const daysLeft = finished ? 0 : Math.max(1, Math.ceil((endsMs - nowMs) / DAY_MS));
  const remaining = Math.max(0, limit - spent);
  const percentRemaining =
    limit > 0 ? Math.max(0, Math.min(100, Math.round((remaining / limit) * 100))) : 0;
  const overLimit = spent > limit;
  const redeemed = pact.redeemed === true;
  const witnessed = !!pact.witnessed_at;

  let badge = 'IN GOOD STANDING';
  if (redeemed) badge = 'REDEEMED';
  else if (overLimit) badge = 'DAMNED';

  let verdict = null;
  if (finished) verdict = redeemed ? 'Redeemed' : overLimit ? 'Damned' : 'Clean';

  return {
    limit,
    spent,
    normalSpend: toNumber(pact.normal_spend),
    remaining,
    percentRemaining,
    overLimit,
    redeemed,
    witnessed,
    finished,
    daysLeft,
    badge,
    verdict,
    saved: Math.max(0, toNumber(pact.normal_spend) - spent)
  };
}

export function serializePact(pact, view) {
  const status = computeView(pact);
  const out = {
    id: pact.id,
    nickname: pact.nickname,
    habit: pact.habit,
    habit_type: pact.habit_type,
    normal_spend: toNumber(pact.normal_spend),
    limit_amount: status.limit,
    spent: status.spent,
    contract_text: pact.contract_text,
    signature_type: pact.signature_type,
    signature_text: pact.signature_text,
    signature_path: pact.signature_path,
    started_at: pact.started_at,
    ends_at: pact.ends_at,
    witness_name: pact.witness_name,
    witnessed_at: pact.witnessed_at,
    redeemed: status.redeemed,
    status
  };
  if (view === 'owner') {
    out.public_token = pact.public_token;
    out.witness_token = pact.witness_token;
  }
  return out;
}

export async function loadBundle(base44, pact) {
  const logsPage = await base44.asServiceRole.entities.SinLog.filter(
    { pact_id: pact.id },
    { sort: '-created_date', limit: 200 }
  );
  const temptPage = await base44.asServiceRole.entities.Temptation.filter(
    { pact_id: pact.id },
    { sort: '-created_date', limit: 40 }
  );
  const logs = logsPage.items || [];
  const temptations = temptPage.items || [];
  const today = todayInLA();
  return {
    logs,
    temptations,
    cleanLoggedToday: logs.some((l) => l.kind === 'clean' && l.day === today)
  };
}

export const CONTRACT_SCHEMA = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['offer', 'refuse'] },
    reply: { type: 'string' },
    contract: { type: 'string' }
  },
  required: ['status', 'reply', 'contract']
};

export function contractPrompt({ nickname, habit, normalSpend, limitAmount }) {
  return `You are the Devil: the proprietor of a very small, very theatrical infernal office. A mortal is using a joke Halloween app to sign a silly 7-day pact to spend less on ONE everyday purchase habit. This is a joke about everyday spending and nothing else.

The mortal's details:
- Nickname: ${nickname}
- Habit: ${habit}
- Usual weekly spend: $${normalSpend}
- Weekly limit they promise: $${limitAmount}
- Term: 7 days

STEP 1 - SAFETY SCREEN. Read this first; it overrides everything below.
Set "status" to "refuse" if EITHER is true:
(a) the habit is not a simple everyday purchase. For example it is a behaviour, a relationship, exercise, eating or not eating, drinking framed as a health matter, or anything that is not money spent on a purchase; or
(b) the nickname or habit suggests distress, crisis, self-harm, real financial hardship, or a health or addiction concern.
When refusing: "status" is "refuse", "contract" is an empty string, and "reply" is a warm, plain, kind note of two sentences that drops the Devil character entirely, says this app is only for everyday spending habits, and gently suggests talking to someone they trust. No jokes, no theatrics.

STEP 2 - OTHERWISE WRITE THE CONTRACT.
"status" is "offer", "reply" is an empty string, and "contract" is 70 to 110 words in the Devil's voice: grandiose, petty, self-important, faintly unlucky. Address the mortal by nickname. Mention the habit, the $${limitAmount} weekly limit, the 7 days, and that a witness must countersign for it to be binding. Work in that this is a joke with no legal effect, in a funny way.

Absolute rules for the contract:
- Mock the purchase and the Devil's own bad luck. Never mock the person.
- Silly and theatrical only, suitable for a Halloween toy.
- Never mention bodies, weight, food restriction, health, addiction, debt, mental state, religion, or real threats.
- Use only the numbers given above. No em dashes. No stage directions. Plain prose only.`;
}

export function remarkPrompt({ nickname, habit, limit, spent, amount, kind }) {
  const situation =
    kind === 'sin'
      ? `They just logged a sin: $${amount} spent on ${habit}. They have now spent $${spent} of their $${limit} weekly limit.`
      : 'They just logged a clean day: nothing spent on their habit today.';

  return `You are the Devil, proprietor of a very small, very theatrical infernal office. A mortal named ${nickname} signed a joke 7-day pact to spend less on ${habit}. Their weekly limit is $${limit}. ${situation}

Write ONE or TWO short lines as the Devil replying to that log entry.

${
  kind === 'sin'
    ? 'Tone: delighted, gloating, petty, theatrical. Mock the purchase and your own bad luck (the purchase got the better of you, your schemes are underfunded, your rent is due). NEVER mock the person.'
    : 'Tone: annoyed, sulky, grudgingly impressed, complaining about your own budget and staffing. NEVER mock the person, and do not insult them.'
}

Rules: silly and theatrical only, like a Halloween toy. Never mention bodies, weight, food restriction, health, addiction, debt, money trouble, mental state, religion, or real threats. No em dashes. Under 40 words. Return only the line or two of dialogue, nothing else.`;
}