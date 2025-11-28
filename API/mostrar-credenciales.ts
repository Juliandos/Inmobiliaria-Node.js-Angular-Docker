import "dotenv/config";
import { sequelize } from "./src/db/database";
import { initModels } from "./src/models/init-models";

const mostrarCredenciales = async () => {
  try {
    console.log("═══════════════════════════════════════════════════════════");
    console.log("🔐 CREDENCIALES DE USUARIOS");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("");

    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");
    console.log("");

    const models = initModels(sequelize);
    const { usuarios, roles } = models;

    // Obtener todos los usuarios con sus roles
    const usuariosData = await usuarios.findAll({
      include: [{
        model: roles,
        as: 'rol',
        attributes: ['nombre']
      }],
      attributes: ['id', 'email', 'nombre', 'apellido', 'rol_id'],
      raw: false
    });

    console.log("📋 USUARIOS Y CONTRASEÑAS:");
    console.log("───────────────────────────────────────────────────────────");
    console.log("");
    console.log("⚠️ IMPORTANTE: Todas las contraseñas son: 123456");
    console.log("");
    console.log("Usuarios creados:");
    console.log("");

    usuariosData.forEach((usuario: any) => {
      const userData = usuario.toJSON();
      const rolNombre = userData.rol?.nombre || 'Sin rol';
      console.log(`  👤 ${userData.nombre} ${userData.apellido}`);
      console.log(`     Email: ${userData.email}`);
      console.log(`     Contraseña: 123456`);
      console.log(`     Rol: ${rolNombre} (ID: ${userData.rol_id})`);
      console.log("");
    });

    console.log("═══════════════════════════════════════════════════════════");
    console.log("💡 RESUMEN:");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("");
    console.log("Administrador:");
    console.log("  Email: admin@test.com");
    console.log("  Contraseña: 123456");
    console.log("  Permisos: Todos (crear, leer, actualizar, eliminar)");
    console.log("");
    console.log("Jefe:");
    console.log("  Email: jefe@test.com");
    console.log("  Contraseña: 123456");
    console.log("  Permisos: Todos (crear, leer, actualizar, eliminar)");
    console.log("");
    console.log("Secretario:");
    console.log("  Email: secretario@test.com");
    console.log("  Contraseña: 123456");
    console.log("  Permisos: Solo lectura y actualización (sin crear ni eliminar)");
    console.log("");
    console.log("Usuario:");
    console.log("  Email: usuario@test.com");
    console.log("  Contraseña: 123456");
    console.log("  Permisos: Solo lectura en propiedades y tipos de propiedad");
    console.log("");

    await sequelize.close();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

mostrarCredenciales();

