import axios from "axios";
import useAxios from "./APIConstant";

const API_IMAGE = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}/image`;
const useAxiosImage = axios.create({ baseURL: API_IMAGE });

const uploadImage = async (data, filename) => {
  data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  data.append("filename_override", filename);
  data.append("public_id", filename);

  try {
    const response = await useAxiosImage.post("/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const createGambar = async (data) => {
  try {
    const response = await useAxios.post("/gambar", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const APIGambar = {
  uploadImage,
  createGambar
};

export default APIGambar;
