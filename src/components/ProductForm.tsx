"use client";
import { useState, useEffect } from "react";

interface FormData {
  title: string;
  category: string;
  tags: string;
}

interface ValidationErrors {
  title?: string;
  category?: string;
  tags?: string;
}

interface ProductFormProps {
  formData: FormData;
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const categories = [
  "T-shirt",
  "Dress",
  "Hoodie",
  "Jeans",
  "Shoes",
  "Accessory",
];

export default function ProductForm({
  formData,
  onFormChange,
  onTagsChange,
}: ProductFormProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({
    title: false,
    category: false,
    tags: false,
  });

  // Reset touched state when formData is reset (empty title indicates form reset)
  useEffect(() => {
    if (!formData.title && !formData.category && !formData.tags) {
      setTouched({
        title: false,
        category: false,
        tags: false,
      });
    }
  }, [formData]);

  // Validate form on data change
  useEffect(() => {
    const newErrors: ValidationErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Product title should be at least 3 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
  }, [formData]);

  // Handle field blur (mark field as touched)
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle field change with custom wrapper
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onFormChange(e);
    // Mark field as touched when user starts typing
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  // Only show errors for touched fields
  const shouldShowError = (field: keyof ValidationErrors) => {
    return touched[field] && errors[field];
  };

  return (
    <>
      <div>
        <label
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-foreground"
        >
          Product Title <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={() => handleBlur("title")}
          required
          className={`bg-card border ${
            shouldShowError("title") ? "border-destructive" : "border-input"
          } text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 transition-colors duration-200 ease-in-out`}
          placeholder="e.g., Cool Graphic Tee"
          aria-invalid={!!shouldShowError("title")}
          aria-describedby={
            shouldShowError("title") ? "title-error" : undefined
          }
        />
        {shouldShowError("title") && (
          <p id="title-error" className="mt-1 text-xs text-destructive">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="block mb-2 text-sm font-medium text-foreground"
        >
          Category <span className="text-destructive">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          onBlur={() => handleBlur("category")}
          required
          className={`bg-card border ${
            shouldShowError("category") ? "border-destructive" : "border-input"
          } text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 transition-colors duration-200 ease-in-out appearance-none pr-8 bg-no-repeat bg-right`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 0.5rem center",
            backgroundSize: "1.5em 1.5em",
          }}
          aria-invalid={!!shouldShowError("category")}
          aria-describedby={
            shouldShowError("category") ? "category-error" : undefined
          }
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {shouldShowError("category") && (
          <p id="category-error" className="mt-1 text-xs text-destructive">
            {errors.category}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block mb-2 text-sm font-medium text-foreground"
        >
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={(e) => {
            onTagsChange(e);
            setTouched((prev) => ({ ...prev, tags: true }));
          }}
          onBlur={() => handleBlur("tags")}
          className={`bg-card border ${
            shouldShowError("tags") ? "border-destructive" : "border-input"
          } text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 transition-colors duration-200 ease-in-out`}
          placeholder="e.g., summer, casual, cotton (comma-separated)"
          aria-invalid={!!shouldShowError("tags")}
          aria-describedby={shouldShowError("tags") ? "tags-error" : undefined}
        />

        <p className="mt-1 text-xs text-muted-foreground">
          Separate tags with commas.
        </p>
      </div>
    </>
  );
}
