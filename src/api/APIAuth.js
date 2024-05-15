import useAxios from "./APIConstant.js";

const login = async (data) => {
  try {
    const response = await useAxios.post("login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    sessionStorage.setItem("token", response.data.token);
    sessionStorage.setItem("role", response.data.data.id_role);
    sessionStorage.setItem("foto_profil", response.data.data.foto_profil);
    sessionStorage.setItem("nama", response.data.data.nama);
    sessionStorage.setItem("tanggal_lahir", response.data.data.tanggal_lahir);
    sessionStorage.setItem("no_telp", response.data.data.no_telp);
    sessionStorage.setItem("email", response.data.data.email);
    sessionStorage.setItem("jenis_kelamin", response.data.data.jenis_kelamin);
    sessionStorage.setItem("poin", response.data.data.poin);
    sessionStorage.setItem("saldo", response.data.data.saldo);

    return response.data;
  } catch (error) {
    throw error.response || error;
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
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    sessionStorage.clear();

    return response.data;
  } catch (error) {
    throw error.response || error;
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
    throw error.response || error;
  }
};

const sendEmailForResetPassword = async (data) => {
  try {
    const response = await useAxios.post(
      "password/email",
      {},
      {
        params: {
          email: data.email,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response || error;
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
    throw error.response || error;
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
    throw error.response || error;
  }
};

const verifyEmailToken = async (data) => {
  try {
    const response = await useAxios.post(`/verify/${data.token}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const APIAuth = {
  login,
  logout,
  register,
  sendEmailForResetPassword,
  resetPassword,
  verifyPasswordToken,
  verifyEmailToken,
};

export default APIAuth;
