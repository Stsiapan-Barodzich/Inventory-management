import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProductStockForm() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    
    fetch("http://localhost:8000/warehouses/")
      .then((res) => res.json())
      .then(setWarehouses)
      .catch((err) => console.error("Ошибка загрузки складов:", err));

    
    fetch("http://localhost:8000/products/")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error("Ошибка загрузки продуктов:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedWarehouse || !selectedProduct || !quantity) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    const newStock = {
      warehouse: selectedWarehouse,
      product: selectedProduct,
      quantity: Number(quantity),
    };

    const res = await fetch("http://localhost:8000/product-stocks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStock),
    });

    if (res.ok) {
      alert("Товар добавлен на склад!");
      navigate("/product-stocks"); 
    } else {
      alert("Ошибка при добавлении товара на склад");
    }
  };

  return (
    <div>
      <h2>Добавление товара на склад</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Склад:</label>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            required
          >
            <option value="">-- Выберите склад --</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Продукт:</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          >
            <option value="">-- Выберите продукт --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Количество:</label>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <button type="submit">Добавить товар на склад</button>
      </form>
    </div>
  );
}
