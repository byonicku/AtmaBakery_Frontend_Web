import useAxios from "./APIConstant.js";

const login = async (data) => {
  try {
    const response = await useAxios.post("login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

const logout = async () => {
  try {
    const response = await useAxios.post(
      "logout",
      {},
      {
        headers: {
            "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

const register = async (data) => {
  try {
    const response = await useAxios.post("register", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

const sendEmailForResetPassword = async (data) => {
  try {
    const response = await useAxios.post("password/email", {}, {
        params: {
            email: data.email,
        },
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

const resetPassword = async (data) => {
  try {
    const response = await useAxios.post("password/reset", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

const APIAuth = {
  login,
  logout,
  register,
  sendEmailForResetPassword,
  resetPassword,
};

export default APIAuth;
