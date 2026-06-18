const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'negrao_estoque',
  });

  try {
    console.log('Verificando conexão com o MySQL...');
    const conn = await pool.getConnection();
    console.log('Conectado!');

    // 1. Verificar se a coluna estoque existe
    const [cols] = await conn.query('SHOW COLUMNS FROM Produto LIKE "estoque"');
    if (cols.length === 0) {
      console.log('Coluna "estoque" não existe. Adicionando...');
      await conn.query('ALTER TABLE Produto ADD COLUMN estoque INT NOT NULL DEFAULT 0 COMMENT "Quantidade em estoque"');
      console.log('Coluna "estoque" adicionada com sucesso!');
    } else {
      console.log('Coluna "estoque" já existe.');
    }

    // 2. Atualizar quantidades iniciais se for o banco padrão para ficar idêntico ao mockup
    console.log('Definindo quantidades de estoque padrão...');
    await conn.query('UPDATE Produto SET estoque = 1 WHERE sku = "FERR-001"'); // Martelo (45.90) -> valor 45.90
    await conn.query('UPDATE Produto SET estoque = 1 WHERE sku = "FERR-002"'); // Chave Fenda (12.50) -> valor 12.50
    await conn.query('UPDATE Produto SET estoque = 2 WHERE sku = "PARA-001"'); // Parafuso M8x30 (0.85) -> valor 1.70
    await conn.query('UPDATE Produto SET estoque = 2 WHERE sku = "CABO-001"'); // Cabo Elétrico (4.20) -> valor 8.40
    await conn.query('UPDATE Produto SET estoque = 0 WHERE sku = "FITA-001"'); // Fita Isolante -> valor 0
    await conn.query('UPDATE Produto SET estoque = 4 WHERE sku = "LIXA-001"'); // Lixa -> valor 9.20
    await conn.query('UPDATE Produto SET estoque = 1 WHERE sku = "ANEL-001"'); // Anel de Vedação -> valor 1.10
    await conn.query('UPDATE Produto SET estoque = 1 WHERE sku = "TINTA-001"'); // Tinta Látex (189.90) -> valor 189.90
    
    console.log('Estoque inicial configurado!');
    conn.release();
  } catch (err) {
    console.error('Erro na migração:', err.message);
  } finally {
    await pool.end();
  }
}

run();
