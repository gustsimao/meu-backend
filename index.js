require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Rota para registrar pressão arterial
app.post('/registrar', async (req, res) => {
  const { sistolica, diastolica, observacao } = req.body;

  const { error } = await supabase
    .from('pressao')
    .insert([{ data: new Date().toISOString(), sistolica, diastolica, observacao }]);

  if (error) {
    return res.status(500).json({ erro: 'Erro ao salvar', detalhes: error });
  }

  res.json({ mensagem: 'Registro salvo com sucesso' });
});

// Rota para buscar todos os dados
app.get('/dados', async (req, res) => {
  const { data, error } = await supabase
    .from('pressao')
    .select('*')
    .order('data', { ascending: true });

  if (error) {
    return res.status(500).json({ erro: 'Erro ao buscar dados', detalhes: error });
  }

  res.json(data);
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
