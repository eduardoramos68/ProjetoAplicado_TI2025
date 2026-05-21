const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/produtos', require('./routes/produtos'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.use((_, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log(`Produtos: http://localhost:${PORT}/api/produtos`);
});