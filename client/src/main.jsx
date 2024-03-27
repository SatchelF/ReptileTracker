import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Home } from './Home.jsx';
import { Login } from './Login.jsx';
import { SignUp } from './SignUp.jsx';
import { Dashboard } from './Dashboard.jsx';
import { Reptile } from './Reptile.jsx';
import AddReptileModal from './components/AddReptileModal/AddReptileModal.jsx';

const router = createHashRouter([
  {
    path: "",
    element:  <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/sign_up",
        element: <SignUp />
      },
      {
        path: "/dashboard",
        element: (
          <>
            <Dashboard />
            <AddReptileModal />
          </>
        )
      },
      {
        path: "/reptiles/:reptileId",
        element: <Reptile />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
