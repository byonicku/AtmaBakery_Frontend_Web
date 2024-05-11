import useAxios from "./APIConstant";

const getAllPembelianBahanBaku = async () => {
  try {
    const response = await useAxios.get("/pembelian_bahan_baku", {
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

const getAllTrashedPembelianBahanBaku = async () => {
  try {
    const response = await useAxios.get("/trash/pembelian_bahan_baku", {
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

const getPembelianBahanBakuByPage = async (page = 0, signal) => {
  try {
    const response = await useAxios.get("/paginate/pembelian_bahan_baku", {
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

const searchPembelianBahanBaku = async (search) => {
  try {
    const response = await useAxios.get(
      `/pembelian_bahan_baku/search/${search}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error.response || error;
  }
};

const restorePembelianBahanBaku = async (id) => {
  try {
    const response = await useAxios.get(`/trash/pembelian_bahan_baku/${id}`, {
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

const createPembelianBahanBaku = async (data) => {
  try {
    const response = await useAxios.post("/pembelian_bahan_baku", data, {
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

const updatePembelianBahanBaku = async (data, id_bahan_baku) => {
  try {
    const response = await useAxios.put(
      `/pembelian_bahan_baku/${id_bahan_baku}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const deletePembelianBahanBaku = async (id) => {
  try {
    const response = await useAxios.delete(`/pembelian_bahan_baku/${id}`, {
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

const APIPembelianBahanBaku = {
  getAllPembelianBahanBaku,
  getAllTrashedPembelianBahanBaku,
  getPembelianBahanBakuByPage,
  restorePembelianBahanBaku,
  searchPembelianBahanBaku,
  createPembelianBahanBaku,
  updatePembelianBahanBaku,
  deletePembelianBahanBaku,
};

export default APIPembelianBahanBaku;
