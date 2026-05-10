# CRUD de Produtos — Ferragens Negrão (v2)

## Estrutura

```
negrão-v2/
├── backend/
│   ├── src/
│   │   ├── config/database.js
│   │   ├── controllers/produtoController.js
│   │   ├── routes/produtos.js
│   │   └── server.js
│   ├── database.sql      ← roda no MySQL primeiro
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── css/styles.css
    ├── js/api.js
    ├── js/app.js
    └── index.html
```

## Como rodar

### 1. Banco de dados
```bash
mysql -u root -p < backend/database.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env        # edite com sua senha do MySQL
npm install                 # instala as dependências
npm run dev                 # http://localhost:3001
```

### 3. Frontend
Abra `frontend/index.html` no navegador.
Ou use Live Server no VS Code.

## API

| Método | Rota | Ação |
|--------|------|------|
| GET | /api/produtos | Listar (busca, categoria, pagina, limite) |
| GET | /api/produtos/:id | Buscar por ID |
| POST | /api/produtos | Criar |
| PUT | /api/produtos/:id | Atualizar |
| DELETE | /api/produtos/:id | Excluir |

## Campos da tabela Produto

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| idProduto | INT AUTO_INCREMENT | PK |
| sku | VARCHAR(50) UNIQUE | Sim |
| nome | VARCHAR(45) | Sim |
| descricao | VARCHAR(255) | Não |
| preco | DECIMAL(10,2) | Sim |
| categoria | VARCHAR(45) | Não |
| marca | VARCHAR(45) | Não |
| unidadeMedida | VARCHAR(30) | Não |
| criadoEm | TIMESTAMP | Auto |
| atualizadoEm | TIMESTAMP | Auto |