import "dotenv/config";
import { sequelize } from "./src/db/database";
import { initModels } from "./src/models/init-models";

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

    const models = initModels(sequelize);
    const { usuarios, propiedades, tipos_propiedad, operacion, ciudad } = models;

    // 1. Listar tablas
    console.log("1. Tablas en la base de datos:");
    console.log("───────────────────────────────────────────────────────────");
    const [results] = await sequelize.query("SHOW TABLES");
    const tables = results.map((r: any) => Object.values(r)[0]) as string[];
    console.log("   Tablas encontradas:", tables.join(", "));
    console.log("");

    // 2. Contar registros por tabla
    console.log("2. Contando registros por tabla:");
    console.log("───────────────────────────────────────────────────────────");
    for (const table of tables) {
      try {
        const [count]: any = await sequelize.query(`SELECT COUNT(*) as count FROM \`${table}\``);
        console.log(`   ${table}: ${count[0].count} registros`);
      } catch (err: any) {
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
    } catch (err: any) {
      console.log("   ⚠️ Error al consultar usuarios:", err.message);
    }
    console.log("");

    // 4. Propiedades
    console.log("4. Propiedades (primeros 5):");
    console.log("───────────────────────────────────────────────────────────");
    try {
      const propiedadesData = await propiedades.findAll({
        limit: 5,
        attributes: ['id', 'titulo', 'precio', 'tipo_id', 'operacion_id', 'ciudad'],
        raw: true
      });
      console.table(propiedadesData);
    } catch (err: any) {
      console.log("   ⚠️ Error al consultar propiedades:", err.message);
      // Intentar con consulta SQL directa
      try {
        const [propiedadesSQL]: any = await sequelize.query(`
          SELECT id, titulo, precio, tipo_id, operacion_id, ciudad 
          FROM propiedades 
          LIMIT 5
        `);
        console.table(propiedadesSQL);
      } catch (sqlErr: any) {
        console.log("   ⚠️ Error en consulta SQL:", sqlErr.message);
      }
    }
    console.log("");

    // 5. Tipos de propiedad
    console.log("5. Tipos de Propiedad:");
    console.log("───────────────────────────────────────────────────────────");
    try {
      const tiposData = await tipos_propiedad.findAll({ raw: true });
      console.table(tiposData);
    } catch (err: any) {
      console.log("   ⚠️ Error al consultar tipos_propiedad:", err.message);
    }
    console.log("");

    // 6. Operaciones
    console.log("6. Operaciones:");
    console.log("───────────────────────────────────────────────────────────");
    try {
      const operacionesData = await operacion.findAll({ raw: true });
      console.table(operacionesData);
    } catch (err: any) {
      console.log("   ⚠️ Error al consultar operacion:", err.message);
    }
    console.log("");

    // 7. Ciudades
    console.log("7. Ciudades (si existe):");
    console.log("───────────────────────────────────────────────────────────");
    try {
      const ciudadesData = await ciudad.findAll({ limit: 10, raw: true });
      console.table(ciudadesData);
    } catch (err: any) {
      console.log("   ⚠️ Tabla 'ciudad' no existe o está vacía");
    }
    console.log("");

    // 8. Información detallada de propiedades
    console.log("8. Propiedades con detalles (primeras 3):");
    console.log("───────────────────────────────────────────────────────────");
    try {
      const [propiedadesDetalle]: any = await sequelize.query(`
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
          p.ciudad
        FROM propiedades p
        LEFT JOIN tipos_propiedad tp ON p.tipo_id = tp.id
        LEFT JOIN operacion o ON p.operacion_id = o.id
        LIMIT 3
      `);
      console.table(propiedadesDetalle);
    } catch (err: any) {
      console.log("   ⚠️ Error al consultar propiedades con detalles:", err.message);
    }

    console.log("");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("✅ Consulta completada");
    console.log("═══════════════════════════════════════════════════════════");

    await sequelize.close();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

consultarDB();

