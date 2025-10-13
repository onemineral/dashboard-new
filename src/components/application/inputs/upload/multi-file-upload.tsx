import * as React from "react";
import { Upload, X, File, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  formatFileSize,
  getFileIconColor,
  validateFile,
  getDropzoneBorderColor,
  getDropzoneBackgroundColor,
  createPreviewUrl,
  type FileValidation,
  type UploadProgress,
} from "./upload-utils";
import type { UploadState } from "./file-upload";

/**
 * File item with upload state and progress
 */
export interface FileItem {
  file: File;
  id: string;
  state: UploadState;
  progress: UploadProgress;
  error?: string;
  previewUrl?: string;
}

/**
 * Props for the MultiFileUpload component
 */
export interface MultiFileUploadProps {
  /** Current files value */
  value?: File[];
  /** Callback when files change */
  onChange?: (files: File[]) => void;
  /** Callback fired on blur for form validation */
  onBlur?: () => void;
  /** Upload handler function - receives file and progress callback */
  onUpload?: (file: File, onProgress: (progress: UploadProgress) => void) => Promise<void>;
  /** Accepted file types (MIME types or extensions) */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Custom file validation function */
  validate?: (file: File) => FileValidation;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input has an error state */
  error?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Placeholder text when no files are selected */
  placeholder?: string;
  /** Upload button text */
  uploadButtonText?: string;
  /** Show file size */
  showFileSize?: boolean;
  /** Auto-upload on file select */
  autoUpload?: boolean;
  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * MultiFileUpload component for uploading multiple files with drag-and-drop support
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const [files, setFiles] = useState<File[]>([]);
 * <MultiFileUpload value={files} onChange={setFiles} />
 * 
 * // With upload handler
 * const handleUpload = async (file: File, onProgress: (progress: UploadProgress) => void) => {
 *   const formData = new FormData();
 *   formData.append('file', file);
 *   
 *   const xhr = new XMLHttpRequest();
 *   xhr.upload.addEventListener('progress', (e) => {
 *     if (e.lengthComputable) {
 *       onProgress({
 *         percentage: (e.loaded / e.total) * 100,
 *         loaded: e.loaded,
 *         total: e.total
 *       });
 *     }
 *   });
 *   
 *   return new Promise((resolve, reject) => {
 *     xhr.addEventListener('load', () => resolve());
 *     xhr.addEventListener('error', () => reject());
 *     xhr.open('POST', '/api/upload');
 *     xhr.send(formData);
 *   });
 * };
 * 
 * <MultiFileUpload
 *   value={files}
 *   onChange={setFiles}
 *   onUpload={handleUpload}
 *   accept="image/*,.pdf"
 *   maxSize={5 * 1024 * 1024}
 *   maxFiles={10}
 *   autoUpload
 * />
 * 
 * // With React Hook Form
 * <Controller
 *   name="files"
 *   control={control}
 *   render={({ field, fieldState }) => (
 *     <MultiFileUpload
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       error={!!fieldState.error}
 *       onUpload={handleUpload}
 *     />
 *   )}
 * />
 * ```
 */
export const MultiFileUpload = React.memo(
  React.forwardRef<HTMLDivElement, MultiFileUploadProps>(
    (
      {
        value = [],
        onChange,
        onBlur,
        onUpload,
        accept,
        maxSize,
        maxFiles,
        validate: customValidate,
        disabled = false,
        error = false,
        className,
        placeholder = "Drop files here or click to browse",
        uploadButtonText = "Upload All",
        showFileSize = true,
        autoUpload = false,
        "data-testid": dataTestId,
      },
      ref
    ) => {
      // State management
      const [fileItems, setFileItems] = React.useState<FileItem[]>([]);
      const [dragState, setDragState] = React.useState<"idle" | "drag-over">("idle");
      const [validationError, setValidationError] = React.useState<string>("");
      const fileInputRef = React.useRef<HTMLInputElement>(null);
      const dragCounter = React.useRef(0);

      /**
       * Cleanup preview URLs on unmount
       */
      React.useEffect(() => {
        return () => {
          fileItems.forEach((item) => {
            if (item.previewUrl) {
              URL.revokeObjectURL(item.previewUrl);
            }
          });
        };
      }, [fileItems]);

      // Sync file items with value prop
      React.useEffect(() => {
        if (value.length === 0 && fileItems.length > 0) {
          // Cleanup preview URLs before clearing
          fileItems.forEach((item) => {
            if (item.previewUrl) {
              URL.revokeObjectURL(item.previewUrl);
            }
          });
          setFileItems([]);
        } else if (value.length > 0) {
          const newFileItems: FileItem[] = value.map((file) => {
            const existing = fileItems.find((item) => item.file === file);
            if (existing) return existing;

            return {
              file,
              id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
              state: "idle" as UploadState,
              progress: { percentage: 0, loaded: 0, total: file.size },
              previewUrl: createPreviewUrl(file),
            };
          });
          setFileItems(newFileItems);
        }
      }, [value, createPreviewUrl]);

      /**
       * Validate file with shared utility
       */
      const validateFileWrapper = React.useCallback(
        (file: File): FileValidation => {
          return validateFile(file, { accept, maxSize, validate: customValidate });
        },
        [accept, maxSize, customValidate]
      );

      /**
       * Handle single file upload by ID (used for auto-upload)
       */
      const handleSingleFileUploadById = React.useCallback(
        async (fileId: string, file: File) => {
          if (!onUpload) return;

          try {
            // Update state to uploading
            setFileItems((prev) =>
              prev.map((item) =>
                item.id === fileId
                  ? { ...item, state: "uploading" as UploadState, progress: { percentage: 0, loaded: 0, total: file.size } }
                  : item
              )
            );

            await onUpload(file, (progress) => {
              setFileItems((prev) =>
                prev.map((item) => (item.id === fileId ? { ...item, progress } : item))
              );
            });

            // Update state to success
            setFileItems((prev) =>
              prev.map((item) =>
                item.id === fileId ? { ...item, state: "success" as UploadState } : item
              )
            );
          } catch (err) {
            // Update state to error
            setFileItems((prev) =>
              prev.map((item) =>
                item.id === fileId
                  ? {
                      ...item,
                      state: "error" as UploadState,
                      error: err instanceof Error ? err.message : "Upload failed",
                    }
                  : item
              )
            );
          }
        },
        [onUpload]
      );

      /**
       * Handle single file upload
       */
      const handleSingleFileUpload = React.useCallback(
        async (file: File) => {
          const fileId = fileItems.find((item) => item.file === file)?.id;
          if (!fileId) return;
          await handleSingleFileUploadById(fileId, file);
        },
        [fileItems, handleSingleFileUploadById]
      );

      /**
       * Handle file selection
       */
      const handleFilesSelect = React.useCallback(
        async (newFiles: File[]) => {
          setValidationError("");

          // Check max files limit
          if (maxFiles && value.length + newFiles.length > maxFiles) {
            setValidationError(`Maximum ${maxFiles} files allowed`);
            return;
          }

          // Validate all files
          const validatedFiles: File[] = [];
          let hasError = false;

          for (const file of newFiles) {
            const validation = validateFileWrapper(file);
            if (!validation.valid) {
              setValidationError(validation.error || "Invalid file");
              hasError = true;
              break;
            }
            validatedFiles.push(file);
          }

          if (hasError) return;

          // Add files
          const allFiles = [...value, ...validatedFiles];
          onChange?.(allFiles);

          // Auto upload if enabled - we need to wait for fileItems to be updated
          if (autoUpload && onUpload) {
            // Create file items immediately for auto-upload
            const newFileItems: FileItem[] = validatedFiles.map((file) => ({
              file,
              id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
              state: "idle" as UploadState,
              progress: { percentage: 0, loaded: 0, total: file.size },
              previewUrl: createPreviewUrl(file),
            }));

            // Update fileItems state with new items
            setFileItems((prev) => [...prev, ...newFileItems]);

            // Upload files one by one
            for (const newItem of newFileItems) {
              await handleSingleFileUploadById(newItem.id, newItem.file);
            }
          }

          setTimeout(() => onBlur?.(), 0);
        },
        [value, maxFiles, validateFileWrapper, onChange, autoUpload, onUpload, onBlur, createPreviewUrl, handleSingleFileUploadById]
      );

      /**
       * Handle upload all files
       */
      const handleUploadAll = React.useCallback(async () => {
        if (!onUpload) return;

        for (const item of fileItems) {
          if (item.state === "idle" || item.state === "error") {
            await handleSingleFileUpload(item.file);
          }
        }

        setTimeout(() => onBlur?.(), 0);
      }, [fileItems, onUpload, handleSingleFileUpload, onBlur]);

      /**
       * Handle file input change
       */
      const handleInputChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            handleFilesSelect(files);
          }
        },
        [handleFilesSelect]
      );

      /**
       * Handle drag enter
       */
      const handleDragEnter = React.useCallback(
        (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          dragCounter.current++;

          if (dragCounter.current === 1 && !disabled) {
            setDragState("drag-over");
          }
        },
        [disabled]
      );

      /**
       * Handle drag leave
       */
      const handleDragLeave = React.useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;

        if (dragCounter.current === 0) {
          setDragState("idle");
        }
      }, []);

      /**
       * Handle drag over
       */
      const handleDragOver = React.useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }, []);

      /**
       * Handle drop
       */
      const handleDrop = React.useCallback(
        (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          dragCounter.current = 0;
          setDragState("idle");

          if (disabled) return;

          const files = Array.from(e.dataTransfer.files || []);
          if (files.length > 0) {
            handleFilesSelect(files);
          }
        },
        [disabled, handleFilesSelect]
      );

      /**
       * Handle click to browse
       */
      const handleClick = React.useCallback(() => {
        if (disabled) return;
        fileInputRef.current?.click();
      }, [disabled]);

      /**
       * Handle remove single file
       */
      const handleRemoveFile = React.useCallback(
        (fileId: string) => (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          // Cleanup preview URL
          const item = fileItems.find((item) => item.id === fileId);
          if (item?.previewUrl) {
            URL.revokeObjectURL(item.previewUrl);
          }

          const newFiles = value.filter((_, index) => fileItems[index]?.id !== fileId);
          onChange?.(newFiles);
          setFileItems((prev) => prev.filter((item) => item.id !== fileId));

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          setTimeout(() => onBlur?.(), 0);
        },
        [value, fileItems, onChange, onBlur]
      );

      /**
       * Handle clear all files
       */
      const handleClearAll = React.useCallback(
        (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          // Cleanup all preview URLs
          fileItems.forEach((item) => {
            if (item.previewUrl) {
              URL.revokeObjectURL(item.previewUrl);
            }
          });

          onChange?.([]);
          setFileItems([]);
          setValidationError("");

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          setTimeout(() => onBlur?.(), 0);
        },
        [onChange, onBlur, fileItems]
      );

      // Calculate overall state
      const allSuccess = fileItems.length > 0 && fileItems.every((item) => item.state === "success");
      const anyUploading = fileItems.some((item) => item.state === "uploading");
      const hasFiles = fileItems.length > 0;
      const canUpload = hasFiles && !autoUpload && onUpload && !allSuccess && !anyUploading;

      return (
        <div ref={ref} className={cn("flex flex-col gap-2", className)} data-testid={dataTestId}>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
            multiple
            aria-label="File input"
          />

          {/* Dropzone */}
          <div
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-all cursor-pointer",
              "min-h-[200px] md:min-h-[160px]",
              "touch-manipulation",
              getDropzoneBorderColor(
                anyUploading ? "uploading" : allSuccess ? "success" : dragState === "drag-over" ? "drag-over" : "idle",
                error,
                validationError
              ),
              getDropzoneBackgroundColor(
                dragState === "drag-over" ? "drag-over" : allSuccess ? "success" : validationError ? "error" : "idle",
                validationError
              ),
              disabled && "opacity-50 cursor-not-allowed",
              anyUploading && "cursor-wait"
            )}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label="Upload files"
            aria-disabled={disabled}
            data-testid={`${dataTestId}-dropzone`}
          >
            {/* Icon */}
            {anyUploading ? (
              <Loader2 className="size-12 text-primary animate-spin" aria-hidden="true" />
            ) : allSuccess ? (
              <CheckCircle2 className="size-12 text-green-600" aria-hidden="true" />
            ) : validationError ? (
              <AlertCircle className="size-12 text-destructive" aria-hidden="true" />
            ) : (
              <Upload
                className={cn(
                  "size-12 transition-colors",
                  dragState === "drag-over" ? "text-primary" : "text-muted-foreground"
                )}
                aria-hidden="true"
              />
            )}

            {/* Content */}
            {!hasFiles ? (
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm font-medium">
                  {dragState === "drag-over" ? "Drop files here" : placeholder}
                </p>
                {accept && (
                  <p className="text-xs text-muted-foreground">
                    Accepted: {accept.split(",").join(", ")}
                  </p>
                )}
                <div className="flex flex-col items-center gap-0.5 text-xs text-muted-foreground">
                  {maxSize && <p>Max size: {formatFileSize(maxSize)}</p>}
                  {maxFiles && <p>Max files: {maxFiles}</p>}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">
                  {fileItems.length} {fileItems.length === 1 ? "file" : "files"} selected
                </p>
                {!disabled && !anyUploading && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-auto py-1 px-2"
                    aria-label="Clear all files"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            )}

            {/* Success Message */}
            {allSuccess && (
              <p className="text-sm text-green-600 font-medium">All files uploaded successfully!</p>
            )}
          </div>

          {/* File List */}
          {hasFiles && (
            <div className="space-y-2">
              {fileItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                    item.state === "success" && "border-green-600/20 bg-green-600/5",
                    item.state === "error" && "border-destructive/20 bg-destructive/5",
                    item.state === "uploading" && "border-primary/20 bg-primary/5"
                  )}
                >
                  {/* File Icon or Image Preview */}
                  {item.previewUrl ? (
                    <div className="size-12 shrink-0 rounded overflow-hidden border border-border">
                      <img
                        src={item.previewUrl}
                        alt={item.file.name}
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <File
                      className={cn("size-5 shrink-0 mt-0.5", getFileIconColor(item.state))}
                      aria-hidden="true"
                    />
                  )}

                  {/* File Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium truncate">{item.file.name}</span>
                      {!disabled && item.state !== "uploading" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleRemoveFile(item.id)}
                          className="size-6 min-w-[44px] min-h-[44px] md:min-w-[24px] md:min-h-[24px] shrink-0"
                          aria-label={`Remove ${item.file.name}`}
                        >
                          <X className="size-4" aria-hidden="true" />
                        </Button>
                      )}
                    </div>

                    {/* File Size and Status */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {showFileSize && <span>{formatFileSize(item.file.size)}</span>}
                      {item.state === "success" && (
                        <span className="text-green-600 font-medium">Uploaded</span>
                      )}
                      {item.state === "error" && (
                        <span className="text-destructive font-medium">Failed</span>
                      )}
                    </div>

                    {/* Upload Progress */}
                    {item.state === "uploading" && (
                      <div className="space-y-1">
                        <Progress value={item.progress.percentage} indeterminate={!item.progress.percentage} className="h-1.5" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{Math.round(item.progress.percentage)}%</span>
                          <span>
                            {formatFileSize(item.progress.loaded)} / {formatFileSize(item.progress.total)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {item.error && (
                      <p className="text-xs text-destructive">{item.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload All Button */}
          {canUpload && (
            <Button
              type="button"
              onClick={handleUploadAll}
              disabled={disabled}
              className="w-full md:w-auto md:self-start min-h-[44px] md:min-h-[36px]"
              data-testid={`${dataTestId}-upload-button`}
            >
              <Upload className="size-4" aria-hidden="true" />
              {uploadButtonText}
            </Button>
          )}

          {/* Error Message */}
          {validationError && (
            <div
              className="flex items-start gap-2 text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1 duration-200"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="size-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{validationError}</span>
            </div>
          )}
        </div>
      );
    }
  )
);

MultiFileUpload.displayName = "MultiFileUpload";