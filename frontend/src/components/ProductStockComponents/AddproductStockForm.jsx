import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "@hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function AddProductStockForm() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [warehousesData, productsData] = await Promise.all([
          authFetch("/warehouses/"),
          authFetch("/products/"),
        ]);
        setWarehouses(Array.isArray(warehousesData) ? warehousesData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        setError("Failed to load data: " + error.message);
        console.error("Fetch error:", error);
        setWarehouses([]);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedWarehouseId || !selectedProductId || !quantity) {
      setError("Please fill in all fields");
      return;
    }

    const quantityNum = Number(quantity);
    if (quantityNum <= 0) {
      setError("Quantity must be positive");
      return;
    }

    const newStock = {
      product_id: Number(selectedProductId),
      warehouse_id: Number(selectedWarehouseId),
      quantity: quantityNum,
    };

    try {
      const response = await authFetch("/product-stocks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStock),
      });
      setSuccess("Product stock added successfully!");
      setTimeout(() => {
        navigate("/product-stocks");
      }, 1000);
    } catch (error) {
      console.error("API error:", error);
      const errorMessage = error.response?.data
        ? Object.values(error.response.data).flat().join(" ")
        : error.message;
      setError("Failed to add product stock: " + errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="container fade-in">
        <div className="card">
          <p>Loading warehouses and products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="success-message" style={{ color: "green", marginBottom: "10px" }}>
          {success}
        </div>
      )}
      <div className="card">
        <h2>Add Product Stock</h2>
        {warehouses.length === 0 && <p>No warehouses available.</p>}
        {products.length === 0 && <p>No products available.</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="warehouse">Warehouse:</label>
            <select
              id="warehouse"
              value={selectedWarehouseId}
              onChange={(e) => setSelectedWarehouseId(e.target.value)}
              required
              disabled={warehouses.length === 0}
            >
              <option value="">-- Choose a warehouse --</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="product">Product:</label>
            <select
              id="product"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
              disabled={products.length === 0}
            >
              <option value="">-- Choose a product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-success"
            disabled={warehouses.length === 0 || products.length === 0}
          >
            Add Product Stock
          </button>
        </form>
      </div>
    </div>
  );
}
