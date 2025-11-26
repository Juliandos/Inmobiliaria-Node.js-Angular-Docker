// Script para listar todas las imágenes de propiedades desde Cloudinary
import "dotenv/config";
import { models } from "./src/db/database";
import cloudinary from "./src/utils/cloudinary";

async function listImages() {
  try {
    console.log('🔍 Listando imágenes de propiedades...\n');

    // Opción 1: Listar desde la base de datos
    console.log('📊 Imágenes en la Base de Datos:');
    console.log('='.repeat(60));
    
    const imagenes = await models.imagenes_propiedad.findAll({
      include: [{ model: models.propiedades, as: "propiedad" }],
      order: [['createdAt', 'DESC']]
    });

    if (imagenes.length === 0) {
      console.log('❌ No hay imágenes en la base de datos.\n');
    } else {
      imagenes.forEach((img, index) => {
        const imgData = img.toJSON();
        console.log(`\n${index + 1}. ID: ${imgData.id}`);
        console.log(`   Propiedad ID: ${imgData.propiedad_id}`);
        console.log(`   Propiedad: ${imgData.propiedad?.titulo || 'N/A'}`);
        console.log(`   URL: ${imgData.url}`);
        console.log(`   Creada: ${imgData.createdAt}`);
        console.log(`   Es Cloudinary: ${imgData.url?.includes('cloudinary') ? '✅ Sí' : '❌ No'}`);
      });
      console.log(`\n✅ Total: ${imagenes.length} imágenes\n`);
    }

    // Opción 2: Listar desde Cloudinary directamente
    console.log('\n☁️  Imágenes en Cloudinary (carpeta "propiedades"):');
    console.log('='.repeat(60));
    
    try {
      const result = await cloudinary.search
        .expression('folder:propiedades')
        .sort_by([['created_at', 'desc']])
        .max_results(100)
        .execute();

      if (result.resources && result.resources.length > 0) {
        result.resources.forEach((resource: any, index: number) => {
          console.log(`\n${index + 1}. Public ID: ${resource.public_id}`);
          console.log(`   URL: ${resource.secure_url}`);
          console.log(`   Tamaño: ${(resource.bytes / 1024).toFixed(2)} KB`);
          console.log(`   Formato: ${resource.format}`);
          console.log(`   Creada: ${resource.created_at}`);
        });
        console.log(`\n✅ Total en Cloudinary: ${result.resources.length} imágenes\n`);
      } else {
        console.log('❌ No hay imágenes en Cloudinary en la carpeta "propiedades".\n');
      }
    } catch (cloudinaryError: any) {
      console.error('❌ Error consultando Cloudinary:', cloudinaryError.message);
      console.log('💡 Verifica que las credenciales de Cloudinary estén configuradas correctamente.\n');
    }

    await models.sequelize?.close();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listImages();

