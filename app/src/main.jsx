import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "./App";
import "./index.css";
import IndexPage from "./container/home";
import LoginPage from "./container/home/login/login";
import ProductPage from "./container/home/productGrid";
import CategoryPage from "./container/home/categoryGrid";
import ProductDetail from "./container/home/productDetail";
import CategorySubPage from "./container/home/categorySub";
import CartPage from "./container/home/cart";
import DoneOrder from "./container/home/done";
import DashBoardPage from "./container/admin/dashboard";
import EditOrderPage from "./container/admin/components/EditOrderPage";
import ProductManagementPage from "./container/admin/productMangementPage";
import EditProductPage from "./container/admin/components/EditProductPage";

// Function to check user role (this is a placeholder, implement your actual logic)
const checkUserRole = () => {
    // Replace this with your actual user role checking logic
    const user = JSON.parse(localStorage.getItem('user')); // Example: get user from local storage
    return user ? user.role : null; // Return the role or null if not logged in
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <IndexPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/product",
        element: <ProductPage />,
      },
      {
        path: "/category",
        element: <CategoryPage />,
      },
      {
        path: "/categorySub/:id",
        element: <CategorySubPage />,
      },
      {
        path: "/productDetail/:id",
        element: <ProductDetail />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/done",
        element: <DoneOrder />,
      },
      {
        path: "/admin/orders",
        element: checkUserRole() === 'admin' ? <DashBoardPage /> : <Navigate to="/" />,
      },
      {
        path: "/admin/orders/edit/:id",
        element: checkUserRole() === 'admin' ? <EditOrderPage /> : <Navigate to="/" />,
      },
      {
        path: "/admin/products",
        element: checkUserRole() === 'admin' ? <ProductManagementPage /> : <Navigate to="/" />,
      },
      {
        path: "/admin/products/edit/:id",
        element: checkUserRole() === 'admin' ? <EditProductPage /> : <Navigate to="/" />,
      },
      {
        path: "/admin/products/add",
        element: checkUserRole() === 'admin' ? <EditProductPage /> : <Navigate to="/" />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

