import db from "./conexao.js";

db.query("SELECT * FROM professores", (err, results) => {
    if (err) {
        console.error("Deu ruim", err);
        return;
    }
    console.log("Deu bom: ", results);
});