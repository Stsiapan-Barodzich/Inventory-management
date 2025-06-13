import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function ProductStockList() {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStocks() {
      try {
        setIsLoading(true);
        const data = await authFetch("http://localhost:8000/product-stocks/");
        console.log("Fetched stocks:", data);
        setStocks(Array.isArray(data) ? data : []);
      } catch (error) {
        setError("Failed to load stocks: " + error.message);
        console.error("Fetch error:", error);
        setStocks([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStocks();
  }, [authFetch]);

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      <div className="card">
        <h2>Product Stocks</h2>
        <div className="button-group" style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => navigate("/add-product-stock")}
          >
            Add Product Stock
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => navigate("/transfer")}
          >
            Transfer Product
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => navigate("/transfer-logs")}
          >
            View Transfer Logs
          </button>
        </div>
        {isLoading ? (
          <p>Loading stocks...</p>
        ) : stocks.length === 0 ? (
          <p>No stocks found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Warehouse</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.id || stock.product_name + stock.warehouse_name}>
                  <td>{stock.product?.name || stock.product_name || "Unknown Product"}</td>
                  <td>{stock.warehouse?.name || stock.warehouse_name || "Unknown Warehouse"}</td>
                  <td>{stock.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}