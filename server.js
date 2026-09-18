require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post('/chamados', async (req, res) => {
  const { solicitante, descricao, categoria, prioridade } = req.body;

  if (!solicitante || !descricao || !categoria || !prioridade) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
  }

  const { data, error } = await supabase
    .from('chamados')
    .insert([{ solicitante, descricao, categoria, prioridade, status: 'Aberto' }])
    .select();

  if (error) return res.status(500).json({ erro: error.message });
  return res.status(201).json(data[0]);
});

app.get('/chamados', async (req, res) => {
  const { data, error } = await supabase
    .from('chamados')
    .select('*')
    .order('id', { ascending: true });

  if (error) return res.status(500).json({ erro: error.message });
  return res.json(data);
});

app.get('/chamados/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('chamados')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
  return res.json(data);
});

app.put('/chamados/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, categoria, prioridade, status } = req.body;

  const { data, error } = await supabase
    .from('chamados')
    .update({ descricao, categoria, prioridade, status })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ erro: error.message });
  return res.json(data[0]);
});

app.delete('/chamados/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('chamados')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ erro: error.message });
  return res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ConnectTI rodando na porta ${PORT} ligado ao Supabase`);
});