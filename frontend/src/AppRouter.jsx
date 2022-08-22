import { Route, Routes } from "react-router-dom";
import { adminRoutes, publicRoutes } from "./routes";
import { userStore } from "./store/UserStore";

export const AppRouter = () => {
  return (
    <Routes>
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
        userStore.role === 'ADMIN' && userStore.isAuth ?
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
}