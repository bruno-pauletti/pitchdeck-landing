// /api/deck — gate da Vitrine (Opção 2)
// Recebe o cadastro (lead), grava na tabela "Leads Ranking" e devolve o link do deck.
// O token do Airtable fica SÓ aqui (variável de ambiente AIRTABLE_TOKEN no Vercel),
// nunca no HTML público — por isso o link do deck só é entregue após o cadastro.
//
// Variável de ambiente necessária (Vercel → Project Settings → Environment Variables):
//   AIRTABLE_TOKEN = Personal Access Token com data.records:read + data.records:write
//                    na base app59di7WZDzVeO9m
//
// Node serverless (CommonJS). Node 18+ tem fetch global no runtime do Vercel.

const BASE = 'app59di7WZDzVeO9m';
const TBL_ANALISES = 'tblI8rEx7JAh4sv4q';   // Analises (tem o link "Deck" e "Link Output Drive")
const TBL_DECKS    = 'tblAhz3TLB122cg49';   // Decks Recebidos (tem "Link Drive")
const TBL_LEADS    = 'tblty4tQBKilPPxaX';   // Leads Ranking (captura do cadastro)

async function at(path, token, init) {
  const res = await fetch('https://api.airtable.com/v0/' + path, {
    ...init,
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      ...(init && init.headers ? init.headers : {}),
    },
  });
  return res;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const token = process.env.AIRTABLE_TOKEN;
  if (!token) {
    return res.status(503).json({ error: 'unconfigured', message: 'AIRTABLE_TOKEN não configurado.' });
  }

  // Body pode vir como string dependendo do runtime
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
  body = body || {};

  const nome = (body.nome || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const whatsapp = (body.whatsapp || '').toString().trim();
  const perfil = (body.perfil || '').toString().trim();
  const company = (body.company || '').toString().trim();
  const analiseId = (body.analiseId || '').toString().trim();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!nome || !emailOk) {
    return res.status(400).json({ error: 'invalid_input', message: 'Nome e e-mail válidos são obrigatórios.' });
  }
  if (!analiseId) {
    return res.status(400).json({ error: 'missing_deck', message: 'Deck não identificado.' });
  }

  // 1) Grava o lead (não bloqueia o acesso se falhar — captura é best-effort)
  try {
    await at(`${BASE}/${TBL_LEADS}`, token, {
      method: 'POST',
      body: JSON.stringify({
        typecast: true,
        fields: {
          'Nome': nome,
          'Email': email,
          'WhatsApp': whatsapp || undefined,
          'Perfil': perfil || undefined,
          'Deck Solicitado': company || undefined,
          'Data Cadastro': new Date().toISOString(),
          'Origem': 'ranking-page',
        },
      }),
    });
  } catch (e) {
    console.error('lead write error', e);
  }

  // 2) Resolve o link do deck server-side (nunca exposto no payload público)
  try {
    const aRes = await at(`${BASE}/${TBL_ANALISES}/${encodeURIComponent(analiseId)}`, token, { method: 'GET' });
    if (!aRes.ok) {
      return res.status(404).json({ error: 'analise_not_found' });
    }
    const a = await aRes.json();
    const fields = a.fields || {};

    // A vitrine mostra a ANÁLISE FREE (output da análise), não o deck original da startup.
    let url = fields['Link Output Drive'] || '';
    // Fallback: link do deck original, só se a análise não tiver output.
    if (!url) {
      const deckLinks = fields['Deck'];
      if (Array.isArray(deckLinks) && deckLinks.length) {
        const dRes = await at(`${BASE}/${TBL_DECKS}/${encodeURIComponent(deckLinks[0])}`, token, { method: 'GET' });
        if (dRes.ok) {
          const d = await dRes.json();
          url = (d.fields && d.fields['Link Drive']) || '';
        }
      }
    }

    if (!url) {
      return res.status(404).json({ error: 'no_deck_link', message: 'Deck ainda sem link disponível.' });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ url });
  } catch (e) {
    console.error('deck resolve error', e);
    return res.status(500).json({ error: 'server_error' });
  }
};
