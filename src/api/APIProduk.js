import useAxios from "./APIConstant";

const getAllProduk = async (signal) => {
  try {
    const response = await useAxios.get("/produk", {
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

const getAllProdukTrashed = async () => {
  try {
    const response = await useAxios.get("/trash/produk", {
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

const restoreProduk = async (id) => {
  try {
    const response = await useAxios.get(`/produk/restore/${id}`, {
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
    const response = await useAxios.get("/paginate/produk", {
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

const getProdukByPagePublic = async (page = 0) => {
  try {
    const response = await useAxios.get("/public/paginate/produk", {
      params: {
        page: page,
      },
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

const searchProduk = async (search) => {
  const data = {
    data: search,
  };

  try {
    const response = await useAxios.post(`/produk/search`, data, {
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

const showProduk = async (id, signal) => {
  try {
    const response = await useAxios.get(`/produk/${id}`, {
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

const createProduk = async (data, uploadImage) => {
  try {
    const response = await useAxios.post("/produk", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    const id = response.data.data.id_produk;
    await uploadImage(id);

    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const updateProduk = async (data, id_produk, uploadImage, deleteImage) => {
  try {
    const response = await useAxios.put(`/produk/${id_produk}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    await uploadImage(id_produk);
    await deleteImage();

    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const deleteProduk = async (id) => {
  try {
    const response = await useAxios.delete(`/produk/${id}`, {
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

const APIProduk = {
  getAllProduk,
  getAllProdukTrashed,
  restoreProduk,
  getProdukByPage,
  getProdukByPagePublic,
  showProduk,
  searchProduk,
  createProduk,
  updateProduk,
  deleteProduk,
};

export default APIProduk;
