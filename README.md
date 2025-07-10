# Fitplanner - API

A **Fitplanner API** é responsável por gerenciar as regras de negócio e a segurança do sistema Fitplanner, oferecendo endpoints para autenticação, gerenciamento de treinos, sessões, exercícios e grupos musculares.

> Repositório do frontend: [Fitplanner Frontend](https://github.com/Arthu085/fitplanner)

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express**
- **Prisma ORM**
- **PostgreSQL** (Supabase)

---

## ⚙️ Como rodar o projeto

A API está hospedada no Render, mas você pode rodá-la localmente seguindo os passos abaixo:

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/Arthu085/fitplanner-api
cd fitplanner-api
```

### 2️⃣ Instalar dependências

```bash
npm install
```

### 3️⃣ Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

```bash
DATABASE_URL="sua_string_de_conexão_postgres"
JWT_SECRET="sua_chave_secreta"
```

### 4️⃣ Criar banco de dados

Rode o script do arquivo "db_script.sql" localizado na raíz do projeto.

### 5️⃣ Executar projeto

```bash
npm run dev
# ou
node index.js
```
A aplicação estará disponível em:
- 🌐 **HTTP:** http://localhost:3000/api

---

# 📌 Rotas da API

## 🔓 Rotas Públicas (sem token)

### Autenticação

| Método | Endpoint           | Descrição                                  |
|--------|--------------------|--------------------------------------------|
| POST    | /auth/register| Cadastra um usuário no sistema. |
| POST    | /auth/login| Autentica um usuário no sistema. |

---

## 🔒 Rotas Protegidas (com token)

### Treinos

| Método | Endpoint              | Descrição                                                  |
|--------|------------------------|------------------------------------------------------------|
| POST    | /training/create    | Cadastra um novo treino do usuário autenticado.  |
| GET    | /training/    | Busca os treinos do usuário autenticado.  |
| GET    | /training/details/{id}    | Busca um treino detalhado específico do usuário autenticado.  |
| DELETE    | /training/delete/{id}    | Deleta um treino do usuário autenticado.  |
| PATCH    | /training/edit/{id}    | Edita um treino do usuário autenticado.  |

---

### Sessão de treinos

| Método | Endpoint              | Descrição                                                  |
|--------|------------------------|------------------------------------------------------------|
| POST    | /training/session/start/{id}    | Inicia a sessão de um treino.  |
| POST    | /training/session/finish/{id}    | Finaliza a sessão de um treino.  |
| DELETE    | /training/session/delete/{id}    | Delete uma sessão de treino.  |
| GET    | /training/session/?page&limit&search    | Busca sessões do usuário autenticado.  |
| GET    | /training/session/details/{id}    | Busca detalhes de uma sessão.  |
| GET    | /training/session/exercise/{id}    | Busca os exercícios disponíveis daquela sessão.  |

---

### Exercícios

| Método | Endpoint              | Descrição                                                  |
|--------|------------------------|------------------------------------------------------------|
| POST    | /exercise/create    | Cadastra um novo exercício.  |
| DELETE    | /exercise/delete/{id}    | Delete um exercício.  |
| GET    | /exercise/?page&limit&search    | Busca exercícios em geral.  |
| PATCH    | /exercise/edit/{id}    | Edita um exercício.  |

---

### Grupo muscular

| Método | Endpoint              | Descrição                                                  |
|--------|------------------------|------------------------------------------------------------|
| GET    | /muscle/group/    | Busca os grupos musculares em geral.  |
