import * as React from "react";
import {Upload, X, File, CheckCircle2, AlertCircle} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {
    formatFileSize,
    getFileIconColor,
    validateFile as validateFileUtil,
    getDropzoneBorderColor,
    getDropzoneBackgroundColor,
    createPreviewUrl,
    type FileValidation,
    type UploadProgress,
} from "./upload-utils";

/**
 * Upload state types
 */
export type UploadState = "idle" | "drag-over" | "uploading" | "success" | "error";

/**
 * Props for the FileUpload component
 */
export interface FileUploadProps {
    /** Current file value */
    value?: File | null;
    /** Callback when file changes */
    onChange?: (file: File | null) => void;
    /** Callback fired on blur for form validation */
    onBlur?: () => void;
    /** Upload handler function - receives file and progress callback */
    onUpload?: (file: File, onProgress: (progress: UploadProgress) => void) => Promise<void>;
    /** Accepted file types (MIME types or extensions) */
    accept?: string;
    /** Maximum file size in bytes */
    maxSize?: number;
    /** Custom file validation function */
    validate?: (file: File) => FileValidation;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Whether the input has an error state */
    error?: boolean;
    /** Additional CSS class name */
    className?: string;
    /** Placeholder text when no file is selected */
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
 * FileUpload component for uploading single files with drag-and-drop support
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [file, setFile] = useState<File | null>(null);
 * <FileUpload value={file} onChange={setFile} />
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
 * <FileUpload
 *   value={file}
 *   onChange={setFile}
 *   onUpload={handleUpload}
 *   accept="image/*,.pdf"
 *   maxSize={5 * 1024 * 1024}
 *   autoUpload
 * />
 *
 * // With React Hook Form
 * <Controller
 *   name="file"
 *   control={control}
 *   render={({ field, fieldState }) => (
 *     <FileUpload
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
export const FileUpload = React.memo(
    React.forwardRef<HTMLDivElement, FileUploadProps>(
        (
            {
                value,
                onChange,
                onBlur,
                onUpload,
                accept,
                maxSize,
                validate,
                disabled = false,
                error = false,
                className,
                placeholder = "Drop file here or click to browse",
                uploadButtonText = "Upload",
                showFileSize = true,
                autoUpload = false,
                "data-testid": dataTestId,
            },
            ref
        ) => {
            // State management
            const [state, setState] = React.useState<UploadState>("idle");
            const [uploadProgress, setUploadProgress] = React.useState<UploadProgress>({
                percentage: 0,
                loaded: 0,
                total: 0,
            });
            const [validationError, setValidationError] = React.useState<string>("");
            const [previewUrl, setPreviewUrl] = React.useState<string | undefined>();
            const fileInputRef = React.useRef<HTMLInputElement>(null);
            const dragCounter = React.useRef(0);

            /**
             * Cleanup preview URL on unmount or when file changes
             */
            React.useEffect(() => {
                return () => {
                    if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                    }
                };
            }, [previewUrl]);

            /**
             * Update preview URL when value changes
             */
            React.useEffect(() => {
                if (value) {
                    const newPreviewUrl = createPreviewUrl(value);
                    setPreviewUrl(newPreviewUrl);
                } else {
                    if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                    }
                    setPreviewUrl(undefined);
                }
            }, [value]);

            /**
             * Validate file
             */
            const validateFileWrapper = React.useCallback(
                (file: File): FileValidation => {
                    return validateFileUtil(file, {accept, maxSize, validate});
                },
                [accept, maxSize, validate]
            );

            /**
             * Handle file selection
             */
            const handleFileSelect = React.useCallback(
                async (file: File) => {
                    const validation = validateFileWrapper(file);

                    if (!validation.valid) {
                        setValidationError(validation.error || "Invalid file");
                        setState("error");
                        return;
                    }

                    setValidationError("");
                    setState("idle");
                    onChange?.(file);

                    // Auto upload if enabled
                    if (autoUpload && onUpload) {
                        try {
                            setState("uploading");
                            setUploadProgress({percentage: 0, loaded: 0, total: file.size});

                            await onUpload(file, (progress) => {
                                setUploadProgress(progress);
                            });

                            setState("success");
                            setTimeout(() => onBlur?.(), 0);
                        } catch (err) {
                            setState("error");
                            setValidationError(err instanceof Error ? err.message : "Upload failed");
                        }
                    } else {
                        setTimeout(() => onBlur?.(), 0);
                    }
                },
                [validateFileWrapper, onChange, autoUpload, onUpload, onBlur]
            );

            /**
             * Handle manual upload
             */
            const handleUpload = React.useCallback(async () => {
                if (!value || !onUpload) return;

                try {
                    setState("uploading");
                    setUploadProgress({percentage: 0, loaded: 0, total: value.size});

                    await onUpload(value, (progress) => {
                        setUploadProgress(progress);
                    });

                    setState("success");
                    setTimeout(() => onBlur?.(), 0);
                } catch (err) {
                    setState("error");
                    setValidationError(err instanceof Error ? err.message : "Upload failed");
                }
            }, [value, onUpload, onBlur]);

            /**
             * Handle file input change
             */
            const handleInputChange = React.useCallback(
                (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        handleFileSelect(file);
                    }
                },
                [handleFileSelect]
            );

            /**
             * Handle drag enter
             */
            const handleDragEnter = React.useCallback(
                (e: React.DragEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dragCounter.current++;

                    if (dragCounter.current === 1 && !disabled && state !== "uploading") {
                        setState("drag-over");
                    }
                },
                [disabled, state]
            );

            /**
             * Handle drag leave
             */
            const handleDragLeave = React.useCallback(
                (e: React.DragEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dragCounter.current--;

                    if (dragCounter.current === 0) {
                        setState(value ? "idle" : "idle");
                    }
                },
                [value]
            );

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

                    if (disabled || state === "uploading") return;

                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                        handleFileSelect(file);
                    } else {
                        setState(value ? "idle" : "idle");
                    }
                },
                [disabled, state, value, handleFileSelect]
            );

            /**
             * Handle click to browse
             */
            const handleClick = React.useCallback(() => {
                if (disabled || state === "uploading") return;
                fileInputRef.current?.click();
            }, [disabled, state]);

            /**
             * Handle clear file
             */
            const handleClear = React.useCallback(
                (e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Cleanup preview URL
                    if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                    }

                    onChange?.(null);
                    setState("idle");
                    setValidationError("");
                    setUploadProgress({percentage: 0, loaded: 0, total: 0});
                    setPreviewUrl(undefined);

                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }

                    setTimeout(() => onBlur?.(), 0);
                },
                [onChange, onBlur, previewUrl]
            );


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
                            getDropzoneBorderColor(state, error, validationError),
                            getDropzoneBackgroundColor(state, validationError),
                            disabled && "opacity-50 cursor-not-allowed",
                            state === "uploading" && "cursor-wait"
                        )}
                        role="button"
                        tabIndex={disabled ? -1 : 0}
                        aria-label="Upload file"
                        aria-disabled={disabled}
                        data-testid={`${dataTestId}-dropzone`}
                    >
                        {/* Icon */}
                        {state === "success" ? (
                            <CheckCircle2 className="size-12 text-green-600" aria-hidden="true"/>
                        ) : state === "error" || validationError ? (
                            <AlertCircle className="size-12 text-destructive" aria-hidden="true"/>
                        ) : (
                            <Upload
                                className={cn(
                                    "size-12 transition-colors",
                                    state === "drag-over" ? "text-primary" : "text-muted-foreground"
                                )}
                                aria-hidden="true"
                            />
                        )}

                        {/* Content */}
                        {value ? (
                            <div className="flex flex-col items-center gap-2 w-full">
                                {/* Image Preview */}
                                {previewUrl && (
                                    <div className="relative size-24 rounded-lg overflow-hidden border border-border">
                                        <img
                                            src={previewUrl}
                                            alt={value.name}
                                            className="size-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center gap-2 max-w-full">
                                    {!previewUrl && (
                                        <File className={cn("size-4 shrink-0", getFileIconColor(state))}
                                              aria-hidden="true"/>
                                    )}
                                    <span className="text-sm font-medium truncate max-w-[250px]">{value.name}</span>
                                    {!disabled && state !== "uploading" && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleClear}
                                            className="size-6 min-w-[44px] min-h-[44px] md:min-w-[24px] md:min-h-[24px] -mr-2"
                                            aria-label="Clear file"
                                        >
                                            <X className="size-4" aria-hidden="true"/>
                                        </Button>
                                    )}
                                </div>
                                {showFileSize && (
                                    <span className="text-xs text-muted-foreground">{formatFileSize(value.size)}</span>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1 text-center">
                                <p className="text-sm font-medium">
                                    {state === "drag-over" ? "Drop file here" : placeholder}
                                </p>
                                {accept && (
                                    <p className="text-xs text-muted-foreground">
                                        Accepted: {accept.split(",").join(", ")}
                                    </p>
                                )}
                                {maxSize && (
                                    <p className="text-xs text-muted-foreground">
                                        Max size: {formatFileSize(maxSize)}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Upload Progress */}
                        {state === "uploading" && (
                            <div className="w-full max-w-xs space-y-2">
                                <Progress value={uploadProgress.percentage} indeterminate={!uploadProgress.percentage}
                                          className="h-2"/>
                                {uploadProgress.percentage ?
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{Math.round(uploadProgress.percentage)}%</span>
                                        <span>
                                        {formatFileSize(uploadProgress.loaded)} / {formatFileSize(uploadProgress.total)}
                                      </span>
                                    </div>
                                    : null}
                            </div>
                        )}

                        {/* Success Message */}
                        {state === "success" && (
                            <p className="text-sm text-green-600 font-medium">Upload successful!</p>
                        )}
                    </div>

                    {/* Upload Button (when not auto-upload) */}
                    {value && !autoUpload && onUpload && state !== "success" && state !== "uploading" && (
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={disabled}
                            className="w-full md:w-auto md:self-start min-h-[44px] md:min-h-[36px]"
                            data-testid={`${dataTestId}-upload-button`}
                        >
                            <Upload className="size-4" aria-hidden="true"/>
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
                            <AlertCircle className="size-4 mt-0.5 shrink-0" aria-hidden="true"/>
                            <span>{validationError}</span>
                        </div>
                    )}
                </div>
            );
        }
    )
);

FileUpload.displayName = "FileUpload";

/**
 * Export types for external use
 */
export type {UploadState as FileUploadState, FileValidation, UploadProgress};