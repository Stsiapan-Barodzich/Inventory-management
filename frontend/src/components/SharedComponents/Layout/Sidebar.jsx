import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/warehouses">Warehouses</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/product-stocks">Product Stocks</Link></li>
          <li>
            <Link to="/api/token" className="logout-link">
              Log out
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

