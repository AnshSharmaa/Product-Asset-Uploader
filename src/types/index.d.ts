/**
 * Global type definitions for the application
 */

/* eslint-disable no-unused-vars */
// Product Categories
export type ProductCategory = "T-shirt" | "Dress" | "Hoodie" | "Jeans" | "Shoes" | "Accessory";

// Form field identifier
export type FormField = "title" | "category" | "tags" | "images";

// Form Data Interfaces
export interface ProductFormData {
  /** Product title, minimum 3 characters required */
  title: string;
  /** Product category, must be one of the predefined options */
  category: ProductCategory;
  /** Comma-separated list of product tags */
  tags: string;
}

// Toast Notifications
export interface ToastData {
  /** Message to display in the toast notification */
  message: string;
  /** Whether this is an error toast (red styling) */
  isError: boolean;
  /** Whether the toast is currently visible */
  isOpen: boolean;
  /** Toast display duration in milliseconds */
  duration?: number;
}

export type ToastVariant = 'success' | 'error';

// Image Related Types
export type SupportedImageType = 'image/jpeg' | 'image/png' | 'image/gif';

export interface ImageMetadata {
  /** Original file name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type of the image */
  type: string;
}

// Validation Types
export type ValidationError = string | null;

export interface ValidationErrors {
  /** Title validation error message */
  title?: ValidationError;
  /** Category validation error message */
  category?: ValidationError;
  /** Tags validation error message */
  tags?: ValidationError;
  /** Images validation error message */
  images?: ValidationError;
}

// Component Props Interfaces
export interface ProductFormProps {
  /** Current form data state */
  formData: ProductFormData;
  /** Handler for form field changes (except tags) */
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  /** Dedicated handler for tags field changes */
  onTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ImageUploaderProps {
  /** Current array of image files */
  images: ReadonlyArray<File>;
  /** Callback function when images are added/removed */
  onImagesChange: (images: File[]) => void;
  /** Maximum number of images allowed */
  maxImages: number;
  /** Callback function for image-related errors */
  onImageError: (message: string) => void;
}

export interface ToastProps {
  /** Message to display in the toast notification */
  message: string;
  /** Whether this is an error toast (red styling) */
  isError?: boolean;
  /** Whether the toast is currently visible */
  isOpen: boolean;
  /** Function to call when toast should be closed */
  onClose: () => void;
  /** Auto-close duration in milliseconds (defaults to 2000ms) */
  duration?: number;
} 