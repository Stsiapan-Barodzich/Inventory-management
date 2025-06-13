import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function TransferProductForm() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [quantity, setQuantity] = useState("");
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [warehousesData, productsData] = await Promise.all([
          authFetch("http://localhost:8000/warehouses/"),
          authFetch("http://localhost:8000/products/"),
        ]);
        setWarehouses(warehousesData);
        setProducts(productsData);
      } catch (error) {
        setError("Failed to load data: " + error.message);
        console.error("Fetch error:", error);
      }
    }
    fetchData();
  }, [authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log("Submitting:", { selectedProduct, fromWarehouse, toWarehouse, quantity });

    if (!selectedProduct || !fromWarehouse || !toWarehouse || !quantity) {
      setError("Please fill in all fields");
      console.log("Validation failed");
      return;
    }

    if (fromWarehouse === toWarehouse) {
      setError("Source and destination warehouses cannot be the same");
      console.log("Warehouse validation failed");
      return;
    }

    const transferData = {
      product_id: Number(selectedProduct),
      from_warehouse_id: Number(fromWarehouse),
      to_warehouse_id: Number(toWarehouse),
      quantity: Number(quantity),
    };

    try {
      console.log("Sending request with:", transferData);
      const response = await authFetch("http://localhost:8000/product-stocks/transfer/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });
      setSuccess("Product transferred successfully!");
      setTimeout(() => {
        navigate("/product-stocks");
      }, 1000);
    } catch (error) {
      console.error("API error:", error);
      setError("Failed to transfer product: " + error.message);
    }
  };

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      {success && <ErrorMessage message={success} />}
      <div className="card">
        <h2>Transfer Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product">Product:</label>
            <select
              id="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
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
            <label htmlFor="fromWarehouse">From Warehouse:</label>
            <select
              id="fromWarehouse"
              value={fromWarehouse}
              onChange={(e) => setFromWarehouse(e.target.value)}
              required
            >
              <option value="">-- Choose source warehouse --</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="toWarehouse">To Warehouse:</label>
            <select
              id="toWarehouse"
              value={toWarehouse}
              onChange={(e) => setToWarehouse(e.target.value)}
              required
            >
              <option value="">-- Choose destination warehouse --</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
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
          <button type="submit" className="btn btn-success">
            Transfer Product
          </button>
        </form>
      </div>
    </div>
  );
}