import useAxios from "./APIConstant.js";

const getAllPenitip = async (signal) => {
  try {
    const response = await useAxios.get("/penitip", {
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

const getAllTrashedPenitip = async () => {
  try {
    const response = await useAxios.get("/trash/penitip", {
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

const getPenitipByPage = async (page = 0, signal) => {
  try {
    const response = await useAxios.get("/paginate/penitip", {
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

const searchPenitip = async (search) => {
  try {
    const response = await useAxios.get(`/penitip/search/${search}`, {
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

const restorePenitip = async (id) => {
  try {
    const response = await useAxios.get(`/penitip/restore/${id}`, {
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

const createPenitip = async (data) => {
  try {
    const response = await useAxios.post("/penitip", data, {
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

const updatePenitip = async (data, id_penitip) => {
  try {
    const response = await useAxios.put(`/penitip/${id_penitip}`, data, {
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

const deletePenitip = async (id) => {
  try {
    const response = await useAxios.delete(`/penitip/${id}`, {
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

const APIPenitip = {
  getAllPenitip,
  getPenitipByPage,
  getAllTrashedPenitip,
  searchPenitip,
  restorePenitip,
  createPenitip,
  updatePenitip,
  deletePenitip,
};

export default APIPenitip;
