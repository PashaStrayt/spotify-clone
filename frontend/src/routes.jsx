import { Navigate } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import Error from "./pages/Error";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Favourite from "./pages/Favourite";
import Search from "./pages/Search";
import { userStore } from "./store/UserStore";

export const publicRoutes = [
  {path: '/home', element: <Home />},
  {path: '/search', element: <Search />},
  {path: '/registration', element: userStore.isAuth === 'true' ? <Navigate to='/home' /> : <Registration />},
  {path: '/login', element: userStore.isAuth === 'true' ? <Navigate to='/home' /> : <Login />},
  {path: '/error', element: <Error />},
  {path: '/', element: <Navigate to='/home' />},
  {path: '*', element: <Navigate to='/error' />}
];

export const userRoutes = [
  {path: '/favourite', element: <Favourite />},
];

export const adminRoutes = [
  {path: '/admin-panel/songs', element: <AdminPanel />, exact: false},
  {path: '/admin-panel/album', element: <AdminPanel />, exact: false},
  {path: '/admin-panel/playlist', element: <AdminPanel />, exact: false},
  {path: '/admin-panel/singer', element: <AdminPanel />, exact: false},
  {path: '/admin-panel', element: <Navigate to='/admin-panel/songs' />, exact: false}
]; 