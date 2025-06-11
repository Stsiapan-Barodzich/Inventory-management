import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/warehouses">Список складов</Link></li>
          <li><Link to="/products">Список продуктов</Link></li>
          <li><Link to="/users">Список пользователей</Link></li>
          <li><Link to="/productstocks">Добавить товар на склад</Link></li>


        </ul>
      </nav>

      <Routes>
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


        <Route path="/productstocks" element={<AddProductStockForm />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
