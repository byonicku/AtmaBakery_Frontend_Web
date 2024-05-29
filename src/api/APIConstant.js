import axios from "axios";

// const productionBaseUrl = "http://127.0.0.1:8000/"; // Local
const productionBaseUrl = "https://api-atma-bakery.vercel.app/"; // Vercel
// const fallbackBaseUrl = "https://api-atma-bakery.azurewebsites.net/"; // Azure
const fallbackBaseUrl = "https://api-atma-bakery.vercel.app/"; // Azure

const useAxios = axios.create({ baseURL: productionBaseUrl });

async function retryWithFallback(axiosInstance, originalRequest, error) {
  console.error("Primary base URL failed:", error.message);

  axiosInstance.defaults.baseURL = fallbackBaseUrl;

  const response = await axiosInstance(originalRequest);
  return response;
}

useAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.code === "ERR_CANCELED") {
      throw error;
    }

    if (!originalRequest._retry) {
      originalRequest._retry = true;

      if (
        (error.response &&
          error.response.status >= 500 &&
          error.response.status <= 599) ||
        !error.response
      ) {
        return retryWithFallback(useAxios, originalRequest, error);
      }
    }

    throw error;
  }
);

export default useAxios;
