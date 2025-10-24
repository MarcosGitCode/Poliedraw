CREATE DATABASE IF NOT EXISTS poliedro_ai;
USE poliedro_ai;

CREATE TABLE professores (
    id_professor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE alunos (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE historico_pesquisa (
    id_pesquisa INT AUTO_INCREMENT PRIMARY KEY,
    tipo_usuario ENUM('professor', 'aluno') NOT NULL,
    id_usuario INT NOT NULL,
    termo_pesquisado TEXT NOT NULL,
    data_pesquisa DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO professores(nome, email, senha) VALUES ("Guilherme 43", "gui@43", "4343");

SELECT * FROM professores;


CREATE DATABASE login_db;
USE login_db;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

INSERT INTO usuarios (username, password) VALUES ('gui@43', '4343');
