# IoT Device Manager API

API REST em Node.js para cadastro de usuarios, autenticacao com JWT e gerenciamento de devices IoT.

## Tecnologias

- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Hash de senhas com `bcryptjs`

## Requisitos

- Node.js 18+ (recomendado)
- MongoDB (local ou Atlas)

## Como rodar o projeto

1. Instale as dependencias:

```bash
npm install
```

2. Configure o arquivo `.env` na raiz:

```env
MONGO_URI=sua_string_de_conexao_mongodb
JWT_SECRET=seu_segredo_jwt
PORT=3000
```

3. Inicie a API:

```bash
npm run dev
```

ou

```bash
npm start
```

A API sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

## Autenticacao

As rotas de devices exigem token JWT no header:

```http
Authorization: Bearer <seu_token>
```

Token e gerado na rota de login.

## Endpoints

### Healthcheck

- `GET /`

Resposta esperada:

```json
"Aplicacao IoT "
```

### Autenticacao

#### Registrar usuario

- `POST /registrar`

Body:

```json
{
  "email": "gabriel@email.com",
  "fullName": "Gabriel",
  "password": "senha123"
}
```

#### Login

- `POST /login`

Body:

```json
{
  "email": "gabriel@email.com",
  "password": "senha123"
}
```

Resposta de sucesso (exemplo):

```json
{
  "message": "Login Sucesso!",
  "token": "<jwt>"
}
```

### Devices (rotas protegidas)

#### Criar device

- `POST /devices`

Body:

```json
{
  "nickname": "Sensor Sala",
  "unit": "C"
}
```

Resposta inclui:

- `deviceId` (identificador do device)
- `suaSenhaSecreta` (mostrada uma unica vez)

#### Listar devices do usuario logado

- `GET /devices`

#### Atualizar nickname de um device

- `PATCH /devices/:id`

Body:

```json
{
  "nickname": "Sensor Quarto"
}
```

> Observacao: atualmente `:id` deve ser o `_id` do documento no MongoDB.

## Fluxo recomendado de teste no Postman

1. Criar usuario em `POST /registrar`.
2. Fazer login em `POST /login` e copiar o `token`.
3. Definir `Authorization: Bearer <token>`.
4. Criar device em `POST /devices`.
5. Listar em `GET /devices`.
6. Atualizar nickname com `PATCH /devices/:id` usando o `_id` retornado.

## Scripts disponiveis

- `npm run dev`: executa com nodemon
- `npm start`: executa com node
- `npm test`: placeholder (ainda sem testes implementados)

## Estrutura basica

```text
src/
  app.js
  config/
    dbConnect.js
  controllers/
    AuthController.js
    DeviceController.js
  middlewares/
    authMiddleware.js
  models/
    User.js
    Device.js
  routes/
    index.js
    AuthRoutes.js
    DeviceRoutes.js
```
