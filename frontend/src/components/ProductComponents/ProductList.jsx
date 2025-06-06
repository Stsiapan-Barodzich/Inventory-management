import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "../../useAuthFetch";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const authFetch = useAuthFetch();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await authFetch("http://localhost:8000/products/");
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    }
    fetchProducts();
  }, [authFetch]);

  return (
    <div>
      <h2>Product List</h2>

      <Link to="/products/add">
        <button>Add Product</button>
      </Link>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
