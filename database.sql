-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS getrec;
USE getrec;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(100) NOT NULL,
  tipo ENUM('aluno', 'rh', 'instrutor', 'admin') NOT NULL,
  empresa VARCHAR(100),
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_acesso TIMESTAMP NULL
);

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descricao TEXT,
  instrutor VARCHAR(100),
  categoria VARCHAR(50),
  duracao INT, -- em minutos
  preco DECIMAL(10, 2),
  nivel ENUM('iniciante', 'intermediario', 'avancado'),
  imagem_url VARCHAR(255),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de inscrições (relação entre alunos e cursos)
CREATE TABLE IF NOT EXISTS inscricoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  curso_id INT,
  data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  progresso INT DEFAULT 0, -- porcentagem de conclusão
  concluido BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

-- Tabela de avaliações de cursos
CREATE TABLE IF NOT EXISTS avaliacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  curso_id INT,
  nota INT NOT NULL, -- 1 a 5 estrelas
  comentario TEXT,
  data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

-- Inserir alguns dados de exemplo para usuários
INSERT INTO usuarios (nome, email, senha, tipo, empresa) VALUES
('João Silva', 'joao@example.com', 'senha123', 'aluno', NULL),
('Maria Oliveira', 'maria@example.com', 'senha123', 'aluno', 'Empresa ABC'),
('Carlos Santos', 'carlos@example.com', 'senha123', 'instrutor', 'SENAI'),
('Ana Costa', 'ana@example.com', 'senha123', 'rh', 'Empresa XYZ'),
('Admin Sistema', 'admin@getrec.com', 'admin123', 'admin', 'GETREC');

-- Inserir alguns dados de exemplo para cursos
INSERT INTO cursos (titulo, descricao, instrutor, categoria, duracao, preco, nivel, imagem_url) VALUES
('Introdução à Programação', 'Curso básico para iniciantes em programação', 'Carlos Santos', 'Tecnologia', 300, 0.00, 'iniciante', 'img/cursos/programacao.jpg'),
('Excel Avançado', 'Aprenda fórmulas avançadas e análise de dados', 'Ana Costa', 'Produtividade', 240, 49.90, 'intermediario', 'img/cursos/excel.jpg'),
('Gestão de Projetos', 'Metodologias ágeis para gestão de projetos', 'Carlos Santos', 'Gestão', 480, 99.90, 'avancado', 'img/cursos/gestao.jpg'),
('Marketing Digital', 'Estratégias para divulgação online', 'Maria Oliveira', 'Marketing', 360, 79.90, 'intermediario', 'img/cursos/marketing.jpg'),
('Segurança do Trabalho', 'Normas e procedimentos de segurança', 'Ana Costa', 'Segurança', 420, 59.90, 'iniciante', 'img/cursos/seguranca.jpg');

-- Inserir algumas inscrições de exemplo
INSERT INTO inscricoes (usuario_id, curso_id, progresso) VALUES
(1, 1, 30),
(1, 3, 10),
(2, 2, 75),
(2, 4, 50);

-- Inserir algumas avaliações de exemplo
INSERT INTO avaliacoes (usuario_id, curso_id, nota, comentario) VALUES
(1, 1, 5, 'Excelente curso para iniciantes!'),
(2, 2, 4, 'Muito bom, aprendi bastante.'),
(2, 4, 3, 'Conteúdo bom, mas poderia ser mais prático.');