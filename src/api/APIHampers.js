import useAxios from "./APIConstant.js";

const getAllHampers = async () => {
  try {
    const response = await useAxios.get("/hampers", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const getAllHampersTrashed = async () => {
  try {
    const response = await useAxios.get("/trash/hampers", {
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

const getHampersByPage = async (page = 0, signal) => {
  try {
    const response = await useAxios.get("/paginate/hampers", {
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

const searchHampers = async (search) => {
  try {
    const response = await useAxios.get(`/hampers/search/${search}`, {
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

const restoreHampers = async (id) => {
  try {
    const response = await useAxios.get(`/hampers/restore/${id}`, {
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

const createHampers = async (data, uploadImage) => {
  try {
    const response = await useAxios.post("/hampers", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    const id = response.data.data.id_hampers;
    await uploadImage(id);

    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const updateHampers = async (
  data,
  id_hampers,
  uploadImage,
  handleDeleteImage
) => {
  try {
    const response = await useAxios.put(`/hampers/${id_hampers}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    await uploadImage(id_hampers);
    await handleDeleteImage();

    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const deleteHampers = async (id) => {
  try {
    const response = await useAxios.delete(`/hampers/${id}`, {
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

const APIHampers = {
  getAllHampers,
  getAllHampersTrashed,
  restoreHampers,
  getHampersByPage,
  searchHampers,
  createHampers,
  updateHampers,
  deleteHampers,
};

export default APIHampers;
