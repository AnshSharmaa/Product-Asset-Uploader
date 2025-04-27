"use client";
import { useState, useEffect } from "react";
import { 
  ProductCategory, 
  ProductFormProps, 
  ValidationErrors, 
  FormField 
} from "@/types/index";

const categories: ProductCategory[] = [
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
  const [touched, setTouched] = useState<Record<FormField, boolean>>({
    title: false,
    category: false,
    tags: false,
    images: false,
  });
  const [focused, setFocused] = useState<FormField | null>(null);

  // Reset touched state when formData is reset (empty title indicates form reset)
  useEffect(() => {
    if (!formData.title && !formData.category && !formData.tags) {
      setTouched({
        title: false,
        category: false,
        tags: false,
        images: false,
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
  const handleBlur = (field: FormField): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFocused(null);
  };

  // Handle field focus
  const handleFocus = (field: FormField): void => {
    setFocused(field);
  };

  // Handle field change with custom wrapper
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    onFormChange(e);
    // Mark field as touched when user starts typing
    const fieldName = e.target.name as FormField;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Only show errors for touched fields
  const shouldShowError = (field: FormField): boolean => {
    // Check that the field exists in errors
    return touched[field] && !!errors[field as keyof ValidationErrors];
  };

  // Get input classes based on state
  const getInputClasses = (field: FormField): string => {
    return `bg-card border ${
      shouldShowError(field)
        ? "border-destructive shadow-sm shadow-destructive/10"
        : focused === field
        ? "border-primary shadow-sm shadow-primary/20"
        : "border-input"
    } text-foreground text-sm rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary block w-full p-2.5 transition-all duration-200 ease-in-out`;
  };

  /**
   * Gets validation status for display in UI
   */
  const getTitleValidationStatus = (): "error" | "valid" | null => {
    if (shouldShowError("title")) return "error";
    if (formData.title && formData.title.trim().length >= 3) return "valid";
    return null;
  };

  /**
   * Parses and filters tags from comma-separated string
   */
  const parseTagsFromString = (tagsString: string): string[] => {
    return tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  const titleStatus = getTitleValidationStatus();
  const parsedTags = formData.tags ? parseTagsFromString(formData.tags) : [];

  return (
    <div className="space-y-5">
      <div className="group">
        <label
          htmlFor="title"
          className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-200 group-focus-within:text-primary"
        >
          <span>Product Title
          <span className="text-destructive">* </span>
          <span className="text-xs">(At least 3 characters)</span>
          </span>
          {formData.title && (
            <span className="ml-auto text-xs text-muted-foreground">
              {formData.title.length} characters
            </span>
          )}
        </label>
        <div className="relative">
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onFocus={() => handleFocus("title")}
            onBlur={() => handleBlur("title")}
            required
            className={getInputClasses("title")}
            placeholder="e.g., Cool Graphic Tee"
            aria-invalid={!!shouldShowError("title")}
            aria-describedby={
              shouldShowError("title") ? "title-error" : undefined
            }
          />
          {titleStatus === "error" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-destructive"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          ) : titleStatus === "valid" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : null}
        </div>
        {shouldShowError("title") && (
          <p
            id="title-error"
            className="mt-1.5 flex items-center gap-1 text-xs text-destructive"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 8h13" />
              <path d="m18 7 5 5-5 5" />
              <path d="M3 16h13" />
            </svg>
            {errors.title}
          </p>
        )}
      </div>

      <div className="group">
        <label
          htmlFor="category"
          className="mb-2 flex text-sm font-medium text-foreground transition-colors duration-200 group-focus-within:text-primary"
        >
          Category <span className="ml-1 text-destructive">*</span>
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            onFocus={() => handleFocus("category")}
            onBlur={() => handleBlur("category")}
            required
            className={`${getInputClasses("category")} appearance-none pr-10`}
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
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className={`size-4 transition-colors duration-200 ${
                shouldShowError("category")
                  ? "text-destructive"
                  : focused === "category"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {shouldShowError("category") && (
          <p
            id="category-error"
            className="mt-1.5 flex items-center gap-1 text-xs text-destructive"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 8h13" />
              <path d="m18 7 5 5-5 5" />
              <path d="M3 16h13" />
            </svg>
            {errors.category}
          </p>
        )}
      </div>

      <div className="group">
        <label
          htmlFor="tags"
          className="mb-2 flex text-sm font-medium text-foreground transition-colors duration-200 group-focus-within:text-primary"
        >
          Tags
          {formData.tags && (
            <span className="ml-auto text-xs text-muted-foreground">
              {parsedTags.length} tags
            </span>
          )}
        </label>
        <div className="relative">
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={(e) => {
              onTagsChange(e);
              setTouched((prev) => ({ ...prev, tags: true }));
            }}
            onFocus={() => handleFocus("tags")}
            onBlur={() => handleBlur("tags")}
            className={getInputClasses("tags")}
            placeholder="e.g., summer, casual, cotton (comma-separated)"
            aria-invalid={!!shouldShowError("tags")}
            aria-describedby={
              shouldShowError("tags") ? "tags-error" : undefined
            }
          />
          {formData.tags && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div
                className={`size-2 rounded-full ${
                  shouldShowError("tags")
                    ? "bg-destructive"
                    : parsedTags.length > 0
                    ? "bg-green-500"
                    : "bg-muted"
                }`}
              ></div>
            </div>
          )}
        </div>
        {shouldShowError("tags") ? (
          <p
            id="tags-error"
            className="mt-1.5 flex items-center gap-1 text-xs text-destructive"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21 8-5 5 5 5" />
              <path d="M3 8h13" />
              <path d="M3 16h13" />
            </svg>
            {errors.tags}
          </p>
        ) : (
          <div className="mt-1.5 flex items-start gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 size-3.5 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            <p className="flex-1 text-xs text-muted-foreground">
              Add descriptive tags separated by commas to help categorize your
              product. Good tags improve searchability.
            </p>
          </div>
        )}

        {parsedTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {parsedTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
