/**
 * Shared utilities for file upload components
 */

import type { UploadState } from "./file-upload";

/**
 * Upload progress information
 */
export interface UploadProgress {
  percentage: number;
  loaded: number;
  total: number;
}

/**
 * File validation result
 */
export interface FileValidation {
  valid: boolean;
  error?: string;
}

/**
 * Check if file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

/**
 * Create preview URL for image files
 */
export const createPreviewUrl = (file: File): string | undefined => {
  if (isImageFile(file)) {
    return URL.createObjectURL(file);
  }
  return undefined;
};

/**
 * Format file size to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Get file type icon color based on upload state
 */
export const getFileIconColor = (state: UploadState): string => {
  switch (state) {
    case "success":
      return "text-green-600";
    case "error":
      return "text-destructive";
    case "uploading":
      return "text-primary";
    default:
      return "text-muted-foreground";
  }
};

/**
 * Validate a single file against constraints
 */
export const validateFile = (
  file: File,
  options: {
    accept?: string;
    maxSize?: number;
    validate?: (file: File) => FileValidation;
  }
): FileValidation => {
  const { accept, maxSize, validate } = options;

  // Custom validation
  if (validate) {
    const result = validate(file);
    if (!result.valid) return result;
  }

  // File size validation
  if (maxSize && file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${formatFileSize(maxSize)}`,
    };
  }

  // File type validation
  if (accept) {
    const acceptedTypes = accept.split(",").map((type) => type.trim());
    const fileType = file.type;
    const fileExtension = `.${file.name.split(".").pop()}`;

    const isAccepted = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        return fileExtension.toLowerCase() === type.toLowerCase();
      }
      if (type.endsWith("/*")) {
        return fileType.startsWith(type.slice(0, -2));
      }
      return fileType === type;
    });

    if (!isAccepted) {
      return {
        valid: false,
        error: `File type not accepted. Accepted types: ${accept}`,
      };
    }
  }

  return { valid: true };
};

/**
 * Get dropzone border color based on state
 */
export const getDropzoneBorderColor = (
  state: UploadState,
  error: boolean,
  validationError: string
): string => {
  if (error || validationError) return "border-destructive";
  if (state === "drag-over") return "border-primary";
  if (state === "success") return "border-green-600";
  if (state === "uploading") return "border-primary";
  return "border-input";
};

/**
 * Get dropzone background color based on state
 */
export const getDropzoneBackgroundColor = (
  state: UploadState,
  validationError: string
): string => {
  if (state === "drag-over") return "bg-primary/5";
  if (state === "success") return "bg-green-600/5";
  if (state === "error" || validationError) return "bg-destructive/5";
  return "bg-background";
};