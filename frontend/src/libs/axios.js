import axios from "axios"

console.log(import.meta.env.MODE)
export const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
    withCredentials: true,
})


