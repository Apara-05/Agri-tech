
import { Link,NavLink,Outlet,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Layout(){
 const {user,logout}=useAuth(); const navigate=useNavigate();
 return <><nav className="navbar navbar-expand-lg navbar-dark app-nav"><div className="container"><Link className="navbar-brand fw-bold" to="/">🌱 AgriTech</Link><button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navLinks" aria-label="Toggle navigation"><span className="navbar-toggler-icon"/></button><div className="collapse navbar-collapse" id="navLinks"><div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
 {user&&<><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink><NavLink className="nav-link" to="/farms">My farms</NavLink><NavLink className="nav-link" to="/crops">Crops</NavLink><NavLink className="nav-link" to="/weather">Weather</NavLink><NavLink className="nav-link" to="/orders">Orders</NavLink><NavLink className="nav-link" to="/community">Community</NavLink>{user.role==='admin'&&<NavLink className="nav-link" to="/admin">Admin</NavLink>}<span className="navbar-text small">{user.name}</span><button className="btn btn-outline-light btn-sm" onClick={()=>{logout();navigate('/login')}}>Log out</button></>}
 {!user&&<><NavLink className="nav-link" to="/login">Log in</NavLink><Link className="btn btn-light btn-sm" to="/register">Join AgriTech</Link></>}
 </div></div></div></nav><main className="container py-4 page-shell"><Outlet/></main><footer className="container py-4 text-center text-muted small">AgriTech · Better-informed farming, one decision at a time.</footer></>;
}
