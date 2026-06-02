const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend (HTML, CSS, JS, Imagens)
app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/produtos', require('./routes/produtos'));
app.use('/api/auth', require('./routes/auth'));

// Rota padrão para servir o index.html caso acesse caminhos indefinidos (SPA Friendly)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.use((_, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log(`Produtos: http://localhost:${PORT}/api/produtos`);
  console.log(`Sistema: http://localhost:${PORT}/login.html`);
});