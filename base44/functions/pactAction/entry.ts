import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import {
  cleanText,
  sanitizeAmount,
  todayInLA,
  computeView,
  serializePact,
  loadBundle,
  remarkPrompt,
  TEMPTATIONS
} from '../../shared/pactCore.ts';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const action = typeof body.action === 'string' ? body.action : '';
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    const view = body.view === 'witness' ? 'witness' : 'owner';

    if (!token) return Response.json({ error: 'Missing link code.' }, { status: 400 });

    const ownerActions = ['log_sin', 'log_clean', 'redeem'];
    const witnessActions = ['countersign', 'tempt'];
    if (![...ownerActions, ...witnessActions].includes(action)) {
      return Response.json({ error: 'Unknown action.' }, { status: 400 });
    }

    const isOwnerAction = ownerActions.includes(action);
    const query = isOwnerAction ? { public_token: token } : { witness_token: token };
    const found = await base44.asServiceRole.entities.Pact.filter(query, { limit: 1 });
    const pact = (found.items || [])[0];

    if (!pact) return Response.json({ error: 'No such pact.' }, { status: 404 });

    const status = computeView(pact);
    let updated = pact;

    if (action === 'log_sin') {
      if (status.finished) {
        return Response.json({ error: 'This pact has concluded. The paperwork is filed.' }, { status: 400 });
      }
      const amount = sanitizeAmount(body.amount);
      if (!amount) {
        return Response.json({ error: 'Enter an amount above zero.' }, { status: 400 });
      }
      const label = cleanText(body.label, 60) || pact.habit;
      const spent = Math.round((status.spent + amount) * 100) / 100;

      const remark = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: remarkPrompt({
          nickname: pact.nickname,
          habit: pact.habit,
          limit: status.limit,
          spent,
          amount,
          kind: 'sin'
        })
      });

      await base44.asServiceRole.entities.SinLog.create({
        pact_id: pact.id,
        kind: 'sin',
        amount,
        day: todayInLA(),
        label,
        devil_reply: String(remark || '').trim()
      });

      updated = await base44.asServiceRole.entities.Pact.update(pact.id, { spent });
    }

    if (action === 'log_clean') {
      if (status.finished) {
        return Response.json({ error: 'This pact has concluded. The paperwork is filed.' }, { status: 400 });
      }
      const today = todayInLA();
      const existing = await base44.asServiceRole.entities.SinLog.filter(
        { pact_id: pact.id, kind: 'clean', day: today },
        { limit: 1 }
      );
      if ((existing.items || []).length > 0) {
        return Response.json({ error: 'You already logged a clean day today.' }, { status: 400 });
      }

      const remark = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: remarkPrompt({
          nickname: pact.nickname,
          habit: pact.habit,
          limit: status.limit,
          spent: status.spent,
          amount: 0,
          kind: 'clean'
        })
      });

      await base44.asServiceRole.entities.SinLog.create({
        pact_id: pact.id,
        kind: 'clean',
        amount: 0,
        day: today,
        label: 'A clean day',
        devil_reply: String(remark || '').trim()
      });
    }

    if (action === 'redeem') {
      if (!status.overLimit) {
        return Response.json({ error: 'You have not overspent. Your soul is not in question.' }, { status: 400 });
      }
      if (status.redeemed) {
        return Response.json({ error: 'Your good deed is already on record.' }, { status: 400 });
      }
      updated = await base44.asServiceRole.entities.Pact.update(pact.id, {
        redeemed: true,
        redeemed_at: new Date().toISOString()
      });
    }

    if (action === 'countersign') {
      if (status.witnessed) {
        return Response.json({ error: 'A witness already signed this pact.' }, { status: 400 });
      }
      const witnessName = cleanText(body.nickname, 40);
      if (!witnessName) {
        return Response.json({ error: 'Add a nickname to countersign.' }, { status: 400 });
      }
      updated = await base44.asServiceRole.entities.Pact.update(pact.id, {
        witness_name: witnessName,
        witnessed_at: new Date().toISOString()
      });
    }

    if (action === 'tempt') {
      if (!status.witnessed) {
        return Response.json({ error: 'Countersign first, then you may meddle.' }, { status: 400 });
      }
      if (status.finished) {
        return Response.json({ error: 'The pact has concluded. Your meddling is over.' }, { status: 400 });
      }
      const message = cleanText(body.message, 200);
      if (!TEMPTATIONS.includes(message)) {
        return Response.json({ error: 'That temptation is not in the script.' }, { status: 400 });
      }
      await base44.asServiceRole.entities.Temptation.create({
        pact_id: pact.id,
        message,
        witness_name: pact.witness_name || ''
      });
    }

    const bundle = await loadBundle(base44, updated);
    return Response.json({ pact: serializePact(updated, view), ...bundle });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}