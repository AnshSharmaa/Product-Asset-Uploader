"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { ImageUploaderProps, SupportedImageType } from "@/types/index";
import { UploadIcon, TrashIcon, CloseIcon, ImageIcon } from "./icons";

// Define supported image types in a single location
const SUPPORTED_IMAGE_TYPES: SupportedImageType[] = [
  "image/jpeg",
  "image/png",
  "image/gif",
];

// Create a string for the accept attribute
const ACCEPTED_FILE_TYPES = SUPPORTED_IMAGE_TYPES.join(", ");

/**
 * Custom hook to handle drag and drop functionality
 */
const useDragAndDrop = (
  onDrop: (files: File[]) => void,
  isDisabled = false
) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDisabled) {
        setIsDragging(true);
      }
    },
    [isDisabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if the leave event is for the container and not for a child element
    if (
      dropZoneRef.current &&
      !dropZoneRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (isDisabled) {
        return;
      }

      const droppedFiles = Array.from(e.dataTransfer.files);
      onDrop(droppedFiles);
    },
    [isDisabled, onDrop]
  );

  return {
    isDragging,
    dropZoneRef,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
};

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages,
  onImageError,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (files: File[]) => {
      setIsLoading(true);

      const validateFiles = (files: File[]): File[] => {
        return files.filter((file) => {
          if (
            !SUPPORTED_IMAGE_TYPES.includes(file.type as SupportedImageType)
          ) {
            onImageError(
              `Invalid file type: ${file.name}. Only JPG, PNG, and GIF are allowed.`
            );
            return false;
          }
          return true;
        });
      };

      const validFiles = validateFiles(files);

      if (validFiles.length === 0) {
        setIsLoading(false);
        return;
      }

      const totalImages = images.length + validFiles.length;
      if (totalImages > maxImages) {
        onImageError(`You can only upload a maximum of ${maxImages} images.`);
        setIsLoading(false);
        return;
      }

      // Update files state with valid files
      onImagesChange([...images, ...validFiles]);
    },
    [images, maxImages, onImagesChange, onImageError]
  );

  // Initialize the drag and drop hook
  const {
    isDragging,
    dropZoneRef,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop(processFiles, images.length >= maxImages);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        processFiles(Array.from(files));

        // Clear the input after processing files
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [processFiles]
  );

  const handleRemoveImage = useCallback(
    (indexToRemove: number) => {
      const updatedImages = [...images];
      updatedImages.splice(indexToRemove, 1);
      onImagesChange(updatedImages);
    },
    [images, onImagesChange]
  );

  // Clear all images at once
  const handleClearAllImages = useCallback(() => {
    // Revoke URL objects to prevent memory leaks
    previews.forEach(URL.revokeObjectURL);
    onImagesChange([]);
  }, [previews, onImagesChange]);

  useEffect(() => {
    // Clear loading state once previews are updated
    setIsLoading(false);
  }, [previews]);

  useEffect(() => {
    // Revoke old URL objects to prevent memory leaks
    previews.forEach(URL.revokeObjectURL);

    // Create new URL objects for the current images
    const urls = images.map((file: File) => URL.createObjectURL(file));
    setPreviews(urls);

    // Cleanup function to revoke URLs when component unmounts or images change
    return () => urls.forEach(URL.revokeObjectURL);
  }, [images]);

  // Get upload zone styles based on state
  const getUploadZoneClasses = () => {
    if (images.length >= maxImages) {
      return "border-muted-foreground/40 bg-muted/20 cursor-not-allowed";
    }
    if (isDragging) {
      return "border-primary border-solid bg-primary/10 border-2";
    }
    return "border-border hover:border-primary/50 hover:bg-primary/5 border-dashed cursor-pointer";
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <ImageIcon className="size-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Product Images
          <span className="text-sm font-normal">
            <span className="text-destructive">*</span> (At least 1 and maximum
            3)
          </span>
        </h2>
      </div>
      <div className="rounded-xl border border-border/50 bg-card p-4 shadow-lg">
        <div className="flex flex-col space-y-4">
          <div
            ref={dropZoneRef}
            className={`flex h-52 w-full flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 ease-in-out ${getUploadZoneClasses()}`}
            onClick={() =>
              images.length < maxImages && fileInputRef.current?.click()
            }
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            aria-label="Upload image"
            aria-disabled={images.length >= maxImages}
            tabIndex={images.length >= maxImages ? -1 : 0}
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" || e.key === " ") &&
                images.length < maxImages
              ) {
                fileInputRef.current?.click();
              }
            }}
          >
            {isLoading ? (
              <div className="flex animate-pulse flex-col items-center justify-center">
                <UploadIcon className="mb-3 size-10 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Processing images...
                </p>
                <div className="mt-3 h-1 w-24 overflow-hidden rounded-full bg-muted-foreground/20">
                  <div className="animate-progress-indeterminate h-full rounded-full bg-primary"></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-5 text-center">
                <div
                  className={`mb-2 rounded-full p-3 ${
                    images.length >= maxImages ? "bg-muted" : "bg-primary/10"
                  }`}
                >
                  <UploadIcon
                    className={`size-7 ${
                      images.length >= maxImages
                        ? "text-muted-foreground"
                        : "text-primary"
                    }`}
                  />
                </div>

                {images.length >= maxImages ? (
                  <p className="mb-1 text-base font-semibold text-foreground">
                    Maximum images uploaded
                  </p>
                ) : (
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">
                      <span>
                        {isDragging ? (
                          <span className="font-medium text-primary">
                            Drop your images here
                          </span>
                        ) : (
                          <span>
                            Drag and drop or{" "}
                            <span className="text-primary underline decoration-primary/30 underline-offset-2">
                              Click here to upload
                            </span>
                          </span>
                        )}
                      </span>
                    </p>
                    <p className="max-w-80 text-xs text-muted-foreground">
                      Upload high-resolution product images for best experience
                      <span className="mt-0.5 block">(PNG, JPG, GIF)</span>
                    </p>
                  </div>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              accept={ACCEPTED_FILE_TYPES}
              onChange={handleFileChange}
              disabled={images.length >= maxImages || isLoading}
              aria-label="Upload images"
            />
          </div>

          {/* Image Actions */}
          {images.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {images.length > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                      {/* mini thumbnail */}
                      {previews.slice(0, 3).map((src, index) => (
                        <div
                          key={`mini-${index}`}
                          className="size-6 overflow-hidden rounded-full border border-border ring-1 ring-background"
                        >
                          <Image
                            src={src}
                            alt={`Thumbnail ${index + 1}`}
                            width={24}
                            height={24}
                            className="size-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {images.length} of {maxImages} uploaded
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleClearAllImages}
                className="flex items-center gap-1 rounded-md bg-destructive/10 px-2.5 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive/40 focus:ring-offset-1"
                aria-label="Clear all images"
              >
                <TrashIcon className="size-3" />
                Clear all Images
              </button>
            </div>
          )}

          {/* Image Previews */}
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3"
            aria-live="polite"
          >
            {Array.from({ length: maxImages }).map((_, index) => {
              // If we have an image for this slot, show the actual image
              if (index < previews.length) {
                const src = previews[index];
                return (
                  <div
                    key={`preview-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-card/50 transition-all duration-200 hover:shadow-md"
                  >
                    <Image
                      src={src}
                      alt={`Product image ${index + 1}`}
                      width={200}
                      height={200}
                      className="relative z-10 size-full rounded-lg object-cover transition-transform group-hover:scale-105"
                      onError={() =>
                        onImageError(`Error loading preview ${index + 1}`)
                      }
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="absolute right-1 top-1 z-20 rounded-full bg-destructive/80 p-1 text-destructive-foreground opacity-0 transition-opacity duration-200 ease-in-out hover:bg-destructive focus:outline-none focus:ring-2 focus:ring-destructive/10 group-hover:opacity-100"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <CloseIcon className="size-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 z-20 rounded bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      Image {index + 1}
                    </div>
                  </div>
                );
              }
              // Otherwise show a placeholder for this slot
              return (
                <div
                  key={`placeholder-${index}`}
                  className={`
                flex aspect-square flex-col items-center justify-center 
                rounded-lg border border-dashed border-border bg-muted/20 p-4
                transition-all duration-200
                ${
                  images.length < maxImages
                    ? "cursor-pointer hover:bg-muted/30"
                    : "opacity-50"
                }
              `}
                  onClick={() =>
                    images.length < maxImages && fileInputRef.current?.click()
                  }
                  role={images.length < maxImages ? "button" : "presentation"}
                  tabIndex={images.length < maxImages ? 0 : -1}
                  onKeyDown={(e) => {
                    if (
                      (e.key === "Enter" || e.key === " ") &&
                      images.length < maxImages
                    ) {
                      fileInputRef.current?.click();
                    }
                  }}
                  aria-label={
                    images.length < maxImages
                      ? "Add product image"
                      : "Image slot unavailable"
                  }
                >
                  <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted/30">
                    <ImageIcon className="size-5 text-muted-foreground" />
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    {images.length < maxImages
                      ? "Add image"
                      : "Slot unavailable"}
                  </p>
                  {images.length < maxImages && (
                    <p className="mt-1 text-center text-[10px] text-muted-foreground/70">
                      Click to upload
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
