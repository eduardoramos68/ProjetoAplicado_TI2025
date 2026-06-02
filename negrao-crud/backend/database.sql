-- ============================================================
--  FERRAGENS NEGRÃO - Script de criação do banco de dados
-- ============================================================

CREATE DATABASE IF NOT EXISTS negrao_estoque
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE negrao_estoque;

CREATE TABLE IF NOT EXISTS Produto (
  idProduto     INT           NOT NULL AUTO_INCREMENT,
  sku           VARCHAR(50)   NOT NULL UNIQUE COMMENT 'Código único do produto',
  nome          VARCHAR(45)   NOT NULL,
  descricao     VARCHAR(255)  DEFAULT NULL,
  preco         DECIMAL(10,2) NOT NULL,
  categoria     VARCHAR(45)   DEFAULT NULL,
  marca         VARCHAR(45)   DEFAULT NULL,
  unidadeMedida VARCHAR(30)   DEFAULT NULL COMMENT 'Ex: un, kg, m, l',
  criadoEm      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (idProduto),
  INDEX idx_sku (sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dados de exemplo
INSERT INTO Produto (sku, nome, descricao, preco, categoria, marca, unidadeMedida) VALUES
('FERR-001', 'Martelo Cabo de Madeira',    'Martelo de bola 27mm com cabo de madeira', 45.90, 'Ferramentas Manuais', 'Tramontina', 'un'),
('FERR-002', 'Chave de Fenda Phillips #2',  'Chave de fenda phillips tamanho 2, cabo emborrachado', 12.50, 'Ferramentas Manuais', 'Stanley', 'un'),
('PARA-001', 'Parafuso Sextavado M8x30',   'Parafuso sextavado aço zincado M8x30mm', 0.85, 'Parafusos e Fixação', 'Ciser', 'un'),
('CABO-001', 'Cabo Elétrico 2,5mm²',       'Cabo flexível 750V seção 2,5mm² por metro', 4.20, 'Elétrica', 'Ficap', 'm'),
('FITA-001', 'Fita Isolante Preta 19mm',   'Fita isolante preta 19mm x 10m 750V', 6.90, 'Elétrica', '3M', 'un'),
('LIXA-001', 'Lixa para Madeira #120',     'Lixa folha para madeira grão 120', 2.30, 'Abrasivos', 'Norton', 'un'),
('ANEL-001', 'Anel de Vedação EPDM 1/2"',  'Anel de vedação borracha EPDM para tubulação 1/2"', 1.10, 'Hidráulica', 'Fortlev', 'un'),
('TINTA-001', 'Tinta Látex Branco 18L',    'Tinta látex PVA para paredes internas branca 18 litros', 189.90, 'Tintas', 'Suvinil', 'un');

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS Usuario (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  email     VARCHAR(50) NOT NULL UNIQUE COMMENT 'E-mail para login',
  senha     VARCHAR(64) NOT NULL COMMENT 'Senha em hash SHA-256',
  nome      VARCHAR(100) NOT NULL,
  criadoEm  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (idUsuario),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserir usuário administrador padrão (Senha: admin123)
-- Hash SHA-256 de 'admin123' é '240789146b9f213cf8aa7174fa7fae9e2f9d2c67690623a39e80f2d80d21c3b5'
INSERT INTO Usuario (email, senha, nome) 
VALUES ('admin@negrao.com.br', '240789146b9f213cf8aa7174fa7fae9e2f9d2c67690623a39e80f2d80d21c3b5', 'Administrador')
ON DUPLICATE KEY UPDATE email = email;

SELECT 'Banco criado com sucesso!' AS Resultado;