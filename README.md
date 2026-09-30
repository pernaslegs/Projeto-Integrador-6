# Biblioteca pessoal

Cada livro possui ISBN único; ano de publicação e ISBN são validados. Projeto independente com interface web, Express, Sequelize, banco relacional SQLite e testes Jest.

## Executar

Na pasta deste projeto:

```bash
npm install
npm test
npm start
```

Abra http://localhost:3001. O arquivo `dados.sqlite` é criado automaticamente. Para mudar a porta use `PORT`; nos testes `DB_PATH=:memory:` isola o banco.

| Método | Rota | Ação |
| --- | --- | --- |
| GET | `/api/livros` | Listar |
| GET por ID | `/api/livros/:id` | Buscar |
| POST | `/api/livros` | Criar |
| PUT | `/api/livros/:id` | Atualizar |
| DELETE | `/api/livros/:id` | Excluir |

`npm test` exige cobertura acima de 90% para linhas, instruções, funções e ramos.
