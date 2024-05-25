import useAxios from "./APIConstant.js";

const getHistorySaldoByPage = async (page = 0, signal, filter) => {
  if (filter === "Semua") {
    filter = "";
  }

  try {
    const response = await useAxios.get("/paginate/histori_saldo", {
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

  const confirmSaldoAdmin = async (id_histori) => {
    const token = sessionStorage.getItem("token");
    console.log("Token:", token);
    try {
      const response = await useAxios.put(
        `/histori_saldo/konfirmasi/${id_histori}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response || error;
    }
  };



const APISaldo = {
    getHistorySaldoByPage,
    confirmSaldoAdmin,
  };
  
  export default APISaldo;