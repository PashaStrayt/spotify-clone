import { observer } from "mobx-react-lite";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import { adminRoutes, publicRoutes, userRoutes } from "./routes";
import { userStore } from "./store/UserStore";

export const AppRouter = observer(() => {
  return (
    <Routes>
      <Route
        path='/registration'
        element={userStore.isAuth === 'true' ? <Navigate to='/home' /> : <Registration />}
      />
      <Route
        path='/login'
        element={userStore.isAuth === 'true' ? <Navigate to='/home' /> : <Login />}
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
        userStore.isAuth === 'true' ?
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
        userStore.role === 'ADMIN' && userStore.isAuth === 'true' ?
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