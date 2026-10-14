const MAX_DIMENSION = 1600;
const TARGET_BYTES = 1_200_000;
const MIN_QUALITY = 0.5;
const MIN_SCALE = 0.5;

function render(bitmap: ImageBitmap, scale: number, quality: number): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) return Promise.reject(new Error("Canvas no disponible"));

  // Fondo blanco: los PNG con transparencia se vería negros al pasar a JPEG.
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("No se pudo codificar"))), "image/jpeg", quality);
  });
}

/**
 * Reduce una foto a un tamaño que cabe en el límite de subida del servidor
 * (el cuerpo de un Server Action tiene tope y las fotos de celular pesan varios MB).
 * Respeta la orientación EXIF. Si la foto ya es liviana, la devuelve sin tocar.
 */
export async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

  try {
    let scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    let quality = 0.82;
    let blob = await render(bitmap, scale, quality);

    while (blob.size > TARGET_BYTES && (quality > MIN_QUALITY || scale > MIN_SCALE)) {
      if (quality > MIN_QUALITY) {
        quality = Math.max(MIN_QUALITY, quality - 0.1);
      } else {
        scale *= 0.8;
      }
      blob = await render(bitmap, scale, quality);
    }

    if (file.size <= TARGET_BYTES && file.size <= blob.size) {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "foto";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}
