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

// Health check endpoint (sin prefijo /api para que funcione con ALB health checks)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Agregar prefijo /api a todas las rutas
app.use('/api', router);

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));
