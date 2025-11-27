import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Configurar cliente de S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "inmobiliaria-propiedades";

/**
 * Sube un archivo a S3
 * @param fileBuffer - Buffer del archivo
 * @param fileName - Nombre del archivo (con extensión)
 * @param folder - Carpeta dentro del bucket (opcional)
 * @returns URL pública del archivo subido
 */
export const uploadToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  folder: string = "propiedades"
): Promise<string> => {
  try {
    const key = `${folder}/${Date.now()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: getContentType(fileName),
      // Nota: ACL "public-read" puede requerir que el bucket tenga políticas específicas
      // Si tienes problemas, configura el bucket para permitir acceso público o usa signed URLs
    });

    await s3Client.send(command);

    // Construir la URL pública
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
    
    return url;
  } catch (error) {
    console.error("Error subiendo archivo a S3:", error);
    throw error;
  }
};

/**
 * Elimina un archivo de S3
 * @param url - URL completa del archivo en S3
 */
export const deleteFromS3 = async (url: string): Promise<void> => {
  try {
    // Extraer la key del archivo desde la URL
    const key = extractKeyFromUrl(url);
    
    if (!key) {
      console.warn("No se pudo extraer la key de la URL:", url);
      return;
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error eliminando archivo de S3:", error);
    // No lanzar error para no interrumpir el flujo si falla la eliminación
  }
};

/**
 * Verifica si una URL es de S3
 * @param url - URL a verificar
 * @returns true si la URL es de S3
 */
export const isS3Url = (url: string): boolean => {
  return url.includes("s3.amazonaws.com") || url.includes(`s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com`);
};

/**
 * Extrae la key del archivo desde una URL de S3
 * @param url - URL completa del archivo
 * @returns key del archivo o null si no es una URL válida
 */
const extractKeyFromUrl = (url: string): string | null => {
  try {
    // Formato: https://bucket-name.s3.region.amazonaws.com/folder/filename
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Remover el primer slash
    return pathname.substring(1);
  } catch (error) {
    console.error("Error extrayendo key de URL:", error);
    return null;
  }
};

/**
 * Obtiene el content type basado en la extensión del archivo
 * @param fileName - Nombre del archivo
 * @returns content type
 */
const getContentType = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  
  const contentTypes: { [key: string]: string } = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  };

  return contentTypes[extension || ""] || "application/octet-stream";
};

export default s3Client;

