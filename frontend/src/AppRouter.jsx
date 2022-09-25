import { observer } from "mobx-react-lite";
import { Navigate, Route, Routes } from "react-router-dom";
import { adminRoutes, publicRoutes, userRoutes } from "./routes";
import { userStore } from "./stores/UserStore";
import Registration from './components/pages/Registration';
import Login from './components/pages/Login';

const AppRouter = observer(() => {
  return (
    <Routes>
      <Route
        path='/registration'
        element={userStore.isAuth ? <Navigate to='/home' /> : <Registration />}
      />
      <Route
        path='/login'
        element={userStore.isAuth ? <Navigate to='/home' /> : <Login />}
      />
      {
        publicRoutes.map(route =>
          <Route
            path={route.path}
            key={route.path}
            element={route.element}
            exact={route.exact}
          />
        )
      }
      {
        userStore.isAuth ?
          userRoutes.map(route =>
            <Route
              path={route.path}
              key={route.path}
              element={route.element}
              exact={route.exact}
            />
          ) :
          ''
      }
      {
        userStore.role === 'ADMIN' && userStore.isAuth?
          adminRoutes.map(route =>
            <Route
              path={route.path}
              key={route.path}
              element={route.element}
              exact={route.exact}
            />
          ) :
          ''
      }
    </Routes>
  )
});

export default AppRouter;