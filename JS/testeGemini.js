import express from 'express';
import Gemini from './gemini.js';  

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
    try {
        const response = await Gemini("Quanto é 43 + 43?");
        res.send(`Resposta do Gemini: ${response}`);
    } catch (error) {
        res.status(500).send("Erro ao obter resposta do Gemini");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    
});
