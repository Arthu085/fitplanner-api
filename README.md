# Fitplanner - API (Backend)

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

A API está hospedada no Render, mas você também pode rodá-la localmente seguindo os passos abaixo:

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

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
DATABASE_URL="sua_string_de_conexão_postgres"
JWT_SECRET="sua_chave_secreta"
```

### 4️⃣ Criar o banco de dados

Execute o script `db_script.sql` localizado na raiz do projeto.

**É necessário adicionar os grupos musculares manualmente via banco**

### 5️⃣ Iniciar o projeto

```bash
npm run dev
# ou
node index.js
```

A aplicação estará disponível em:

- 🌐 **HTTP:** http://localhost:3000/api

---

## 📌 Rotas da API

### 🔓 Rotas Públicas (sem autenticação)

#### Autenticação

| Método | Endpoint      | Descrição                        |
|--------|---------------|----------------------------------|
| POST   | /auth/register | Cadastra um novo usuário.        |
| POST   | /auth/login    | Autentica um usuário existente.  |

---

### 🔒 Rotas Protegidas (com token)

#### Treinos

| Método | Endpoint                     | Descrição                                            |
|--------|------------------------------|------------------------------------------------------|
| POST   | /training/create             | Cadastra um novo treino.                             |
| GET    | /training/                   | Lista todos os treinos do usuário autenticado.       |
| GET    | /training/details/{id}       | Retorna os detalhes de um treino específico.         |
| PATCH  | /training/edit/{id}          | Edita um treino existente.                           |
| DELETE | /training/delete/{id}        | Remove um treino.                                    |

---

#### Sessões de treino

| Método | Endpoint                                       | Descrição                                                   |
|--------|------------------------------------------------|-------------------------------------------------------------|
| POST   | /training/session/start/{id}                   | Inicia uma nova sessão de treino.                          |
| POST   | /training/session/finish/{id}                  | Finaliza a sessão em andamento.                            |
| DELETE | /training/session/delete/{id}                  | Exclui uma sessão.                                          |
| GET    | /training/session/?page&limit&search           | Lista sessões do usuário com paginação e busca.             |
| GET    | /training/session/details/{id}                 | Detalhes de uma sessão específica.                         |
| GET    | /training/session/exercise/{id}                | Lista exercícios disponíveis da sessão especificada.        |

---

#### Exercícios

| Método | Endpoint                            | Descrição                                           |
|--------|-------------------------------------|-----------------------------------------------------|
| POST   | /exercise/create                    | Cadastra um novo exercício.                         |
| GET    | /exercise/?page&limit&search        | Lista exercícios cadastrados.                       |
| PATCH  | /exercise/edit/{id}                 | Edita um exercício existente.                       |
| DELETE | /exercise/delete/{id}               | Remove um exercício.                                |

---

#### Grupos Musculares

| Método | Endpoint          | Descrição                          |
|--------|-------------------|------------------------------------|
| GET    | /muscle/group/    | Lista todos os grupos musculares.  |
