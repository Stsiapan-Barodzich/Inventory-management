import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/products/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then(setProduct)
      .catch(() => {
        alert("Ошибка при загрузке продукта");
        navigate("/products");
      });
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этот продукт?")) {
      const res = await fetch(`http://localhost:8000/products/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Продукт удалён");
        navigate("/products");
      } else {
        alert("Ошибка при удалении");
      }
    }
  };


  if (!product) return <p>Загрузка...</p>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>Цена: {product.price}</p>
      <p>Описание: {product.description}</p>
      <button onClick={() => navigate(`/products/edit/${id}`)}>Редактировать</button>
      <button
        onClick={handleDelete}
        style={{ marginLeft: "10px", backgroundColor: "#ff4d4f", color: "#fff" }}
      >
        Удалить
      </button>
      <br />
      <button onClick={() => navigate("/products")}>← Список продуктов</button>
    </div>
  );
}
