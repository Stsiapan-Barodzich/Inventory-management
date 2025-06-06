import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";

export default function AddProductStockForm() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

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
        alert("Failed to load data: " + error.message);
      }
    }
    fetchData();
  }, [authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedWarehouse || !selectedProduct || !quantity) {
      alert("Please fill in all fields");
      return;
    }

    const newStock = {
      warehouse: selectedWarehouse,
      product: selectedProduct,
      quantity: Number(quantity),
    };

    try {
      await authFetch("http://localhost:8000/product-stocks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStock),
      });
      alert("Product stock added successfully!");
      navigate("/product-stocks");
    } catch (error) {
      alert("Failed to add product stock: " + error.message);
    }
  };

  return (
    <div className="container fade-in">
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
