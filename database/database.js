const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

const DB_PATH = process.env.DATABASE_PATH;

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco!", err.message);
    } else {
        console.log("Conectado");
    }
});

module.exports = { db };
