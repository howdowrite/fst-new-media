import imageCompression from "browser-image-compression"

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const validateImage = (file: File) => {
  if(!file.type.startsWith("image/")) throw new Error("Only images are allowed.");
  if(file.size > 5 * 1024 * 1024) throw new Error("Max size is 5 MB.");
}

export const compressImage = async(file: File) => {
  return imageCompression(file, {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    fileType: "image/jpeg"
   })
}

const uploadToCloudinary = async (file: File): Promise<string> =>  {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed.");
  }

  const data = await response.json();

  return data.secure_url;
}

export const uploadThumbnail = async(file: File): Promise<string> => {
  validateImage(file);
  const compressed = await compressImage(file);
  return uploadToCloudinary(compressed);
}
