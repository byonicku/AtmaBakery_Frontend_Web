import axios from "axios";

// const productionBaseUrl = "http://127.0.0.1:8000/"; // Local
const productionBaseUrl = "https://api-atma-bakery.vercel.app/"; // Vercel
const fallbackBaseUrl = "https://api-atma-bakery.azurewebsites.net/"; // Azure

const useAxios = axios.create({ baseURL: productionBaseUrl });

async function retryWithFallback(axiosInstance, originalRequest, error) {
  console.error("Primary base URL failed:", error.message);

  axiosInstance.defaults.baseURL = fallbackBaseUrl;

  try {
    const response = await axiosInstance(originalRequest);
    return response;
  } catch (error) {
    console.error("Fallback base URL also failed:", error.message);
    throw error;
  }
}

useAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest._retry) {
      originalRequest._retry = true;
      return retryWithFallback(useAxios, originalRequest, error);
    }
    throw error;
  }
);

export default useAxios;
