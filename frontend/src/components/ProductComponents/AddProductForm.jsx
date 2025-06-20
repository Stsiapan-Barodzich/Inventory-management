import { useState, useEffect } from "react";
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
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      description: "",
      category: "",
    },
  });

  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await authFetch("/categories/");
        console.log("Fetched categories:", data);
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        setError("root", {
          type: "manual",
          message: "Failed to load categories: " + error.message,
        });
        console.error("Fetch error:", error);
      }
    }
    fetchCategories();
  }, [authFetch, setError]);

  const onSubmit = async (data) => {
    clearErrors();
    setSuccess("");

    const newProduct = {
      name: data.name,
      price: data.price,
      description: data.description,
      category: data.category || null,
    };

    try {
      await authFetch("/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      setSuccess("Product added successfully!");
      reset();
      setTimeout(() => {
        navigate("/products");
      }, 1000);
    } catch (error) {
      console.error("API error:", error);
      const errorMessage = error.response?.data
        ? Object.values(error.response.data).flat().join(" ")
        : error.message;
      setError("root", {
        type: "manual",
        message: "Failed to add product: " + errorMessage,
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
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <ErrorMessage message={errors.name.message} />}
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              step="0.01"
              id="price"
              {...register("price", {
                required: "Price is required",
                min: { value: 0.01, message: "Price must be positive" },
              })}
            />
            {errors.price && <ErrorMessage message={errors.price.message} />}
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select id="category" {...register("category")}>
              <option value="">No Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea id="description" {...register("description")} />
          </div>
          <button type="submit" className="btn btn-success">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
