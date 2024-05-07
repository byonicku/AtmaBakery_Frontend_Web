import useAxios from "./APIConstant";

const getAllBahanBaku = async (signal) => {
  try {
    const response = await useAxios.get("/bahan_baku", {
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

const getAllTrashedBahanBaku = async () => {
  try {
    const response = await useAxios.get("/trash/bahan_baku", {
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

const getBahanBakuByPage = async (page = 0, signal) => {
  try {
    const response = await useAxios.get("/paginate/bahan_baku", {
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

const searchBahanBaku = async (search) => {
  try {
    const response = await useAxios.get(`/bahan_baku/search/${search}`, {
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

const createBahanBaku = async (data) => {
  try {
    const response = await useAxios.post("/bahan_baku", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const restoreBahanBaku = async (id) => {
  try {
    const response = await useAxios.get(`/bahan_baku/restore/${id}`, {
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

const updateBahanBaku = async (data, id_bahan_baku) => {
  try {
    const response = await useAxios.put(`/bahan_baku/${id_bahan_baku}`, data, {
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

const deleteBahanBaku = async (id) => {
  try {
    const response = await useAxios.delete(`/bahan_baku/${id}`, {
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

const APIBahanBaku = {
  getAllBahanBaku,
  getAllTrashedBahanBaku,
  getBahanBakuByPage,
  searchBahanBaku,
  createBahanBaku,
  restoreBahanBaku,
  updateBahanBaku,
  deleteBahanBaku,
};

export default APIBahanBaku;
