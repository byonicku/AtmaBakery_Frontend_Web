import useAxios from "./APIConstant.js";

const getAllDetailHampers = async () => {
  try {
    const response = await useAxios.get("/detail_hampers", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const createDetailHampers = async (data) => {
  try {
    const response = await useAxios.post("/detail_hampers", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const updateDetailHampers = async (data, id_detail_hampers) => {
  try {
    const response = await useAxios.put(
      `/detail_hampers/${id_detail_hampers}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const deleteDetailHampers = async (id) => {
  try {
    const response = await useAxios.delete(`/detail_hampers/${id}`, {
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

const APIDetailHampers = {
  getAllDetailHampers,
  createDetailHampers,
  updateDetailHampers,
  deleteDetailHampers,
};

export default APIDetailHampers;
