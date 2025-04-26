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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [toastData, setToastData] = useState<ToastData>({
    message: "",
    isError: false,
    isOpen: false,
  });

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (images.length === 0) {
      handleToast({ 
        message: "At least one image is required", 
        isError: true 
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
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12 relative">
      <Toast
        message={toastData.message}
        isError={toastData.isError}
        isOpen={toastData.isOpen}
        onClose={() =>
          setToastData({ message: "", isError: false, isOpen: false })
        }
      />
      <div className="container mx-auto max-w-6xl bg-card text-card-foreground rounded-lg shadow-lg p-6 md:p-8 relative">
        <div className="z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-foreground">
            Product Asset Uploader
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        >
          {isSubmitting && (
            <div className="absolute top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm z-20 flex justify-center items-center rounded-lg">
               <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-foreground font-medium">{isSuccess ? "Success!" : "Uploading..."}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-6">
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              Product Information
            </h2>
            <ProductForm
              formData={formData}
              onFormChange={handleFormChange}
              onTagsChange={handleTagsChange}
            />
          </div>

          {/* Image Uploader Section */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              Product Images <span className="text-sm font-normal">
                <span className="text-destructive">*</span> (At least 1 and maximum 3)
              </span>
            </h2>
            <ImageUploader
              images={images}
              onImagesChange={handleImagesChange}
              maxImages={MAX_IMAGES}
              onImageError={handleImageError}
            />
          </div>

          {/* Submit Button - Spans across columns on mobile, stays in form col on desktop */}
          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-4 focus:ring-ring focus:outline-none font-medium rounded-lg text-sm px-8 py-3 text-center transition-colors duration-200 ease-in-out"
            >
              {isSubmitting ? "Submitting..." : "Submit Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
