import useAxios from "./APIConstant.js";

const getRekapProduk = async () => {
  try {
    const response = await useAxios.get("/get-rekap-produk", {
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

const getRekapProdukPerluDibuat = async () => {
  try {
    const response = await useAxios.get("/get-rekap-produk-perlu-dibuat", {
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

const getRekapBahanBaku = async () => {
  try {
    const response = await useAxios.get("/get-rekap-bahan-baku", {
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

const getRekapBahanBakuPerProduk = async () => {
  try {
    const response = await useAxios.get("/get-rekap-bahan-baku-per-produk", {
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

const getRekapNotaHarian = async () => {
  try {
    const response = await useAxios.get("/get-rekap-nota-harian", {
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

const getLaporanBulananKeseluruhan = async (data) => {
  try {
    const response = await useAxios.post(
      "/get-laporan-bulanan-keseluruhan",
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

const getLaporanBulananPerProduk = async (data) => {
  try {
    const response = await useAxios.post(
      "/get-laporan-bulanan-per-produk",
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

const getLaporanStokBahanBaku = async () => {
  try {
    const response = await useAxios.get("/get-laporan-stok-bahan-baku", {
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

const getLaporanStokBahanBakuPeriode = async (data) => {
  try {
    const response = await useAxios.post(
      "/get-laporan-stok-bahan-baku-periode",
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

const getLaporanPemasukanDanPengeluaran = async (data) => {
  try {
    const response = await useAxios.post(
      "/get-laporan-pemasukan-dan-pengeluaran",
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

const getLaporanPresensiKaryawan = async (data) => {
  try {
    const response = await useAxios.post(
      "/get-laporan-presensi-karyawan",
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

const getLaporanTransaksiPenitip = async (data) => {
  try {
    const response = await useAxios.post(
      "/get-laporan-transaksi-penitip",
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

const APILaporan = {
  getRekapProduk,
  getRekapProdukPerluDibuat,
  getRekapBahanBaku,
  getRekapBahanBakuPerProduk,
  getRekapNotaHarian,
  getLaporanBulananKeseluruhan,
  getLaporanBulananPerProduk,
  getLaporanStokBahanBaku,
  getLaporanStokBahanBakuPeriode,
  getLaporanPemasukanDanPengeluaran,
  getLaporanPresensiKaryawan,
  getLaporanTransaksiPenitip,
};

export default APILaporan;
