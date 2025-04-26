'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  images: File[]
  onImagesChange: (images: File[]) => void
  maxImages: number
  onImageError: (message: string) => void
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
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return files.filter(file => {
      if (!validTypes.includes(file.type)) {
        onImageError(`Invalid file type: ${file.name}. Only JPG, PNG, and GIF are allowed.`);
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
            fileInputRef.current.value = '';
          }
          return;
        }

        // Update files state with valid files
        onImagesChange([...images, ...validFiles]);
        
        // Clear the input after processing files
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [images, onImagesChange, maxImages, onImageError]
  );

  const handleRemoveImage = useCallback(
    (indexToRemove: number) => {
      const updatedImages = images.filter((_, index) => index !== indexToRemove);
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

  return (
    <div className="flex flex-col space-y-4">
      <div
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out ${
          images.length >= maxImages 
            ? 'border-muted-foreground bg-muted/30 cursor-not-allowed' 
            : 'border-input hover:border-primary hover:bg-secondary/50 bg-card cursor-pointer'
        }`}
        onClick={() => images.length < maxImages && fileInputRef.current?.click()}
        role="button"
        aria-label="Upload image"
        aria-disabled={images.length >= maxImages}
        tabIndex={images.length >= maxImages ? -1 : 0}
        onKeyDown={(e) => { 
          if((e.key === 'Enter' || e.key === ' ') && images.length < maxImages) {
            fileInputRef.current?.click();
          }
        }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-muted-foreground">Processing images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className={`w-8 h-8 mb-4 ${images.length >= maxImages ? 'text-muted-foreground' : 'text-primary'}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className={`mb-2 text-sm ${images.length >= maxImages ? 'text-muted-foreground' : 'text-foreground'}`}>
              <span className="font-semibold">Click to upload</span>
            </p>
            <p className={`text-xs ${images.length >= maxImages ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
               PNG, JPG, GIF up to 10MB
            </p>
            {images.length >= maxImages && (
              <p className="text-xs text-destructive mt-2">Maximum images reached</p>
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

      {/* Image Count */}
      {images.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {images.length} of {maxImages} images uploaded
          </p>
          <button
            type="button"
            onClick={handleClearAllImages}
            className="text-xs px-2 py-1 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Clear all images"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
          {previews.map((src, index) => (
            <div key={`preview-${index}`} className="relative group aspect-square">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 animate-pulse rounded-lg">
                <span className="sr-only">Loading image preview</span>
              </div>
              <Image
                src={src}
                alt={`Preview ${index + 1}`}
                width={150}
                height={150}
                className="object-cover w-full h-full rounded-lg shadow-md border border-border relative z-10"
                onError={() => console.error(`Error loading preview ${index + 1}`)}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="absolute top-1 right-1 bg-destructive/80 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out hover:bg-destructive focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-20"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

