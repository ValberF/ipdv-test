# Teste IPDV

Este repositório contém o frontend, o backend e o database do projeto de teste da **IPDV**, desenvolvido com Vue.js/Vuetify3, Node.js/Express e utilizando PostgreSQL como banco de dados.

---

## Passo a passo para rodar o projeto

### 1. Criar o banco de dados e executar os scripts de criação das tabelas com usuário e cargo inicial

#### Alternativa 1:

Pelo PgAdmin, crie um novo database com as seguintes especificações (para conexão é necessário um usuário com o nome postgres, senha root e porta 5434).

- **Nome do banco:** Ipdv
- **user:** postgres
- **senha:** root
- **porta:** 5434

Após criar o banco, rode o script para criação das tabelas
que está na pasta database/init.sql ou abaixo:

```
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE UNIQUE INDEX user_email_unique_not_deleted
ON "user" (email)
WHERE deleted_at IS NULL;

CREATE TABLE refresh_token (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(id),
    token TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP
);

WITH admin_role AS (
    INSERT INTO role (name) VALUES ('admin') RETURNING id
)
INSERT INTO "user" (name, email, password, role_id)
SELECT
    'Administrador',
    'admin@email.com',
    '$2b$10$5PaVSr.N.vMg8S/x38xinujR/bP/JOWukR/aNICB/co/.q20rKm8y',
    id
FROM admin_role;
```

#### Alternativa 2:

Dentro da pasta de database e com o psql instalado rode o comando

```bash
psql "postgresql://ipdv_user:ipdv_password@localhost:5433/Ipdv" -f seu_script.sql
```

---

### 2. Instalar as dependências e rodar o backend

Dentro da pasta do backend execute o comando para instalar as dependências encontradas no package.json do backend:

```bash
npm i
```

Após instalado, execute o comando para rodar o servidor do backend:

```bash
npm run dev
```

---

### 3. Instalar as dependências e rodar o frontend

Dentro da pasta do frontend execute o comando para instalar as dependências encontradas no package.json do frontend:

```bash
npm i
```

Após instalado, execute o comando para rodar o frontend:

```bash
vite
```

---

## Usuário Inicial

Após executar o script SQL, é criado um usuário inicial, como também um cargo, segue as credenciais para fazer o login

### Credenciais

| Nome          | E-mail          | Senha    | Cargo |
| ------------- | --------------- | -------- | ----- |
| Administrador | admin@email.com | 12345678 | admin |
