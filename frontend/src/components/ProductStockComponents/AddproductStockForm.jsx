import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function AddProductStockForm() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
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
    console.log("Submitting:", { selectedWarehouse, selectedProduct, quantity });

    if (!selectedWarehouse || !selectedProduct || !quantity) {
      setError("Please fill in all fields");
      console.log("Validation failed");
      return;
    }

    const newStock = {
      warehouse: selectedWarehouse,
      product: selectedProduct,
      quantity: Number(quantity),
    };

    try {
      console.log("Sending request with:", newStock);
      const response = await authFetch("http://localhost:8000/product-stocks/", {
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
      setError("Failed to add product stock: " + error.message);
    }
  };

  return (
    <div className="container fade-in">
      {error && <ErrorMessage message={error} />}
      {success && <ErrorMessage message={success} />}
      <div className="card">
        <h2>Add Product Stock</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="warehouse">Warehouse:</label>
            <select
              id="warehouse"
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              required
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
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Add Product Stock
          </button>
        </form>
      </div>
    </div>
  );
}