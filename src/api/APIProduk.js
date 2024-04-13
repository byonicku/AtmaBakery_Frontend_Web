import useAxios from "./APIConstant";

const getAllProduk = async () => {
  try {
    const response = await useAxios.get("/produk", {
      headers: {
        "Content-Type": "application/json",
        //   Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response || error;
  }
};

const getProdukByPage = async (page = 0) => {
  try {
    const response = await useAxios.get("/paginate/produk", {
      params: {
        page: page,
      },
      headers: {
        "Content-Type": "application/json",
        //   Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    
    throw error.response || error;
  }
};

const searchProduk = async (search) => {
  try {
    const response = await useAxios.get(`/produk/search/${search}`, {
      headers: {
        "Content-Type": "application/json",
        //   Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response || error;
  }
};

const showProduk = async (id) => {
  try {
    const response = await useAxios.get(`/produk/${id}`, {
      headers: {
        "Content-Type": "application/json",
        //   Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
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
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    const id = response.data.data.id_produk;
    await uploadImage(id);
    
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const updateProduk = async (data, id_produk) => {
  try {
    const response = await useAxios.put(`/produk/${id_produk}`, data, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
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
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const APIProduk = {
  getAllProduk,
  getProdukByPage,
  showProduk,
  searchProduk,
  createProduk,
  updateProduk,
  deleteProduk,
};

export default APIProduk;
