"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages: number;
  onImageError: (message: string) => void;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages,
  onImageError,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file validation
  const validateFiles = (files: File[]): File[] => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    return files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        onImageError(
          `Invalid file type: ${file.name}. Only JPG, PNG, and GIF are allowed.`
        );
        return false;
      }
      return true;
    });
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        setIsLoading(true);
        const newFiles = Array.from(files);
        const validFiles = validateFiles(newFiles);

        if (validFiles.length === 0) {
          setIsLoading(false);
          return;
        }

        const totalImages = images.length + validFiles.length;
        if (totalImages > maxImages) {
          onImageError(`You can only upload a maximum of ${maxImages} images.`);
          setIsLoading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          return;
        }

        // Update files state with valid files
        onImagesChange([...images, ...validFiles]);

        // Clear the input after processing files
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [images, onImagesChange, maxImages, onImageError]
  );

  const handleRemoveImage = useCallback(
    (indexToRemove: number) => {
      const updatedImages = images.filter(
        (_, index) => index !== indexToRemove
      );
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
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    // Cleanup function to revoke URLs when component unmounts or images change
    return () => urls.forEach(URL.revokeObjectURL);
  }, [images]);

  // Get upload zone styles based on state
  const getUploadZoneClasses = () => {
    if (images.length >= maxImages) {
      return "border-muted-foreground/40 bg-muted/20 cursor-not-allowed";
    }
    return "border-border hover:border-primary/50 hover:bg-primary/5 border-dashed cursor-pointer";
  };

  return (
    <div className="flex flex-col space-y-4">
      <div
        className={`flex flex-col items-center justify-center w-full h-52 border-2 rounded-xl transition-all duration-200 ease-in-out ${getUploadZoneClasses()}`}
        onClick={() =>
          images.length < maxImages && fileInputRef.current?.click()
        }
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
          <div className="flex flex-col items-center justify-center animate-pulse">
            <svg
              className="w-10 h-10 mb-3 text-primary"
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-muted-foreground">
              Processing images...
            </p>
            <div className="mt-3 w-24 h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-progress-indeterminate"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-5 px-4 text-center">
            <div
              className={`p-3 mb-2 rounded-full ${
                images.length >= maxImages ? "bg-muted" : "bg-primary/10"
              }`}
            >
              <svg
                className={`w-7 h-7 ${
                  images.length >= maxImages
                    ? "text-muted-foreground"
                    : "text-primary"
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            {images.length >= maxImages ? (
              <p className="mb-1 text-md font-semibold text-foreground">
                {" "}
                Maximum images reached{" "}
              </p>
            ) : (
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  <span>
                    Drag and drop or{" "}
                    <span className="text-primary underline underline-offset-2 decoration-primary/30">
                      Click here to upload
                    </span>
                  </span>
                </p>
                <p className="text-xs text-muted-foreground max-w-[20rem]">
                  Upload high-resolution product images for best experience
                  (PNG, JPG, GIF)
                </p>
              </div>
            )}

            {images.length > 0 && (
              <div className="flex items-center gap-1 mt-3">
                <div className="flex -space-x-2">
                  {previews.slice(0, 3).map((src, index) => (
                    <div
                      key={`mini-${index}`}
                      className="w-6 h-6 rounded-full border border-border overflow-hidden ring-1 ring-background"
                    >
                      <Image
                        src={src}
                        alt={`Thumbnail ${index + 1}`}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
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
        )}
        <input
          ref={fileInputRef}
          id="dropzone-file"
          type="file"
          className="hidden"
          multiple
          accept="image/png, image/jpeg, image/gif"
          onChange={handleFileChange}
          disabled={images.length >= maxImages || isLoading}
          aria-label="Upload images"
        />
      </div>

      {/* Image Actions */}
      {images.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                images.length === maxImages ? "bg-amber-500" : "bg-green-500"
              }`}
            ></div>
            <p className="text-xs text-muted-foreground">
              {images.length === maxImages
                ? "Maximum limit reached"
                : `${images.length} of ${maxImages} images uploaded`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearAllImages}
            className="text-xs px-2.5 py-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-destructive/40 flex items-center gap-1"
            aria-label="Clear all images"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            Clear all Images
          </button>
        </div>
      )}

      {/* Image Previews */}
      {
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: maxImages }).map((_, index) => {
            // If we have an image for this slot, show the actual image
            if (index < previews.length) {
              const src = previews[index];
              return (
                <div
                  key={`preview-${index}`}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-card/50 transition-all duration-200 hover:shadow-md"
                >
                  <Image
                    src={src}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full rounded-lg relative z-10 transition-transform group-hover:scale-[1.10]"
                    onError={() =>
                      console.error(`Error loading preview ${index + 1}`)
                    }
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute top-1 right-1 bg-destructive/80 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out hover:bg-destructive focus:outline-none focus:ring-2 focus:ring-destructive/10 z-20"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="absolute bottom-2 left-2 z-20 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Image {index + 1}
                  </div>
                </div>
              );
            }
            // Otherwise show a placeholder for this slot
            return (
              <div
                key={`placeholder-${index}`}
                className="aspect-square rounded-lg border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center p-4 transition-all duration-200 hover:bg-muted/30"
                onClick={() => images.length < maxImages && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && images.length < maxImages) {
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {images.length < maxImages ? "Add image" : "Slot empty"}
                </p>
                {images.length < maxImages && (
                  <p className="text-[10px] text-center text-muted-foreground/70 mt-1">
                    Click to upload
                  </p>
                )}
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}
