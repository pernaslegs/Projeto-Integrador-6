const express = require('express');
const path = require('path');
const Model = require('./model');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

function validate(body) {
  const data = { ...body };
  if (typeof data.titulo !== 'string' || !data.titulo.trim()) return 'Título é obrigatório';
  if (typeof data.autor !== 'string' || !data.autor.trim()) return 'Autor é obrigatório';
  if (typeof data.isbn !== 'string' || !data.isbn.trim()) return 'ISBN (13 dígitos) é obrigatório';
  if (typeof data.ano !== 'number') return 'Ano de publicação deve ser um número';
  data.titulo = data.titulo.trim();
  data.autor = data.autor.trim();
  data.isbn = data.isbn.trim();
  if (!/^\d{13}$/.test(data.isbn)) return 'ISBN deve ter 13 dígitos';
  if (!Number.isInteger(data.ano) || data.ano < 1450 || data.ano > new Date().getFullYear() + 1) return 'Ano inválido';
  return null;
}
function validId(id) { return /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id)); }
function failure(res, error) {
  if (error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ erro: 'isbn já cadastrado' });
  return res.status(500).json({ erro: 'Erro interno' });
}

app.get('/api/livros', async (req, res) => {
  try { res.json(await Model.findAll({ order: [['id', 'ASC']] })); }
  catch (error) { failure(res, error); }
});
app.get('/api/livros/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
  try {
    const item = await Model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Livro não encontrado' });
    res.json(item);
  } catch (error) { failure(res, error); }
});
app.post('/api/livros', async (req, res) => {
  const errorText = validate(req.body);
  if (errorText) return res.status(400).json({ erro: errorText });
  try { res.status(201).json(await Model.create(req.body)); }
  catch (error) { failure(res, error); }
});
app.put('/api/livros/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
  const errorText = validate(req.body);
  if (errorText) return res.status(400).json({ erro: errorText });
  try {
    const item = await Model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Livro não encontrado' });
    await item.update(req.body);
    res.json(item);
  } catch (error) { failure(res, error); }
});
app.delete('/api/livros/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
  try {
    const item = await Model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Livro não encontrado' });
    await item.destroy();
    res.status(204).end();
  } catch (error) { failure(res, error); }
});
module.exports = app;
