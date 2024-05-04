import useAxios from "./APIConstant";

const getAllPengeluaran = async () => {
  try {
    const response = await useAxios.get("/pengeluaran_lain", {
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

const getPengeluaranByPage = async (page = 0, signal) => {
  try {
    const response = await useAxios.get("/paginate/pengeluaran_lain", {
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

const searchPengeluaran = async (search) => {
  try {
    const response = await useAxios.get(`/pengeluaran_lain/search/${search}`, {
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

const createPengeluaran = async (data) => {
  try {
    const response = await useAxios.post("/pengeluaran_lain", data, {
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

const updatePengeluaran = async (data, id_bahan_baku) => {
  try {
    const response = await useAxios.put(
      `/pengeluaran_lain/${id_bahan_baku}`,
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

const deletePengeluaran = async (id) => {
  try {
    const response = await useAxios.delete(`/pengeluaran_lain/${id}`, {
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

const APIPengeluaran = {
  getAllPengeluaran,
  getPengeluaranByPage,
  searchPengeluaran,
  createPengeluaran,
  updatePengeluaran,
  deletePengeluaran,
};

export default APIPengeluaran;
