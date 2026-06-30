// /api/newsletter — captura de e-mail da newsletter Insights.
// Grava o assinante na tabela "Newsletter" da base de leads (app59di7WZDzVeO9m).
// Usa a MESMA variável de ambiente do gate da Vitrine: AIRTABLE_TOKEN (já configurada no Vercel),
// com escopo data.records:read + data.records:write na base app59di7WZDzVeO9m.
//
// Node serverless (CommonJS). Node 18+ tem fetch global no runtime do Vercel.

const BASE = 'app59di7WZDzVeO9m';
const TBL_NEWSLETTER = 'tblTKpKqOzkaDPGw5'; // Newsletter (Email, Data Cadastro, Origem, Status)

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
    return res.status(503).json({ error: 'unconfigured', message: 'Inscrição indisponível no momento.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
  body = body || {};

  const email = (body.email || '').toString().trim();
  const origem = (body.origem || 'insights-newsletter').toString().trim();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return res.status(400).json({ error: 'invalid_email', message: 'Digite um e-mail válido.' });
  }

  try {
    // Dedupe: se o e-mail já existe, retorna sucesso sem duplicar.
    const esc = email.replace(/"/g, '\\"');
    const formula = encodeURIComponent(`LOWER({Email})="${esc.toLowerCase()}"`);
    const findRes = await at(`${BASE}/${TBL_NEWSLETTER}?maxRecords=1&filterByFormula=${formula}`, token, { method: 'GET' });
    if (findRes.ok) {
      const found = await findRes.json();
      if (found.records && found.records.length) {
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json({ ok: true, already: true });
      }
    }

    const createRes = await at(`${BASE}/${TBL_NEWSLETTER}`, token, {
      method: 'POST',
      body: JSON.stringify({
        typecast: true,
        fields: {
          'Email': email,
          'Data Cadastro': new Date().toISOString(),
          'Origem': origem,
          'Status': 'Ativo',
        },
      }),
    });

    if (!createRes.ok) {
      const detail = await createRes.text();
      console.error('newsletter write error', createRes.status, detail);
      return res.status(502).json({ error: 'write_failed', message: 'Não foi possível salvar agora. Tente de novo.' });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('newsletter error', e);
    return res.status(500).json({ error: 'server_error', message: 'Algo deu errado. Tente de novo.' });
  }
};
