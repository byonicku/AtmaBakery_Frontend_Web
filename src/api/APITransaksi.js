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

const APITransaksi = {
  countTransaksi,
  countTransaksiWithHampers,
};

export default APITransaksi;
