const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'negrao_estoque',
  waitForConnections: true,
  connectionLimit: 10,
});

pool.getConnection()
  .then(async conn => {
    console.log('MySQL conectado!');
    try {
      // Criar tabela de usuários caso não exista
      await conn.query(`
        CREATE TABLE IF NOT EXISTS Usuario (
          idUsuario INT NOT NULL AUTO_INCREMENT,
          email     VARCHAR(50) NOT NULL UNIQUE,
          senha     VARCHAR(64) NOT NULL,
          nome      VARCHAR(100) NOT NULL,
          criadoEm  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (idUsuario),
          INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Se não houver nenhum usuário, insere o padrão (admin@negrao.com.br / admin123)
      const [[{ total }]] = await conn.query('SELECT COUNT(*) as total FROM Usuario');
      if (total === 0) {
        await conn.query(`
          INSERT INTO Usuario (email, senha, nome)
          VALUES ('admin@negrao.com.br', '240789146b9f213cf8aa7174fa7fae9e2f9d2c67690623a39e80f2d80d21c3b5', 'Administrador')
        `);
        console.log('MySQL: Usuário administrador padrão semeado com sucesso!');
      }
    } catch (e) {
      console.error('Erro ao inicializar tabela Usuario:', e.message);
    } finally {
      conn.release();
    }
  })
  .catch(err  => console.error('Erro MySQL:', err.message));

module.exports = pool;