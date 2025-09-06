import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "@hooks/useAuthFetch";
import ErrorMessage from "../SharedComponents/ErrorMessage";

export default function AddProductForm() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      description: "",
    },
  });
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const [success, setSuccess] = useState("");

  const onSubmit = async (data) => {
    clearErrors();
    setSuccess("");

    const newProduct = {
      name: data.name,
      price: data.price,
      description: data.description,
    };

    try {
      await authFetch("http://localhost:8000/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      clearErrors();
      setSuccess("Product added successfully!");
      setTimeout(() => {
        navigate("/products");
      }, 1000);
    } catch {
      setError("root", {
        type: "manual",
        message: "Failed to add product.",
      });
    }
  };

  return (
    <div className="container fade-in">
      {errors.root && <ErrorMessage message={errors.root.message} />}
      {success && <ErrorMessage message={success} />}
      <div className="card">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              {...register("name", { required: true })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              step="0.01"
              id="price"
              {...register("price", { required: true })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea id="description" {...register("description")} />
          </div>
          <button type="submit" className="btn btn-success">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
