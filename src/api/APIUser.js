import useAxios from "./APIConstant.js";

const getSelf = async () => {
  try {
    const response = await useAxios.get("/users/self", {
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

const getAllUser = async () => {
  try {
    const response = await useAxios.get("/users", {
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

const getUserByPage = async (page = 0) => {
  try {
    const response = await useAxios.get("/paginate/users", {
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

const searchUser = async (search) => {
  try {
    const response = await useAxios.get(`/users/search/${search}`, {
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

const createUser = async (data) => {
  try {
    const response = await useAxios.post("/users", data, {
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

const updateUser = async (data, id_User) => {
  try {
    const response = await useAxios.put(`/users/${id_User}`, data, {
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

const deleteUser = async (id) => {
  try {
    const response = await useAxios.delete(`/users/${id}`, {
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

const APIUser = {
  getSelf,
  getAllUser,
  getUserByPage,
  searchUser,
  createUser,
  updateUser,
  deleteUser,
};

export default APIUser;
