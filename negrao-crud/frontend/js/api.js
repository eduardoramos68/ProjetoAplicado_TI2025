const API = (() => {
  const { protocol, hostname, port, origin } = window.location;

  if (protocol === 'file:') return 'http://localhost:3001/api';

  // Quando aberto por Live Server (porta diferente), força backend local.
  if ((hostname === 'localhost' || hostname === '127.0.0.1') && port && port !== '3001') {
    return 'http://localhost:3001/api';
  }

  return origin + '/api';
})();

async function req(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(API + path, opts);
  const contentType = r.headers.get('content-type') || '';
  const text = await r.text();
  let d = null;

  if (text && (contentType.includes('application/json') || text.trim().startsWith('{'))) {
    try {
      d = JSON.parse(text);
    } catch (err) {
      throw new Error('Resposta do servidor não é JSON válido');
    }
  }

  if (!r.ok) {
    if (!d && text && text.toLowerCase().includes('<html')) {
      throw new Error('API não encontrada neste endereço. Inicie o backend em http://localhost:3001');
    }
    throw new Error(d?.erro || `Erro na requisição (${r.status})`);
  }

  return d || {};
}

const ProdutoAPI = {
  listar:    (p = {}) => req('GET', '/produtos?' + new URLSearchParams(p)),
  porId:     (id)     => req('GET', `/produtos/${id}`),
  criar:     (b)      => req('POST', '/produtos', b),
  atualizar: (id, b)  => req('PUT', `/produtos/${id}`, b),
  excluir:   (id)     => req('DELETE', `/produtos/${id}`),
};

const DashboardAPI = {
  obterDados: () => req('GET', '/dashboard'),
};

const AuthAPI = {
  login: (loginInput, senha) => req('POST', '/auth/login', { login: loginInput, senha }),
};