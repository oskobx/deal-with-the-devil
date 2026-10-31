import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { serializePact, loadBundle } from '../../shared/pactCore.ts';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    const view = body.view === 'witness' ? 'witness' : 'owner';

    if (!token) return Response.json({ error: 'Missing link code.' }, { status: 400 });

    const query = view === 'witness' ? { witness_token: token } : { public_token: token };
    const page = await base44.asServiceRole.entities.Pact.filter(query, { limit: 1 });
    const pact = (page.items || [])[0];

    if (!pact) return Response.json({ error: 'No such pact.' }, { status: 404 });

    const bundle = await loadBundle(base44, pact);
    return Response.json({ pact: serializePact(pact, view), ...bundle });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}