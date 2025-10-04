import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api",
    timeout: 5000,
});

export const getItineraryBySlug = (slug) =>
    api.get(`/itineraries/slug/${slug}`).then((res) => res.data);

export const getCountriesByRegion = (region) =>
    api.get(`/itineraries/region/${region}`).then((res) => res.data);

export const getItinerariesByCountry = (country) =>
    api.get(`/itineraries/browse/${country}`).then((res) => res.data);

export const getItinerariesByRegion = (region) =>
    api.get(`/itineraries/${region}`).then((res) => res.data);

export const getMe = () =>
    api.get('/auth/me').then(res => res.data)

export const getFavoritesCount = (itineraryId) =>
    api.get(`/itineraries/${itineraryId}/favorites/count`).then((res) => res.data);

export const getFavoritesMe = (itineraryId) =>
    api.get(`/itineraries/${itineraryId}/favorites/me`).then((res) => res.data);

export const getMeFavorites = () =>
    api.get(`/itineraries/me/favorites`).then((res) => res.data);

export const getAllItinerariesByCustomSearch = (customSearch) =>
    api.get(`/itineraries/search?${customSearch}`).then((res) => res.data);

export const postUserRegister = (email, password, displayName) =>
    api.post("/auth/register", { email:email, password:password, displayName:displayName })
        .then((res) => {
            res.data;
        })

export const postUserLogin = (email, password) =>
    api.post("/auth/login", { email:email,password: password })
        .then((res) => res.data
        )

export const postUserPhoto = (file) =>{
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/auth/me/photo", formData,{headers: { 'Content-Type': 'multipart/form-data' }})
        .then((res) => res.data
        )
}

export const postFavorite = (itineraryId) =>
    api.post(`/itineraries/${itineraryId}/favorite`).then((res) => res.data);



export const updateUser = (payload) =>
    api.put("/auth/me",payload )
    .then((res) =>  res.data || payload
    )

export const updateUserPhoto = (payload) =>
    api.put("/auth/me/photo",payload )
        .then((res) =>  res.data || payload
        )

export const deleteFavorite = (itineraryId) =>
    api.delete(`/itineraries/${itineraryId}/favorite`).then((res) => res.data);



api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});