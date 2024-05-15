import useAxios from "./APIConstant";

const getAllCart = async () => {
  try {
    const response = await useAxios.get("/cart", {
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

const createCart = async (data) => {
  try {
    const response = await useAxios.post("/cart", data, {
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

const updateCart = async (data, id_cart) => {
  try {
    const response = await useAxios.put(`/cart/${id_cart}`, data, {
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

const updateWhenLogout = async (data) => {
  try {
    const response = await useAxios.put(`/cart/logout`, data, {
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

const deleteCart = async (id) => {
  try {
    const response = await useAxios.delete(`/cart/${id}`, {
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

const deleteCartAll = async () => {
  try {
    const response = await useAxios.delete(`/cart/all`, {
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

const APICart = {
  getAllCart,
  createCart,
  updateCart,
  updateWhenLogout,
  deleteCart,
  deleteCartAll,
};

export default APICart;
