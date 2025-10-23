import mysql from "mysql2";

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "imtdb",
    database: "poliedro_ai"
});

connection.connect((err) => {
    if (err) {
        console.error("Deu ruim: ", err);
        return;
    }
    console.log("Deu bom");
});

export default connection;