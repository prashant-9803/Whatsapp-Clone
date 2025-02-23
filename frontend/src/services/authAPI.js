import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000",
});

export const googleAuth = (code) => api.get(`/api/auth/google?code=${code}`);


