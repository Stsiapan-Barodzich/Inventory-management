import { Route, Navigate, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx';
import Layout from '@components/SharedComponents/Layout/Layout.jsx';
import Login from '@components/AuthComponents/Login.jsx';
import Logout from '@components/AuthComponents/Logout.jsx';
import WarehouseList from '@components/WarehouseComponents/WarehouseList.jsx';
import WarehouseDetail from '@components/WarehouseComponents/WarehouseDetail.jsx';
import AddWarehouseForm from '@components/WarehouseComponents/AddWarehouseForm.jsx';
import EditWarehouseForm from '@components/WarehouseComponents/EditWarehouseForm.jsx';
import ProductList from '@components/ProductComponents/ProductList.jsx';
import ProductDetail from '@components/ProductComponents/ProductDetail.jsx';
import AddProductForm from '@components/ProductComponents/AddProductForm.jsx';
import EditProductForm from '@components/ProductComponents/EditProductForm.jsx';
import UserList from '@components/UserComponents/UserList.jsx';
import UserDetail from '@components/UserComponents/UserDetail.jsx';
import AddUserForm from '@components/UserComponents/AddUserForm.jsx';
import EditUserForm from '@components/UserComponents/EditUserForm.jsx';
import AddProductStockForm from '@components/ProductStockComponents/AddProductStockForm.jsx';

function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login/" replace />} />
      <Route path="/login/" element={<Login />} />
      <Route path="/register" element={<AddUserForm />} />
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
          <Route path="/product-stocks" element={<ProductStockList />} />
          <Route path="/add-product-stock" element={<AddProductStockForm />} />
          <Route path="/transfer" element={<TransferProductForm />} />
          <Route path="/transfer-logs" element={<TransferLogList />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/edit-category/:id" element={<EditCategoryForm />} />

        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
