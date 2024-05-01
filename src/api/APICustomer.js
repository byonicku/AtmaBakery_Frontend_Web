import useAxios from "./APIConstant.js";

const getAllCust = async () => {
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

const getCustByPage = async (page = 0) => {
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

const getCustHistoryByPage = async (id_user, page = 0) => {
  try {
    const response = await useAxios.get(`/paginate/transaksi/history/${id_user}`, {
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

const searchCust = async (search) => {
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


const APICust = {
  getAllCust,
  getCustByPage,
  getCustHistoryByPage,
  searchCust,
};

export default APICust;
