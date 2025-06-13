import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "@hooks/useAuthFetch";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const authFetch = useAuthFetch();

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          authFetch(`/products/?category=${selectedCategory || ""}`),
          authFetch("/categories/"),
        ]);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    fetchData();
  }, [authFetch, selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="container fade-in">
      <div className="card">
        <h2>Product List</h2>
        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label htmlFor="categoryFilter">Filter by Category:</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
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
                <th>Price</th>
                <th></th>
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
                    <Link to={`/products/${product.id}`}>
                      {product.price}
                    </Link>
                  </td>
                  <td>
                    <Link className="center" to={`/products/edit/${product.id}`}>
                      <button className="btn btn-primary" style={{ marginRight: "10px" }}>
                        Edit
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