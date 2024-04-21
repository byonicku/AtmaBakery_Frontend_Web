import axios from "axios";
import useAxios from "./APIConstant";

const API_IMAGE = `https://api.cloudinary.com/v1_1/daorbrq8v/image`;
const useAxiosImage = axios.create({ baseURL: API_IMAGE });

const uploadImage = async (data, filename) => {
  data.append("upload_preset", "atma-bakery");
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
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const deleteGambar = async (id) => {
  try {
    const response = await useAxios.delete(`/gambar/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const APIGambar = {
  uploadImage,
  createGambar,
  deleteGambar,
};

export default APIGambar;
