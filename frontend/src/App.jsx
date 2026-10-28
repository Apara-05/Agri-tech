
import { lazy,Suspense } from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
const Auth=lazy(()=>import('./pages/Auth'));const Dashboard=lazy(()=>import('./pages/Dashboard'));const Farms=lazy(()=>import('./pages/Farms'));const Crops=lazy(()=>import('./pages/Crops'));const Weather=lazy(()=>import('./pages/Weather'));const Orders=lazy(()=>import('./pages/Orders'));const Community=lazy(()=>import('./pages/Community'));const Admin=lazy(()=>import('./pages/Admin'));
export default function App(){return <BrowserRouter><AuthProvider><Suspense fallback={<div className="container py-5">Loading AgriTech…</div>}><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="login" element={<Auth mode="login"/>}/><Route path="register" element={<Auth mode="register"/>}/><Route element={<ProtectedRoute/>}><Route path="dashboard" element={<Dashboard/>}/><Route path="farms" element={<Farms/>}/><Route path="crops" element={<Crops/>}/><Route path="weather" element={<Weather/>}/><Route path="orders" element={<Orders/>}/><Route path="community" element={<Community/>}/></Route><Route element={<ProtectedRoute roles={['admin']}/>}><Route path="admin" element={<Admin/>}/></Route><Route path="*" element={<div className="empty-state"><span>🧭</span><h1 className="h4">Page not found</h1><p>This route appears to have wandered off.</p></div>}/></Route></Routes></Suspense></AuthProvider></BrowserRouter>}
