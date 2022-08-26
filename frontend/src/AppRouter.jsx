import { observer } from "mobx-react-lite";
import { Route, Routes } from "react-router-dom";
import { adminRoutes, publicRoutes, userRoutes } from "./routes";
import { userStore } from "./store/UserStore";

export const AppRouter = observer(() => {
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