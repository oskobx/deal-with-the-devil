import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { cleanText, DAY_MS, PACT_DAYS, serializePact, loadBundle } from '../../shared/pactCore.ts';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const nickname = cleanText(body.nickname, 40);
    const habit = cleanText(body.habit, 60);
    const habitType = cleanText(body.habit_type, 40) || 'custom';
    const contractText = typeof body.contract_text === 'string' ? body.contract_text.trim() : '';
    const normalSpend = Math.round(Number(body.normal_spend) * 100) / 100;
    const limitAmount = Math.round(Number(body.limit_amount) * 100) / 100;
    const signatureType = body.signature_type === 'drawn' ? 'drawn' : 'typed';
    const signatureText = cleanText(body.signature_text, 60);
    const signaturePath =
      typeof body.signature_path === 'string' ? body.signature_path.slice(0, 16000) : '';

    if (!nickname) return Response.json({ error: 'Tell the devil what to call you.' }, { status: 400 });
    if (!habit) return Response.json({ error: 'Name the habit you are pawning.' }, { status: 400 });
    if (!Number.isFinite(normalSpend) || normalSpend <= 0 || normalSpend > 100000) {
      return Response.json({ error: 'Enter a normal weekly spend above zero.' }, { status: 400 });
    }
    if (!Number.isFinite(limitAmount) || limitAmount <= 0 || limitAmount > 100000) {
      return Response.json({ error: 'Enter a weekly limit above zero.' }, { status: 400 });
    }
    if (limitAmount >= normalSpend) {
      return Response.json(
        { error: 'The limit must be lower than your normal weekly spend.' },
        { status: 400 }
      );
    }
    if (contractText.length < 40 || contractText.length > 2000) {
      return Response.json({ error: 'The contract got lost in the smoke. Try again.' }, { status: 400 });
    }
    if (signatureType === 'typed' && !signatureText) {
      return Response.json({ error: 'Type your signature to seal it.' }, { status: 400 });
    }
    if (signatureType === 'drawn' && signaturePath.length < 20) {
      return Response.json({ error: 'Draw your signature to seal it.' }, { status: 400 });
    }

    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + PACT_DAYS * DAY_MS);

    const pact = await base44.asServiceRole.entities.Pact.create({
      public_token: crypto.randomUUID().replace(/-/g, ''),
      witness_token: crypto.randomUUID().replace(/-/g, ''),
      nickname,
      habit,
      habit_type: habitType,
      normal_spend: normalSpend,
      limit_amount: limitAmount,
      spent: 0,
      contract_text: contractText,
      signature_type: signatureType,
      signature_text: signatureType === 'typed' ? signatureText : '',
      signature_path: signatureType === 'drawn' ? signaturePath : '',
      started_at: startedAt.toISOString(),
      ends_at: endsAt.toISOString(),
      witnessed_at: '',
      redeemed: false
    });

    const bundle = await loadBundle(base44, pact);

    return Response.json({
      pact: serializePact(pact, 'owner'),
      ...bundle
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}