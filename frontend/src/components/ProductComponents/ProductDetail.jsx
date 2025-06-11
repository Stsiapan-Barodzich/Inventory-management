import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/products/${id}/`)
      .then((res) => res.json())
      .then(setProduct);
  }, [id]);

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:8000/products/${id}/`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("Product deleted");
      navigate("/products");
    }
  };

  return (
    <div>
      <h2>{product.name}</h2>
      <p>Price: {product.price}</p>
      <p>Description: {product.description}</p>
      <button onClick={() => navigate(`/products/${id}/edit`)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
