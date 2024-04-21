import axios from "axios";

// Local Development
// const BASE_URL = '127.0.0.1:8000';

// Production
export const BASE_URL = "api-atma-bakery.vercel.app"; // Vercel
// export const BASE_URL = "api-atma-bakery.azurewebsites.net"; // Azure

// Local use HTTP
// export const API_URL = `http://${BASE_URL}/`;

// Production use HTTPS
// export const API_URL = `https://${BASE_URL}/api/`;
export const API_URL = `https://${BASE_URL}/`; // Azure ndak usah pake /api/

const useAxios = axios.create({ baseURL: API_URL });

export default useAxios;
