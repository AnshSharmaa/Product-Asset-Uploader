"use client";

import { useState, useEffect } from "react";
import { ProductFormData, ProductCategory, ToastData } from "@/types/index";

import ProductForm from "@/components/ProductForm";
import ImageUploader from "@/components/ImageUploader";
import Toast from "@/components/Toast";

export default function Home() {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    category: "" as ProductCategory,
    tags: "",
  });
  const [toastData, setToastData] = useState<ToastData>({
    message: "",
    isError: false,
    isOpen: false,
    duration: 2000,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const MAX_IMAGES = 3;

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: ProductFormData) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: ProductFormData) => ({ ...prev, tags: e.target.value }));
  };

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleToast = (data: { message: string; isError: boolean }) => {
    setToastData({ ...data, isOpen: true, duration: toastData.duration });
    setTimeout(() => {
      setToastData({
        message: "",
        isError: false,
        isOpen: false,
        duration: toastData.duration,
      });
    }, toastData.duration);
  };

  const handleImageError = (message: string) => {
    handleToast({ message: message, isError: true });
  };

  // Global reset function
  const handleClearAll = () => {
    setFormData({
      title: "",
      category: "" as ProductCategory,
      tags: "",
    });
    setImages([]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (images.length === 0) {
      handleToast({
        message: "At least one image is required",
        isError: true,
      });
      return;
    } else if (formData.title.length <= 2 || formData.title.trim() === "") {
      handleToast({
        message: "Title must be at least 3 characters long",
        isError: true,
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Product Info:", formData);
    console.log(
      "Images:",
      images.map((img) => ({ name: img.name, size: img.size, type: img.type }))
    );
    handleToast({ message: "Product added successfully!", isError: false });
    setIsSuccess(true);
  };

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);

        setFormData({
          title: "",
          category: "" as ProductCategory,
          tags: "",
        });
        setImages([]);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isSuccess]);

  return (
    <main className="min-h-screen  bg-gradient-to-b from-background to-blue-200 p-4 md:p-8 lg:p-12 ">
      <Toast
        message={toastData.message}
        isError={toastData.isError}
        isOpen={toastData.isOpen}
        onClose={() =>
          setToastData({
            message: "",
            isError: false,
            isOpen: false,
            duration: toastData.duration,
          })
        }
        duration={toastData.duration}
      />
      <div className="container mx-auto max-w-7xl ">
        <div className="relative overflow-hidden rounded-xl border border-border/50 p-6 text-card-foreground shadow-xl backdrop-blur-sm md:p-8">
          {/* Header with decorative elements */}

          <div className="relative z-10 mb-8">
            <h1 className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-center text-2xl font-bold text-transparent md:text-3xl">
              Product Asset Uploader
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
              Upload your product information and images to showcase your items
              in the best possible way.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12"
          >
            {isSubmitting && (
              <div className="absolute left-0 top-0 z-20 flex size-full items-center justify-center rounded-lg bg-black/20 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 rounded-xl bg-card p-6 shadow-lg">
                  <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="font-medium text-foreground">
                    {isSuccess ? "Success!" : "Uploading product..."}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M20.91 8.84 8.56 21.18a4.3 4.3 0 0 1-6.07-6.07L14.84 3.11a2.93 2.93 0 0 1 4.13 4.13l-12.4 12.39a1.56 1.56 0 0 1-2.2-2.2L15.89 5.92" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Product Information
                </h2>
              </div>
              <div className="rounded-xl border border-border/50 bg-card p-4 shadow-lg">
                <ProductForm
                  formData={formData}
                  onFormChange={handleFormChange}
                  onTagsChange={handleTagsChange}
                />
              </div>
            </div>

            {/* Image Uploader Section */}
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Product Images
                  <span className="text-sm font-normal">
                    <span className="text-destructive">*</span> (At least 1 and
                    maximum 3)
                  </span>
                </h2>
              </div>
              <div className="rounded-xl border border-border/50 bg-card p-4 shadow-lg">
                <ImageUploader
                  images={images}
                  onImagesChange={handleImagesChange}
                  maxImages={MAX_IMAGES}
                  onImageError={handleImageError}
                />
              </div>
            </div>

            {/* Form Actions - Spans across columns on mobile, stays in form col on desktop */}
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary px-8 py-3 text-center text-sm font-medium text-primary-foreground shadow-md transition-all duration-200 ease-in-out hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none md:w-auto"
              >
                {isSubmitting ? "Submitting..." : "Submit Product"}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="w-full rounded-lg bg-destructive/20 px-8 py-3 text-center text-sm font-medium text-destructive transition-all duration-200 ease-in-out hover:bg-destructive/20 focus:outline-none focus:ring-4 focus:ring-destructive/20 md:w-auto"
              >
                Clear All
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
