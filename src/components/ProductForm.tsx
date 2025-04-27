"use client";
import { useState, useEffect } from "react";
import {
  ProductCategory,
  ProductFormProps,
  ValidationErrors,
  FormField,
} from "@/types/index";
import {
  AlertIcon,
  CheckIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ClipIcon,
} from "./icons";

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
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <ClipIcon className="text-primary size-5" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Product Information
        </h2>
      </div>
      <div className="rounded-xl border border-border/50 bg-card p-4 shadow-lg">
        <div className="space-y-5">
          <div className="group">
            <label
              htmlFor="title"
              className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-200 group-focus-within:text-primary"
            >
              <span>
                Product Title
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
                <AlertIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-destructive" />
              ) : titleStatus === "valid" ? (
                <CheckIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-green-500" />
              ) : null}
            </div>
            {shouldShowError("title") && (
              <p
                id="title-error"
                className="mt-1.5 flex items-center gap-1 text-xs text-destructive"
              >
                <ArrowRightIcon className="size-3" />
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
                className={`${getInputClasses(
                  "category"
                )} appearance-none pr-10`}
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
                <ChevronDownIcon
                  className={`size-4 transition-colors duration-200 ${
                    shouldShowError("category")
                      ? "text-destructive"
                      : focused === "category"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
            </div>
            {shouldShowError("category") && (
              <p
                id="category-error"
                className="mt-1.5 flex items-center gap-1 text-xs text-destructive"
              >
                <ArrowRightIcon className="size-3" />
                {errors.category}
              </p>
            )}
          </div>

          <div className="group">
            <label
              htmlFor="tags"
              className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-200 group-focus-within:text-primary"
            >
              <span>Tags (comma separated, optional)</span>
              {parsedTags.length > 0 && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {parsedTags.length} tag{parsedTags.length !== 1 ? "s" : ""}
                </span>
              )}
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={(e) => {
                handleChange(e);
                onTagsChange(e);
              }}
              onFocus={() => handleFocus("tags")}
              onBlur={() => handleBlur("tags")}
              className={getInputClasses("tags")}
              placeholder="e.g., summer, beach, vacation"
            />

            <div className="mt-2 flex flex-wrap gap-1">
              {parsedTags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
