## Rodando o Projeto

### 1. Suba o Container do Banco de Dados

Antes de rodar o projeto, inicie o container Docker com o banco de dados:

```bash
docker-compose up -d
```

### 2. Instale as dependências

Após configurar o container, instale as dependências do projeto:

```bash
npm install
```

### 3. Inicie o servidor

Para rodar o projeto, utilize:

```bash
npm run start
```
A API estará disponível em http://localhost:3000.

Você pode consultar a documentação em http://localhost:3000/documentation.

O front-end já integrado a este projeto está em: https://github.com/thalespinto/todo-frontend.
