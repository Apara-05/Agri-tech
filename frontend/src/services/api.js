
import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api',timeout:12000,headers:{'Content-Type':'application/json'}});
api.interceptors.request.use(config=>{
 const token=localStorage.getItem('agritech_token');
 if(token) config.headers.Authorization=`Bearer ${token}`;
 return config;
});
api.interceptors.response.use(response=>response,error=>{
 if(error.response?.status===401){localStorage.removeItem('agritech_token');localStorage.removeItem('agritech_user');}
 return Promise.reject(error);
});
export default api;
