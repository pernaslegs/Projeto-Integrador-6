const list = document.querySelector('#list');
const form = document.querySelector('#form');
const message = document.querySelector('#message');
let editing = null;
async function api(url, options) {
  const res = await fetch(url, options);
  if (res.status === 204) return null;
  const body = await res.json();
  if (!res.ok) throw new Error(body.erro || 'Falha na requisição');
  return body;
}
function reset() { editing = null; form.reset(); document.querySelector('#cancel').hidden = true; document.querySelector('#form-title').textContent = 'Novo livro'; }
async function load() {
  try {
    const data = await api('/api/livros');
    list.replaceChildren();
    if (!data.length) { const empty = document.createElement('li'); empty.textContent = 'Nenhum registro cadastrado.'; list.append(empty); }
    for (const item of data) {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = item.titulo + ' • ' + item.autor + ' • ' + item.isbn + ' • ' + item.ano;
      const actions = document.createElement('div');
      const edit = document.createElement('button'); edit.textContent = 'Editar'; edit.type = 'button';
      edit.onclick = () => { editing = item.id; document.querySelector('#titulo').value = item.titulo; document.querySelector('#autor').value = item.autor; document.querySelector('#isbn').value = item.isbn; document.querySelector('#ano').value = item.ano; document.querySelector('#cancel').hidden = false; document.querySelector('#form-title').textContent = 'Editar livro'; window.scrollTo(0, 0); };
      const remove = document.createElement('button'); remove.textContent = 'Excluir'; remove.type = 'button';
      remove.onclick = async () => { if (!confirm('Excluir este registro?')) return; try { await api('/api/livros/' + item.id, { method: 'DELETE' }); message.textContent = ''; reset(); await load(); } catch (error) { message.textContent = error.message; } };
      actions.append(edit, remove); li.append(label, actions); list.append(li);
    }
  } catch (error) { message.textContent = error.message; }
}
form.onsubmit = async event => {
  event.preventDefault();
  const data = { titulo: document.querySelector('#titulo').value, autor: document.querySelector('#autor').value, isbn: document.querySelector('#isbn').value, ano: document.querySelector('#ano').valueAsNumber };
  try { await api('/api/livros' + (editing === null ? '' : '/' + editing), { method: editing === null ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); message.textContent = ''; reset(); await load(); }
  catch (error) { message.textContent = error.message; }
};
document.querySelector('#cancel').onclick = reset;
load();
