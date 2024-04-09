import useAxios from "./APIConstant.js";

const login = async (data) => {
  try {
    const response = await useAxios.post("login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
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
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const register = async (data) => {
  try {
    const response = await useAxios.post("register", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
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
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const resetPassword = async (data) => {
  try {
    const response = await useAxios.post("password/reset", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const verifyPasswordToken = async (data) => {
  try {
    const response = await useAxios.post("password/verify", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

const APIAuth = {
  login,
  logout,
  register,
  sendEmailForResetPassword,
  resetPassword,
  verifyPasswordToken,
};

export default APIAuth;
