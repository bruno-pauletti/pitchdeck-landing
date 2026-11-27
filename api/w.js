// /w/<ref> — link curto e estável para o WhatsApp do PitchDeck (Ata 129, 26/11/2026).
// Instagram, LinkedIn e e-mail recodificam URLs já codificadas; aqui o servidor monta o wa.me
// e codifica o texto UMA vez. Só o slug entra na URL; o texto é fixo.
//   /w/ig-bio-s1  →  https://wa.me/552131960982?text=[REF: ig-bio-s1] Oi! Quero a nota grátis do meu pitch deck.
// Node serverless (CommonJS), sem dependências, sem token.

const NUMERO = '552131960982';
const SLUG_RE = /^[a-z0-9][a-z0-9_-]{0,59}$/;

module.exports = (req, res) => {
  const bruto = String((req.query && req.query.ref) || '').trim().toLowerCase();
  const ref = SLUG_RE.test(bruto) ? bruto : 'site-w';
  const texto = `[REF: ${ref}] Oi! Quero a nota grátis do meu pitch deck.`;
  const destino = `https://wa.me/${NUMERO}?text=${encodeURIComponent(texto)}`;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.statusCode = 302;
  res.setHeader('Location', destino);
  res.end('');
};
