import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes/index";
import Layout from "./components/layout";
import PrivateRoute from "./components/layout/private/private";
const App = () => {
  return <Router>
    <Routes>
      {publicRoutes.map((route: any) => {
        const Pages = route.component;
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Layout>
                <Pages />
              </Layout>
            }
          />
        );
      })}
      {privateRoutes.map((route: any) => {
        const Pages = route.component;
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute>
                <Layout>
                  <Pages />
                </Layout>
              </PrivateRoute>
            }
          />
        );
      })}
    </Routes>
  </Router>
}

export default App;