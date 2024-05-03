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
    const response = await useAxios.get(
      `/paginate/transaksi/history/${id_user}`,
      {
        params: {
          page: page,
        },
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

const getNotaPesanan = async (no_nota) => {
  try {
    const response = await useAxios.post(
      `/get-nota`, no_nota ,
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

const getCustHistoryByPageSelf = async (page = 0) => {
  try {
    const response = await useAxios.get(`/paginate/transaksi/self/history`, {
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

const searchHistoryCustSelf = async (data) => {
  const find = {
    data: data,
  };
  try {
    const response = await useAxios.post(`/transaksi/search/self`, find, {
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
  getCustHistoryByPageSelf,
  searchHistoryCustSelf,
  getNotaPesanan,
};

export default APICust;
