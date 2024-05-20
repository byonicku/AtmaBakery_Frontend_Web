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

const getCustByPage = async (page = 0, signal, filter) => {
  if (filter === "Semua") {
    filter = "";
  }

  try {
    const response = await useAxios.get("/paginate/users", {
      params: {
        page: page,
        filter: filter,
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

const getCustHistoryByPage = async (id_user, page = 0, signal, filter) => {
  if (filter === "Semua") {
    filter = "";
  }

  try {
    const response = await useAxios.get(
      `/paginate/transaksi/history/${id_user}`,
      {
        params: {
          page: page,
          filter: filter,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        signal: signal,
      }
    );
    return response.data.data;
  } catch (error) {
    throw error.response || error;
  }
};

const getNotaPesanan = async (no_nota) => {
  try {
    const response = await useAxios.post(`/get-nota`, no_nota, {
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

const getNotaPesananSelf = async (no_nota) => {
  try {
    const response = await useAxios.post(`/get-nota/self`, no_nota, {
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

const getCustHistoryByPageSelf = async (page = 0, signal, status) => {
  if (status === "Semua") {
    status = "";
  }
  try {
    const response = await useAxios.get(`/paginate/transaksi/self/history`, {
      params: {
        page: page,
        status: status,
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

const searchHistoryCustSelf = async (data, status) => {
  if (status === "Semua") {
    status = "";
  }
  const find = {
    data: data,
  };
  try {
    const response = await useAxios.post(`/transaksi/search/self`, find, {
      params: {
        status: status,
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

const getCustHistoryByPageAll = async (page = 0, signal, filter) => {
  if (filter === "Semua") {
    filter = "";
  }

  try {
    const response = await useAxios.get(`/paginate/transaksi/all`, {
      params: {
        page: page,
        status: filter,
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

const searchCustHistoryAll = async (search, status) => {
  if (status === "Semua") {
    status = "";
  }

  const data = {
    data: search,
  };

  try {
    const response = await useAxios.post(`/transaksi/all/search`, data, {
      params: {
        status: status,
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

const APICust = {
  getAllCust,
  getCustByPage,
  getCustHistoryByPage,
  searchCust,
  getCustHistoryByPageSelf,
  getNotaPesananSelf,
  searchHistoryCustSelf,
  getNotaPesanan,
  getCustHistoryByPageAll,
  searchCustHistoryAll,
};

export default APICust;
