import useAxios from "./APIConstant";

const getAlamatSelf = async (signal) => {
  try {
    const response = await useAxios.get("/alamat/self", {
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

const getAlamatSelfByPage = async (page = 0, signal) => {
  try {
    const response = await useAxios.get("/paginate/alamat/self", {
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

const searchAlamatSelf = async (search) => {
  const data = {
    data: search,
  };
  try {
    const response = await useAxios.post("/alamat/self/search", data, {
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

const createAlamatSelf = async (data) => {
  try {
    const response = await useAxios.post("/alamat/self", data, {
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

const updateAlamatSelf = async (data, id_alamat) => {
  try {
    const response = await useAxios.put(`/alamat/self/${id_alamat}`, data, {
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

const deleteAlamat = async (id) => {
  try {
    const response = await useAxios.delete(`/alamat/self/${id}`, {
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

const APIAlamat = {
  getAlamatSelf,
  getAlamatSelfByPage,
  searchAlamatSelf,
  createAlamatSelf,
  updateAlamatSelf,
  deleteAlamat,
};

export default APIAlamat;
