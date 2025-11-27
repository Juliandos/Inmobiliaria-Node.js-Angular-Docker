// Script para listar todas las imágenes de propiedades desde la base de datos
import "dotenv/config";
import { models } from "./src/db/database";
import { isS3Url } from "./src/utils/s3";

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
        console.log(`   Es S3: ${imgData.url && isS3Url(imgData.url) ? '✅ Sí' : '❌ No'}`);
      });
      console.log(`\n✅ Total: ${imagenes.length} imágenes\n`);
    }

    // Opción 2: Resumen de imágenes por tipo de almacenamiento
    console.log('\n📊 Resumen por tipo de almacenamiento:');
    console.log('='.repeat(60));
    
    const imagenesS3 = imagenes.filter(img => {
      const url = img.toJSON().url;
      return url && isS3Url(url);
    });
    
    const imagenesOtros = imagenes.filter(img => {
      const url = img.toJSON().url;
      return url && !isS3Url(url);
    });
    
    console.log(`\n✅ Imágenes en S3: ${imagenesS3.length}`);
    console.log(`📎 Otras URLs: ${imagenesOtros.length}`);
    console.log(`\n💡 Para listar objetos directamente desde S3, usa la consola de AWS o el AWS CLI.\n`);

    await models.sequelize?.close();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listImages();

