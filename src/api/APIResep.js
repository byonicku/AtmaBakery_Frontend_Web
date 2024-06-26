import useAxios from "./APIConstant.js";

const getAllProduk = async () => {
  try {
    const response = await useAxios.get("/resep", {
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

const getProdukByPage = async (page = 0, signal) => {
  try {
    const response = await useAxios.get("/paginate/resep", {
      params: {
        page: page,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      signal: signal,
    });
    return response.data.data;
  } catch (error) {
    throw error.response || error;
  }
};

const searchResep = async (search) => {
  try {
    const response = await useAxios.get(`/resep/search/${search}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    return response.data.data;
  } catch (error) {
    throw error.response || error;
  }
};

const getResep = async (id_produk) => {
  try {
    const response = await useAxios.get(`/resep/${id_produk}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.resep;
  } catch (error) {
    throw error.response || error;
  }
};

const createResep = async (data) => {
  try {
    const response = await useAxios.post(`/resep`, data, {
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

const deleteBahanBakuFromResep = async (data) => {
  try {
    const response = await useAxios.delete(`/resep/${data}`, {
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

const updateBahanBakuInResep = async (data) => {
  try {
    const response = await useAxios.put(`/resep`, data, {
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

const APIResep = {
  getAllProduk,
  getProdukByPage,
  searchResep,
  getResep,
  createResep,
  deleteBahanBakuFromResep,
  updateBahanBakuInResep,
};

export default APIResep;
