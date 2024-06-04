import useAxios from "./APIConstant.js";

const getNotifikasi = async () => {
  try {
    const response = await useAxios.get("/get-notif/self", {
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

const APINotifikasi = { getNotifikasi };

export default APINotifikasi;
