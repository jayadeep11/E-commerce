import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import SearchModal from './components/layout/SearchModal';
import Footer from './components/layout/Footer';
import PublicRoute from './components/auth/PublicRoute';
import AdminRoute from './components/auth/AdminRoute';

const Home = lazy(() => import('./pages/user/Home'));
const Shop = lazy(() => import('./pages/user/Shop'));
const ProductDetails = lazy(() => import('./pages/user/ProductDetails'));
const Cart = lazy(() => import('./pages/user/Cart'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Profile = lazy(() => import('./pages/user/Profile'));
const Orders = lazy(() => import('./pages/user/Orders'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserList = lazy(() => import('./pages/admin/UserList'));
const ProductList = lazy(() => import('./pages/admin/ProductList'));
const OrderList = lazy(() => import('./pages/admin/OrderList'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const OrderDetails = lazy(() => import('./pages/user/OrderDetails'));
const Categories = lazy(() => import('./pages/user/Categories'));
const Checkout = lazy(() => import('./pages/user/Checkout'));
const NotFound = lazy(() => import('./pages/NotFound'));



const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const showFooterOn = ['/home', '/categories'];
  const shouldShowFooter = showFooterOn.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow w-full max-w-full">
        {children}
      </main>
      <SearchModal />
      {shouldShowFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/home" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            {}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/order-success" element={<OrderSuccess />} />

            {}
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserList />} />
              <Route path="products" element={<ProductList />} />
              <Route path="orders" element={<OrderList />} />
            </Route>

            {}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
