import { useEffect } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigation,
  useRouteError,
} from "react-router-dom";

import Diagnostic from "../../pages/app/Diagnostic.jsx";
import Home from "../../pages/app/Home.jsx";
import Identification from "../../pages/app/Identification.jsx";
import Result from "../../pages/app/Result.jsx";
import Method from "./methode/Method.jsx";
import Spinner from "./shared/Spinner.jsx";
import VerticalNavbar from "./shared/VerticalNavbar.jsx";

export default function App() {
  useEffect(() => {
    // Animation d'entrée
    const appContainer = document.querySelector(".app-wrapper");
    appContainer.style.opacity = "0";

    requestAnimationFrame(() => {
      appContainer.style.transition = "opacity 0.3s ease-in-out";
      appContainer.style.opacity = "1";
    });
  }, []);
  console.log("App est bien rendu !");
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/app",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        // path: "/app",
        element: <Home />,
      },
      {
        path: "methode",
        element: <Method />,
      },
      {
        path: "identification",
        element: <Identification />,
      },
      {
        path: "diagnostic",
        element: <Diagnostic />,
      },
      {
        path: "resultats",
        element: <Result />,
      },
    ],
  },
]);

function Root() {
  const { state } = useNavigation();
  console.log("Root est bien rendu !");
  return (
    <>
      <header>
        <VerticalNavbar />
      </header>

      <div className="container">
        {state === "loading" && <Spinner />}
        <Outlet />
      </div>
    </>
  );
}

function ErrorPage() {
  const error = useRouteError();
  return (
    <>
      <h1>Une erreur est survenue</h1>
      <p>{error?.error?.toString() ?? error?.toString()}</p>
    </>
  );
}
