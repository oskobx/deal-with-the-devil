import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { computeView, toNumber } from '../../shared/pactCore.ts';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    const [pacts, witnessed, redeemed] = await Promise.all([
      base44.asServiceRole.entities.Pact.count(),
      base44.asServiceRole.entities.Pact.count({ witnessed_at: { $exists: true } }),
      base44.asServiceRole.entities.Pact.count({ redeemed: true })
    ]);

    const page = await base44.asServiceRole.entities.Pact.filter({}, { sort: '-created_date', limit: 500 });
    const rows = page.items || [];

    let damned = 0;
    let saved = 0;
    for (const pact of rows) {
      const status = computeView(pact);
      if (status.finished && status.saved > 0) saved += status.saved;
      if (!status.finished && status.overLimit && !status.redeemed) damned += 1;
    }

    const recent = rows.slice(0, 12).map((pact) => ({
      nickname: pact.nickname,
      habit: pact.habit,
      badge: computeView(pact).badge,
      verdict: computeView(pact).verdict,
      finished: computeView(pact).finished
    }));

    return Response.json({
      totals: {
        pacts: pacts,
        witnesses: witnessed,
        damned,
        redeemed,
        donations: redeemed * 20,
        saved: Math.max(0, Math.round(saved * 100) / 100)
      },
      recent
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}