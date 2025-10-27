import express from 'express';
import Gemini from './gemini.js';
import cors from "cors";


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'prompt é obrigatório' });

        const resposta = await Gemini(prompt);
        res.json({ resposta });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao obter resposta do Gemini' });
    }
});

app.get('/', async (req, res) => {
    try {
        const response = await Gemini(prompt);
        res.send(`Resposta do Gemini: ${response}`);
    } catch (error) {
        res.status(500).send("Erro ao obter resposta do Gemini");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    
});
