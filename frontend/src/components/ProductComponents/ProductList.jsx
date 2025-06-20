import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "@hooks/useAuthFetch";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const authFetch = useAuthFetch();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await authFetch("/products/");
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    }
    fetchProducts();
  }, [authFetch]);

  return (
    <div className="container fade-in">
      <div className="card">
        <h2>Product List</h2>
        <Link to="/products/add">
          <button className="btn btn-success" style={{ marginBottom: "20px" }}>
            Add Product
          </button>
        </Link>
        {products.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Link to={`/products/${product.id}`}>
                      {product.name}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/products/edit/${product.id}`}>
                      <button className="btn btn-primary" style={{ marginRight: "10px" }}>
                        Edit
                      </button>
                    </Link>
                    <Link to={`/products/${product.id}`}>
                      <button className="btn btn-primary">
                        Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
}
