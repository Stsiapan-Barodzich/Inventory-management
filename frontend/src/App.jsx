import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext.jsx';
import PrivateRoute from './Routes/PrivateRoute.jsx';
import Layout from './components/SharedComponents/Layout/Layout.jsx';
import Login from './components/AuthComponents/Login.jsx';
import Logout from './components/AuthComponents/Logout.jsx';

import WarehouseList from './components/WarehouseComponents/WarehouseList.jsx';
import WarehouseDetail from './components/WarehouseComponents/WarehouseDetail.jsx';
import AddWarehouseForm from './components/WarehouseComponents/AddWarehoseForm.jsx';
import EditWarehouseForm from './components/WarehouseComponents/EditWarehouseForm.jsx';

import ProductList from './components/ProductComponents/ProductList.jsx';
import ProductDetail from './components/ProductComponents/ProductDetail.jsx';
import AddProductForm from './components/ProductComponents/AddProductForm.jsx';
import EditProductForm from './components/ProductComponents/EditProductForm.jsx';

import UserList from './components/UserComponents/UserList.jsx';
import UserDetail from './components/UserComponents/UserDetail.jsx';
import AddUserForm from './components/UserComponents/AddUserForm.jsx';
import EditUserForm from './components/UserComponents/EditUserForm.jsx';

import AddProductStockForm from './components/ProductStockComponents/AddproductStockForm.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/api/token" replace />} />
          <Route path="/api/token" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/warehouses" element={<WarehouseList />} />
              <Route path="/warehouses/:id" element={<WarehouseDetail />} />
              <Route path="/warehouses/add" element={<AddWarehouseForm />} />
              <Route path="/warehouses/edit/:id" element={<EditWarehouseForm />} />

              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/products/add" element={<AddProductForm />} />
              <Route path="/products/edit/:id" element={<EditProductForm />} />
              
              <Route path="/users" element={<UserList />} />
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/users/add" element={<AddUserForm />} />
              <Route path="/users/edit/:id" element={<EditUserForm />} />
              
              <Route path="/product-stocks" element={<AddProductStockForm />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

