const API = (window.location.protocol === 'file:') ? 'http://localhost:3001/api' : (window.location.origin + '/api');

async function req(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(API + path, opts);
  const d = await r.json();
  if (!r.ok) throw new Error(d.erro || 'Erro na requisição');
  return d;
}

const ProdutoAPI = {
  listar:    (p = {}) => req('GET', '/produtos?' + new URLSearchParams(p)),
  porId:     (id)     => req('GET', `/produtos/${id}`),
  criar:     (b)      => req('POST', '/produtos', b),
  atualizar: (id, b)  => req('PUT', `/produtos/${id}`, b),
  excluir:   (id)     => req('DELETE', `/produtos/${id}`),
};

const AuthAPI = {
  login: (loginInput, senha) => req('POST', '/auth/login', { login: loginInput, senha }),
};