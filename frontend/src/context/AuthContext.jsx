
import { createContext,useContext,useMemo,useState } from 'react';
import api from '../services/api';
const AuthContext=createContext(null);
export function AuthProvider({children}){
 const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('agritech_user'))}catch{return null}});
 const save=data=>{localStorage.setItem('agritech_token',data.token);localStorage.setItem('agritech_user',JSON.stringify(data.user));setUser(data.user)};
 const login=async credentials=>save((await api.post('/auth/login',credentials)).data);
 const register=async details=>save((await api.post('/auth/register',details)).data);
 const logout=()=>{localStorage.removeItem('agritech_token');localStorage.removeItem('agritech_user');setUser(null)};
 const value=useMemo(()=>({user,login,register,logout}),[user]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
