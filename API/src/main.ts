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

// Middleware para logging de peticiones
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

initModels(sequelize);  // Inicia asociaciones de Sequelize

app.use(router);

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));
