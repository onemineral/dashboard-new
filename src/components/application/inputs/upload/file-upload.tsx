import * as React from "react";
import {Upload, X, File, CheckCircle2, AlertCircle} from "lucide-react";
import { useIntl } from "react-intl";
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
} from "./upload-utils";

/**
 * Upload state types
 */
export type UploadState = "idle" | "drag-over" | "uploading" | "success" | "error";

/**
 * Currently uploaded file interface
 */
export interface CurrentUploadedFile {
    /** URL to access the file */
    url: string;
    /** Name of the file */
    name: string;
}

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
    /** Upload handler function */
    onUpload?: (file: File) => Promise<void>;
    /** Currently uploaded file from database */
    currentUploadedFile?: CurrentUploadedFile | null;
    /** Callback when removing the currently uploaded file */
    onRemoveCurrentUploadedFile?: () => void;
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
 * const handleUpload = async (file: File) => {
 *   const formData = new FormData();
 *   formData.append('file', file);
 *   await fetch('/api/upload', {
 *     method: 'POST',
 *     body: formData,
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
 * // With currently uploaded file from database
 * <FileUpload
 *   value={file}
 *   onChange={setFile}
 *   currentUploadedFile={{ url: 'https://example.com/file.pdf', name: 'document.pdf' }}
 *   onRemoveCurrentUploadedFile={() => console.log('Remove file')}
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
                currentUploadedFile,
                onRemoveCurrentUploadedFile,
                accept,
                maxSize,
                validate,
                disabled = false,
                error = false,
                className,
                placeholder,
                uploadButtonText,
                showFileSize = true,
                autoUpload = false,
                "data-testid": dataTestId,
            },
            ref
        ) => {
            const intl = useIntl();
            
            // State management
            const [state, setState] = React.useState<UploadState>("idle");
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
                        setValidationError(validation.error || intl.formatMessage({ defaultMessage: "Invalid file", description: "Error message when a file is invalid" }));
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

                            await onUpload(file);

                            setState("success");
                            setTimeout(() => onBlur?.(), 0);
                        } catch (err) {
                            setState("error");
                            const message = (err as any).responseBody?.message || (err as any).message;
                            setValidationError(message || intl.formatMessage({ defaultMessage: "Upload failed", description: "Error message when file upload fails" }));
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

                    await onUpload(value);

                    setState("success");
                    setTimeout(() => onBlur?.(), 0);
                } catch (err) {
                    setState("error");
                    const message = (err as any).responseBody?.message || (err as any).message;
                    setValidationError(message || intl.formatMessage({ defaultMessage: "Upload failed", description: "Error message when file upload fails" }));
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
                    setPreviewUrl(undefined);

                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }

                    setTimeout(() => onBlur?.(), 0);
                },
                [onChange, onBlur, previewUrl]
            );

            /**
             * Handle removing currently uploaded file
             */
            const handleRemoveCurrentUploadedFile = React.useCallback(
                (e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();

                    onRemoveCurrentUploadedFile?.();
                    setTimeout(() => onBlur?.(), 0);
                },
                [onRemoveCurrentUploadedFile, onBlur]
            );

            /**
             * Check if current file is an image
             */
            const isCurrentFileImage = React.useMemo(() => {
                if (!currentUploadedFile) return false;
                const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
                return imageExtensions.some(ext => currentUploadedFile.name.toLowerCase().endsWith(ext));
            }, [currentUploadedFile]);


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
                        aria-label={intl.formatMessage({ defaultMessage: "File input", description: "ARIA label for the hidden file input" })}
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
                        aria-label={intl.formatMessage({ defaultMessage: "Upload file", description: "ARIA label for the upload dropzone area" })}
                        aria-disabled={disabled}
                        data-testid={`${dataTestId}-dropzone`}
                    >
                        {/* Icon */}
                        {state === "success" ? (
                            <CheckCircle2 className="size-12 text-green-600" aria-hidden="true"/>
                        ) : state === "error" || validationError ? (
                            <AlertCircle className="size-12 text-destructive" aria-hidden="true"/>
                        ) : currentUploadedFile && !value ? (
                            /* Currently Uploaded File Display */
                            <div className="flex flex-col items-center gap-3 w-full">
                                {/* Image Preview with Delete Button */}
                                {isCurrentFileImage ? (
                                    <div className="relative p-1 rounded-lg overflow-hidden border border-border group">
                                        <img
                                            src={currentUploadedFile.url}
                                            alt={currentUploadedFile.name}
                                            className="max-h-20 max-w-60"
                                        />
                                        {!disabled && onRemoveCurrentUploadedFile && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={handleRemoveCurrentUploadedFile}
                                                className="absolute top-2 right-2 size-8 min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                aria-label={intl.formatMessage({ defaultMessage: "Remove file", description: "ARIA label for remove current file button" })}
                                            >
                                                <X className="size-4" aria-hidden="true" />
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    /* Non-image file with delete button */
                                    <div className="relative">
                                        <File className="size-16 text-muted-foreground" aria-hidden="true" />
                                        {!disabled && onRemoveCurrentUploadedFile && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={handleRemoveCurrentUploadedFile}
                                                className="absolute -top-2 -right-2 size-8 min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px] shadow-lg"
                                                aria-label={intl.formatMessage({ defaultMessage: "Remove file", description: "ARIA label for remove current file button" })}
                                            >
                                                <X className="size-4" aria-hidden="true" />
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
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
                                    <div className="relative rounded-lg p-1 overflow-hidden border border-border">
                                        <img
                                            src={previewUrl}
                                            alt={value.name}
                                            className="max-h-20 max-w-60"
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
                                            aria-label={intl.formatMessage({ defaultMessage: "Clear file", description: "ARIA label for the clear file button" })}
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
                                    {state === "drag-over"
                                        ? intl.formatMessage({ defaultMessage: "Drop file here", description: "Message shown when dragging a file over the dropzone" })
                                        : placeholder || intl.formatMessage({ defaultMessage: "Drop file here or click to browse", description: "Placeholder text for the file upload dropzone" })
                                    }
                                </p>
                                {accept && (
                                    <p className="text-xs text-muted-foreground">
                                        {intl.formatMessage({ defaultMessage: "Accepted: {types}", description: "Label showing accepted file types" }, { types: accept.split(",").join(", ") })}
                                    </p>
                                )}
                                {maxSize && (
                                    <p className="text-xs text-muted-foreground">
                                        {intl.formatMessage({ defaultMessage: "Max size: {size}", description: "Label showing maximum file size" }, { size: formatFileSize(maxSize) })}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Upload Progress */}
                        {state === "uploading" && (
                            <div className="w-full max-w-xs space-y-2">
                                <Progress indeterminate className="h-2"/>
                                <div className="flex items-center justify-center text-xs text-muted-foreground">
                                    <span>{intl.formatMessage({ defaultMessage: "Uploading...", description: "Status text while file is uploading" })}</span>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {state === "success" && (
                            <p className="text-sm text-green-600 font-medium">
                                {intl.formatMessage({ defaultMessage: "Upload successful!", description: "Success message when file upload completes" })}
                            </p>
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
                            {uploadButtonText || intl.formatMessage({ defaultMessage: "Upload", description: "Button text to upload the selected file" })}
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
export type {UploadState as FileUploadState, FileValidation};