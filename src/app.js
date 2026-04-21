import express from "express";
import conectaDataBase from "./config/dbConnect.js";
import routes from "./routes/index.js";
import cors from "cors";

const conexao = await conectaDataBase();

conexao.on("Error", (erro) => {
  console.error("Erro de conexao", erro);
});

conexao.once("open", () => {
  console.log("Conexao com banco de dados feita com sucesso");
});

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor Escultando");
});

routes(app);
