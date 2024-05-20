import useAxios from "./APIConstant.js";

const countTransaksi = async (data) => {
  try {
    const response = await useAxios.post("/transaksi/count", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const countTransaksiWithHampers = async (data) => {
  try {
    const response = await useAxios.post("/transaksi/hampers/count", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const checkoutTransaksi = async (data) => {
  try {
    const response = await useAxios.post("/transaksi", data, {
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

const confirmBayar = async (data) => {
  console.log(data.bukti_bayar);
  const formData = new FormData();
    formData.append('no_nota', data.no_nota);
    formData.append('bukti_bayar', data.bukti_bayar);
  try {
    const response = await useAxios.post("/transaksi/bayar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response || error;
  }
};

const APITransaksi = {
  countTransaksi,
  countTransaksiWithHampers,
  checkoutTransaksi,
  confirmBayar,
};

export default APITransaksi;
