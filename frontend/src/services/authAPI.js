import axios from "axios";

const api = axios.create({
    baseURL: "https://whatsapp-2be7.onrender.com",
});

export const googleAuth = (code) => api.get(`/api/auth/google?code=${code}`);


