import "dotenv/config";
import { sequelize } from "./src/db/database.js";
import { initModels } from "./src/models/init-models.js";

const consultarDB = async () => {
  try {
    console.log("═══════════════════════════════════════════════════════════");
    console.log("📊 CONSULTANDO BASE DE DATOS");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("");

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");
    console.log("");

    initModels(sequelize);

    // Obtener modelos
    const { usuarios, propiedades, tipos_propiedad, operacion, ciudad } = initModels(sequelize);

    // 1. Listar tablas
    console.log("1. Tablas en la base de datos:");
    console.log("───────────────────────────────────────────────────────────");
    const [results] = await sequelize.query("SHOW TABLES");
    const tables = results.map(r => Object.values(r)[0]);
    console.log("   Tablas encontradas:", tables.join(", "));
    console.log("");

    // 2. Contar registros por tabla
    console.log("2. Contando registros por tabla:");
    console.log("───────────────────────────────────────────────────────────");
    for (const table of tables) {
      try {
        const [count] = await sequelize.query(`SELECT COUNT(*) as count FROM \`${table}\``);
        console.log(`   ${table}: ${count[0].count} registros`);
      } catch (err) {
        console.log(`   ${table}: Error al contar`);
      }
    }
    console.log("");

    // 3. Usuarios
    console.log("3. Usuarios (primeros 5):");
    console.log("───────────────────────────────────────────────────────────");
    try {
      const usuariosData = await usuarios.findAll({
        limit: 5,
        attributes: ['id', 'nombre', 'email', 'rol_id'],
        raw: true
      });
      console.table(usuariosData);
    } catch (err) {
      console.log("   ⚠️ Error al consultar usuarios:", err.message);
    }
    console.log("");

    // 4. Propiedades
    console.log("4. Propiedades (primeros 5):");
    console.log("───────────────────────────────────────────────────────────");
    try {
      const propiedadesData = await propiedades.findAll({
        limit: 5,
        attributes: ['id', 'titulo', 'precio', 'tipo_propiedad_id', 'operacion_id'],
        raw: true
      });
      console.table(propiedadesData);
    } catch (err) {
      console.log("   ⚠️ Error al consultar propiedades:", err.message);
    }
    console.log("");

    // 5. Tipos de propiedad
    console.log("5. Tipos de Propiedad:");
    console.log("───────────────────────────────────────────────────────────");
    try {
      const tiposData = await tipos_propiedad.findAll({ raw: true });
      console.table(tiposData);
    } catch (err) {
      console.log("   ⚠️ Error al consultar tipos_propiedad:", err.message);
    }
    console.log("");

    // 6. Operaciones
    console.log("6. Operaciones:");
    console.log("───────────────────────────────────────────────────────────");
    try {
      const operacionesData = await operacion.findAll({ raw: true });
      console.table(operacionesData);
    } catch (err) {
      console.log("   ⚠️ Error al consultar operacion:", err.message);
    }
    console.log("");

    // 7. Ciudades
    console.log("7. Ciudades (si existe):");
    console.log("───────────────────────────────────────────────────────────");
    try {
      const ciudadesData = await ciudad.findAll({ limit: 10, raw: true });
      console.table(ciudadesData);
    } catch (err) {
      console.log("   ⚠️ Tabla 'ciudad' no existe o está vacía");
    }
    console.log("");

    // 8. Información detallada de propiedades
    console.log("8. Propiedades con detalles (primeras 3):");
    console.log("───────────────────────────────────────────────────────────");
    try {
      const [propiedadesDetalle] = await sequelize.query(`
        SELECT 
          p.id,
          p.titulo,
          p.precio,
          p.descripcion,
          tp.nombre as tipo_propiedad,
          o.nombre as operacion,
          p.area,
          p.habitaciones,
          p.banos,
          p.parqueadero,
          c.nombre as ciudad
        FROM propiedades p
        LEFT JOIN tipos_propiedad tp ON p.tipo_propiedad_id = tp.id
        LEFT JOIN operacion o ON p.operacion_id = o.id
        LEFT JOIN ciudad c ON p.ciudad = c.id
        LIMIT 3
      `);
      console.table(propiedadesDetalle);
    } catch (err) {
      console.log("   ⚠️ Error al consultar propiedades con detalles:", err.message);
    }

    console.log("");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("✅ Consulta completada");
    console.log("═══════════════════════════════════════════════════════════");

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

consultarDB();

