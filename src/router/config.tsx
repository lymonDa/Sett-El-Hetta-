import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import ProductsPage from "../pages/products/page";
import ProductDetailPage from "../pages/products/detail/page";
import CartPage from "../pages/cart/page";
import CheckoutPage from "../pages/checkout/page";
import OrderConfirmationPage from "../pages/order-confirmation/page";
import TrackOrderPage from "../pages/track-order/page";
import OurStoryPage from "../pages/our-story/page";
import GalleryPage from "../pages/gallery/page";
import ContactPage from "../pages/contact/page";
import BlogPage from "../pages/blog/page";
import BlogDetailPage from "../pages/blog/detail/page";
import CustomerLoginPage from "../pages/account/login/page";
import CustomerSignupPage from "../pages/account/signup/page";
import MyOrdersPage from "../pages/account/orders/page";
import AdminLoginPage from "../pages/admin/login/page";
import AdminOrdersPage from "../pages/admin/orders/page";
import AdminOrderDetailPage from "../pages/admin/orders/detail/page";
import AdminProductsPage from "../pages/admin/products/page";
import AdminProductEditPage from "../pages/admin/products/edit/page";
import AdminInventoryPage from "../pages/admin/inventory/page";
import AdminReportsPage from "../pages/admin/reports/page";
import AdminBlogPage from "../pages/admin/blog/page";
import AdminBlogEditPage from "../pages/admin/blog/edit/page";
import AdminDashboardPage from "../pages/admin/dashboard/page";
import AdminUsersPage from "../pages/admin/users/page";
import AdminGuard from "../components/feature/AdminGuard";

const routes: RouteObject[] = [
  // Storefront
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/products",
    element: <ProductsPage />,
  },
  {
    path: "/products/:slug",
    element: <ProductDetailPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/order-confirmation",
    element: <OrderConfirmationPage />,
  },
  {
    path: "/track-order",
    element: <TrackOrderPage />,
  },
  {
    path: "/our-story",
    element: <OurStoryPage />,
  },
  {
    path: "/gallery",
    element: <GalleryPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  // Blog
  {
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/blog/:slug",
    element: <BlogDetailPage />,
  },
  // Customer Account
  {
    path: "/account/login",
    element: <CustomerLoginPage />,
  },
  {
    path: "/account/signup",
    element: <CustomerSignupPage />,
  },
  {
    path: "/account/orders",
    element: <MyOrdersPage />,
  },
  // Admin
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminGuard><AdminDashboardPage /></AdminGuard>,
  },
  {
    path: "/admin/orders",
    element: <AdminOrdersPage />,
  },
  {
    path: "/admin/orders/:id",
    element: <AdminOrderDetailPage />,
  },
  {
    path: "/admin/products",
    element: <AdminProductsPage />,
  },
  {
    path: "/admin/products/new",
    element: <AdminProductEditPage />,
  },
  {
    path: "/admin/products/:id/edit",
    element: <AdminProductEditPage />,
  },
  {
    path: "/admin/inventory",
    element: <AdminInventoryPage />,
  },
  {
    path: "/admin/reports",
    element: <AdminReportsPage />,
  },
  // Admin Blog
  {
    path: "/admin/blog",
    element: <AdminBlogPage />,
  },
  {
    path: "/admin/blog/new",
    element: <AdminBlogEditPage />,
  },
  {
    path: "/admin/blog/:id/edit",
    element: <AdminBlogEditPage />,
  },
  // Admin Users (Owner only)
  {
    path: "/admin/users",
    element: <AdminGuard requireRole="OWNER"><AdminUsersPage /></AdminGuard>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;