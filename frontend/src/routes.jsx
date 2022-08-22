import { Navigate } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Search from "./pages/Search";

export const publicRoutes = [
  {path: '/home', element: <Home />},
  {path: '/search', element: <Search />},
  {path: '/error', element: <Error />},
  {path: '*', element: <Navigate to='/error' />}
];

export const userRoutes = [
  {path: '/home', element: <Home />},
  {path: '/search', element: <Search />},
  {path: '/error', element: <Error />},
  {path: '*', element: <Navigate to='/error' />}
];

export const adminRoutes = [
  {path: '/admin-panel/songs', element: <AdminPanel />, exact: false},
  {path: '/admin-panel/album', element: <AdminPanel />, exact: false},
  {path: '/admin-panel/playlist', element: <AdminPanel />, exact: false},
  {path: '/admin-panel/singer', element: <AdminPanel />, exact: false},
  {path: '/admin-panel', element: <Navigate to='/admin-panel/songs' />, exact: false}
]; 