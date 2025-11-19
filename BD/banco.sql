CREATE DATABASE IF NOT EXISTS poliedro_ai;
USE poliedro_ai;

CREATE TABLE professores (
    id_professor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL, CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@sistemapoliedro$'),
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE alunos (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL, CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@sistemapoliedro$'),
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE historico_pesquisa (
    id_pesquisa INT AUTO_INCREMENT PRIMARY KEY,
    tipo_usuario ENUM('professor', 'aluno') NOT NULL,
    id_usuario INT NOT NULL,
    termo_pesquisado TEXT NOT NULL,
    data_pesquisa DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE imagens_geradas (
    id_imagem INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_usuario ENUM('professor', 'aluno') NOT NULL,
    prompt TEXT NOT NULL,
    imagem LONGBLOB NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO professores(nome, email, senha) VALUES ("Guilherme 43", "gui@sistemapoliedro", "4343");
INSERT INTO alunos(nome, email, senha) VALUES ("Guilherme43", "aluno@sistemapoliedro", "43");
UPDATE alunos SET nome = ?, email = ? WHERE id_aluno = ?;
SELECT * FROM alunos;
SELECT * FROM professores;