import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { cleanText, contractPrompt, CONTRACT_SCHEMA } from '../../shared/pactCore.ts';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const nickname = cleanText(body.nickname, 40);
    const habit = cleanText(body.habit, 60);
    const habitType = cleanText(body.habit_type, 40) || 'custom';
    const normalSpend = Math.round(Number(body.normal_spend) * 100) / 100;
    const limitAmount = Math.round(Number(body.limit_amount) * 100) / 100;

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

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: contractPrompt({ nickname, habit, normalSpend, limitAmount }),
      response_json_schema: CONTRACT_SCHEMA
    });

    const status = result && result.status === 'refuse' ? 'refuse' : 'offer';
    const contract = cleanText(result && result.contract, 1400);

    if (status === 'refuse') {
      return Response.json({
        status: 'refuse',
        reply:
          cleanText(result && result.reply, 400) ||
          'This one is not something I will make a joke contract about. This app is only for everyday spending habits, and talking to someone you trust is worth more than any devil. Take care of yourself.'
      });
    }

    if (contract.length < 40) {
      return Response.json({ error: 'The devil lost his quill. Try again.' }, { status: 502 });
    }

    return Response.json({ status: 'offer', contract });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}