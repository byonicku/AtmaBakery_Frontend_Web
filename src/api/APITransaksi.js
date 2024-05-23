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
  try {
    const response = await useAxios.post("/transaksi/bayar", data, {
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

const addJarak = async (data) => {
  try {
    const response = await useAxios.post("/konfirmasi/transaksi/ongkir", data, {
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

const konfirmasiTransaksiAdmin = async (data) => {
  try {
    const response = await useAxios.post(
      "/konfirmasi/transaksi/pembayaran",
      data,
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

const konfirmasiPesananMO = async (data) => {
  try {
    const response = await useAxios.post(
      "/konfirmasi/transaksi/pesanan",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const tolakPesananMO = async (data) => {
  try {
    const response = await useAxios.post(
      "/tolak/transaksi/pesanan",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const APITransaksi = {
  countTransaksi,
  countTransaksiWithHampers,
  checkoutTransaksi,
  confirmBayar,
  addJarak,
  konfirmasiTransaksiAdmin,
  konfirmasiPesananMO,
  tolakPesananMO,
};

export default APITransaksi;
