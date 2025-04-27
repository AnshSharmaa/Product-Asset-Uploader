"use client";

import { useState, useEffect } from "react";

import ProductForm from "@/components/ProductForm";
import ImageUploader from "@/components/ImageUploader";
import Toast from "@/components/Toast";

interface FormData {
  title: string;
  category: string;
  tags: string;
}

interface ToastData {
  message: string;
  isError: boolean;
  isOpen: boolean;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    tags: "",
  });
  const [toastData, setToastData] = useState<ToastData>({
    message: "",
    isError: false,
    isOpen: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const MAX_IMAGES = 3;

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, tags: e.target.value }));
  };

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleToast = (data: { message: string; isError: boolean }) => {
    setToastData({ ...data, isOpen: true });
    setTimeout(() => {
      setToastData({ message: "", isError: false, isOpen: false });
    }, 3000);
  };

  const handleImageError = (message: string) => {
    handleToast({ message: message, isError: true });
  };

  // Global reset function
  const handleClearAll = () => {
    setFormData({ title: "", category: "", tags: "" });
    setImages([]);
    // handleToast({ message: "Form cleared successfully", isError: false });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images.length === 0) {
      handleToast({
        message: "At least one image is required",
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

        setFormData({ title: "", category: "", tags: "" });
        setImages([]);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isSuccess]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 md:p-8 lg:p-12 relative">
      <Toast
        message={toastData.message}
        isError={toastData.isError}
        isOpen={toastData.isOpen}
        onClose={() =>
          setToastData({ message: "", isError: false, isOpen: false })
        }
      />
      <div className="container mx-auto max-w-6xl">
        <div className="bg-card/80 backdrop-blur-sm text-card-foreground rounded-xl shadow-xl border border-border/50 p-6 md:p-8 overflow-hidden relative">
          {/* Header with decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

          <div className="relative z-10 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Product Asset Uploader
            </h1>
            <p className="text-center text-muted-foreground mt-2 max-w-xl mx-auto">
              Upload your product information and images to showcase your items
              in the best possible way.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10"
          >
            {isSubmitting && (
              <div className="absolute top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm z-20 flex justify-center items-center rounded-lg">
                <div className="bg-card p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-foreground font-medium">
                    {isSuccess ? "Success!" : "Uploading product..."}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
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
              <div className="p-4 bg-card rounded-xl border border-border/50 shadow-sm">
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
                <div className="p-2 bg-primary/10 rounded-lg">
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
                  Product Images{" "}
                  <span className="text-sm font-normal">
                    <span className="text-destructive">*</span> (At least 1 and
                    maximum 3)
                  </span>
                </h2>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border/50 shadow-sm">
                <ImageUploader
                  images={images}
                  onImagesChange={handleImagesChange}
                  maxImages={MAX_IMAGES}
                  onImageError={handleImageError}
                />
              </div>
            </div>

            {/* Form Actions - Spans across columns on mobile, stays in form col on desktop */}
            <div className="md:col-span-2 flex justify-center gap-4 mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 focus:outline-none font-medium rounded-lg text-sm px-8 py-3 text-center transition-all duration-200 ease-in-out shadow-md hover:shadow-lg disabled:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Product"}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="w-full md:w-auto bg-destructive/10 text-destructive hover:bg-destructive/20 focus:ring-4 focus:ring-destructive/20 focus:outline-none font-medium rounded-lg text-sm px-8 py-3 text-center transition-all duration-200 ease-in-out"
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
