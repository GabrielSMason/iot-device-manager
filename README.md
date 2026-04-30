# IoT Device Manager

Sistema de gerenciamento de dispositivos IoT com API REST e interface web. Desenvolvido com Node.js, Express, MongoDB e Vue 3.

## Tecnologias

**Backend:**
- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Hash de senhas com `bcryptjs`

**Frontend:**
- Vue 3
- Vite
- Axios
- Vue Router

## Requisitos

- Node.js 18+
- MongoDB (local ou Atlas)

## Como rodar o projeto

### Backend

1. Na pasta raiz, instale as dependencias:

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

### Frontend

1. Acesse a pasta `/frontend`:

```bash
cd frontend
```

2. Instale as dependencias:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend sobe em `http://localhost:5173` por padrão.

## Como rodar os sensores simulados

Após cadastrar um device pelo frontend, o sistema exibe o `deviceId` e a `suaSenhaSecreta`. Com essas credenciais, rode o simulador na pasta raiz do backend:

```bash
node src/deviceClient.js <deviceId> <devicePWD>
```

Exemplo:

```bash
node src/deviceClient.js dd4868c4-f4a9-4744-88a9-84a9f5b40ab6 rvskju4i
```

O simulador busca automaticamente o tipo do sensor, e começa a enviar valores a cada 5 segundos. Múltiplas instâncias podem ser rodadas em terminais separados, uma por sensor.

Os intervalos e faixas de valores simulados por tipo de sensor são:

| Código | Tipo | Unidade | Faixa |
|--------|------|---------|-------|
| 1 | Temperatura | °C | -10 a 40 |
| 2 | Umidade | % | 0 a 100 |
| 3 | Pressão | hPa | 900 a 1100 |

## Autenticação

As rotas de devices exigem token JWT no header:

```http
Authorization: Bearer <seu_token>
```

O token é gerado na rota de login e expira em 24 horas.

## Endpoints

### Healthcheck

- `GET /`

Resposta esperada:

```json
"Aplicacao IoT "
```

### Autenticação

#### Registrar usuário

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

Resposta de sucesso:

```json
{
  "message": "Login Sucesso!",
  "token": "<jwt>"
}
```

### Devices (rotas protegidas por JWT)

#### Criar device

- `POST /devices`

Body:

```json
{
  "nickname": "Sensor Sala",
  "unit": 1
}
```

O campo `unit` deve ser `1` (Temperatura), `2` (Umidade) ou `3` (Pressão).

Resposta inclui `deviceId` e `suaSenhaSecreta` — a senha é exibida apenas uma vez.

#### Listar devices do usuário logado

- `GET /devices`

#### Atualizar nickname de um device

- `PATCH /devices/:id`

O `:id` aceita tanto o `deviceId` (UUID) quanto o `_id` do MongoDB.

Body:

```json
{
  "nickname": "Sensor Quarto"
}
```

#### Remover um device

- `DELETE /devices/:id`

#### Enviar valor (rota do simulador, autenticada por deviceId + senha)

- `POST /devices/value`

Body:

```json
{
  "deviceId": "<deviceId>",
  "password": "<devicePWD>",
  "value": 23.5
}
```

## Fluxo recomendado de teste no Postman

1. Criar usuário em `POST /registrar`.
2. Fazer login em `POST /login` e copiar o `token`.
3. Definir header `Authorization: Bearer <token>`.
4. Criar device em `POST /devices` com `unit` entre 1 e 3.
5. Listar em `GET /devices`.
6. Atualizar nickname com `PATCH /devices/:id` usando o `deviceId` retornado.
7. Remover com `DELETE /devices/:id`.

## Scripts disponíveis

**Backend (pasta raiz):**
- `npm run dev`: executa com nodemon
- `npm start`: executa com node

**Frontend (pasta `/frontend`):**
- `npm run dev`: inicia servidor de desenvolvimento
- `npm run build`: gera build de produção

## Estrutura do projeto

```text
/
├── src/
│   ├── app.js
│   ├── deviceClient.js
│   ├── config/
│   │   └── dbConnect.js
│   ├── controllers/
│   │   ├── AuthController.js
│   │   └── DeviceController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── authDevices.js
│   ├── models/
│   │   ├── User.js
│   │   └── Device.js
│   └── routes/
│       ├── index.js
│       ├── AuthRoutes.js
│       └── DeviceRoutes.js
├── .env
└── package.json

frontend/
├── src/
│   ├── api/
│   │   └── api.js
│   ├── components/
│   │   ├── AppSidebar.vue
│   │   └── AppTopbar.vue
│   ├── composables/
│   │   ├── useAuth.js
│   │   └── useTheme.js
│   ├── router/
│   │   └── index.js
│   ├── utils/
│   │   └── deviceUnits.js
│   ├── views/
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── DevicesView.vue
│   │   ├── DeviceDetailView.vue
│   │   ├── DeviceEditView.vue
│   │   └── DeviceCreateView.vue
│   ├── styles/
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── layout.css
│   │   └── typograph.css
│   ├── App.vue
│   ├── main.js
│   └── style.css
└── package.json
```

## Rodando no Linux sem cliente gráfico

### Iniciando o MongoDB

```bash
sudo systemctl start mongodb
```

Para verificar se subiu corretamente:

```bash
sudo systemctl status mongodb
```

### Acessando o banco de dados via terminal

```bash
mongosh
```

Listar bancos disponíveis:

```bash
show dbs
```

Selecionar o banco do projeto:

```bash
use <nome_do_banco>
```

Visualizar usuários cadastrados:

```bash
db.users.find()
```

Visualizar devices cadastrados:

```bash
db.devices.find()
```

Para sair do mongosh: `Ctrl + C`.