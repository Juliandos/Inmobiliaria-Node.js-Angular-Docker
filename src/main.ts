import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { sequelize } from "./db/database";
import { initModels } from "./models/init-models";
import { router } from "./routes";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

initModels(sequelize);  // Inicia asociaciones de Sequelize

app.use(router);

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));
