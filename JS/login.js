// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';
// import { use } from 'react';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  const User = "a";
  const Pass = "a";

  form.addEventListener("submit", function (event) {
    event.preventDefault(); 

    // async function buscarUsuarios(username, password) {
    //   const db = await open({
    //     filename: './banco.db',
    //     driver: sqlite3.Database
    // });
    //   db.run("SELECT * FROM usuarios WHERE username = ? AND password = ?", [username, password], (err, row) => {
    // });

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === User && password === Pass) {
      window.location.href = "./poliedraw.html";
    } else {
      alert("Usuário ou senha incorretos!");
    }
    // }
  });
});
