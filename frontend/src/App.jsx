import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import { useAuth } from './AuthContext';

import WarehouseList from './components/WarehouseComponents/WarehouseList.jsx';
import WarehouseDetail from './components/WarehouseComponents/WarehouseDetail.jsx';
import AddWarehouseForm from './components/WarehouseComponents/AddWarehoseForm.jsx';
import EditWarehouseForm from './components/WarehouseComponents/EditWarehouseForm.jsx';

import ProductList from './components/ProductComponents/ProductList.jsx';
import ProductDetail from './components/ProductComponents/ProductDetail.jsx';
import AddProductForm from './components/ProductComponents/AddProductForm.jsx';
import EditProductForm from './components/ProductComponents/EditproductForm.jsx';

import UserList from './components/UserComponents/UserList.jsx';
import UserDetail from './components/UserComponents/UserDetail.jsx';
import AddUserForm from './components/UserComponents/AddUserForm.jsx';
import EditUserForm from './components/UserComponents/EditUserForm.jsx';

import AddProductStockForm from './components/ProductStockComponents/AddproductStockForm.jsx';
import './App.css';

function App() {
  const { user, logoutUser } = useAuth();

  return (
    <>
      {user && (
        <nav>
          <ul>
            <li><Link to="/warehouses">Список складов</Link></li>
            <li><Link to="/products">Список продуктов</Link></li>
            <li><Link to="/users">Список пользователей</Link></li>
            <li><Link to="/productstocks">Добавить товар на склад</Link></li>
            <li><button onClick={logoutUser}>Выйти</button></li>
          </ul>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/warehouses" element={<PrivateRoute><WarehouseList /></PrivateRoute>} />
        <Route path="/warehouses/:id" element={<PrivateRoute><WarehouseDetail /></PrivateRoute>} />
        <Route path="/warehouses/add" element={<PrivateRoute><AddWarehouseForm /></PrivateRoute>} />
        <Route path="/warehouses/edit/:id" element={<PrivateRoute><EditWarehouseForm /></PrivateRoute>} />

        <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
        <Route path="/products/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
        <Route path="/products/add" element={<PrivateRoute><AddProductForm /></PrivateRoute>} />
        <Route path="/products/edit/:id" element={<PrivateRoute><EditProductForm /></PrivateRoute>} />

        <Route path="/users" element={<PrivateRoute><UserList /></PrivateRoute>} />
        <Route path="/users/:id" element={<PrivateRoute><UserDetail /></PrivateRoute>} />
        <Route path="/users/add" element={<PrivateRoute><AddUserForm /></PrivateRoute>} />
        <Route path="/users/edit/:id" element={<PrivateRoute><EditUserForm /></PrivateRoute>} />

        <Route path="/productstocks" element={<PrivateRoute><AddProductStockForm /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
