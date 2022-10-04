import { Navigate } from "react-router-dom";
import AdminPanel from './components/pages/AdminPanel';
import Error from './components/pages/Error';
import Home from './components/pages/Home';
import Search from './components/pages/Search';
import Favourite from './components/pages/Favourite';
import AlbumId from './components/pages/AlbumId';

export const publicRoutes = [
  { path: '/home', element: <Home /> },
  { path: '/home/albums', element: <Home /> },
  { path: '/search', element: <Search /> },
  { path: '/album/:id', element: <AlbumId />, exact: true },
  { path: '/error', element: <Error /> },
  { path: '/', element: <Navigate to='/home' /> },
  { path: '*', element: <Navigate to='/error' /> }
];

export const userRoutes = [
  { path: '/favourite', element: <Favourite /> },
];

export const adminRoutes = [
  { path: '/admin-panel/songs', element: <AdminPanel />, exact: false },
  { path: '/admin-panel/album', element: <AdminPanel />, exact: false },
  { path: '/admin-panel/playlist', element: <AdminPanel />, exact: false },
  { path: '/admin-panel/singer', element: <AdminPanel />, exact: false },
  { path: '/admin-panel', element: <Navigate to='/admin-panel/songs' />, exact: false }
]; 