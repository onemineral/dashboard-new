import * as React from "react";
import {useEditor, EditorContent, Editor, EditorContext} from "@tiptap/react";
import {Toggle} from '@/components/ui/toggle';
import {CharacterCounter} from "./character-counter";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Extension } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { ColorPicker } from "@/components/application/inputs/color-picker";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Code,
    Link as LinkIcon,
    Unlink,
    Undo,
    Redo,
    Square,
    Loader2,
    WandSparkles,
    RemoveFormatting
} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useMemo} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";

/**
 * Custom FontSize extension for Tiptap
 */
const FontSize = Extension.create({
    name: "fontSize",

    addOptions() {
        return {
            types: ["textStyle"],
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) =>
                            element.style.fontSize?.replace(/['"]+/g, ""),
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontSize:
                (fontSize: string) =>
                    ({chain}) => {
                        return chain().setMark("textStyle", {fontSize}).run();
                    },
            unsetFontSize:
                () =>
                    ({chain}) => {
                        return chain()
                            .setMark("textStyle", {fontSize: null})
                            .removeEmptyTextStyle()
                            .run();
                    },
        };
    },
});

/**
 * Props for the TextareaTiptap component
 */
export interface TextareaTiptapProps {
    /** Current HTML value (controlled mode) */
    value?: string;
    /** Callback fired when content changes */
    onChange?: (html: string) => void;
    /** Callback fired on blur for form validation */
    onBlur?: () => void;
    /** Placeholder text */
    placeholder?: string;
    /** Whether the editor is disabled */
    disabled?: boolean;
    /** Whether the editor has an error state */
    error?: boolean;
    /** Minimum height of the editor */
    minHeight?: string;
    /** Maximum height of the editor (enables scrolling) */
    maxHeight?: string;
    /** Maximum character limit */
    maxCharacters?: number;
    /** Show character count */
    showCount?: boolean;
    /** Warning threshold percentage (0-1) */
    warningThreshold?: number;
    /** Additional CSS class name for wrapper */
    className?: string;
    /** Additional CSS class name for editor */
    editorClassName?: string;
    /** Additional CSS class name for toolbar */
    toolbarClassName?: string;
    /** Test ID for testing */
    "data-testid"?: string;
}

/**
 * Toolbar button component
 */
const ToolbarButton =
    ({
         onClick,
         isActive,
         disabled,
         children,
         title,
     }: {
        onClick: () => void;
        isActive?: boolean;
        disabled?: boolean;
        children: React.ReactNode;
        title: string;
    }) => {
        const handleClick = React.useCallback(() => {
            onClick();
        }, [onClick]);

        const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
            // Prevent focus loss from editor
            e.preventDefault();
        }, []);

        return (
            <Toggle
                size="sm"
                pressed={isActive}
                onPressedChange={handleClick}
                onMouseDown={handleMouseDown}
                disabled={disabled}
                aria-label={title}
                title={title}
                className="size-8 p-0 data-[state=on]:bg-primary/80 data-[state=on]:text-primary-foreground"
            >
                {children}
            </Toggle>
        );
    };

ToolbarButton.displayName = "ToolbarButton";

/**
 * Link input dialog component
 */
const LinkDialog = React.memo(
    ({
         editor,
         disabled,
     }: {
        editor: Editor;
        disabled?: boolean;
    }) => {
        const [url, setUrl] = React.useState("");
        const [open, setOpen] = React.useState(false);

        const handleSetLink = React.useCallback(() => {
            if (url) {
                editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({href: url})
                    .run();
            }
            setUrl("");
            setOpen(false);
        }, [editor, url]);

        const handleUnlink = React.useCallback(() => {
            editor.chain().focus().unsetLink().run();
            setUrl("");
            setOpen(false);
        }, [editor]);

        const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
            // Prevent focus loss from editor
            e.preventDefault();
        }, []);

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("link")}
                        disabled={disabled}
                        aria-label="Insert link"
                        title="Insert link (Ctrl+K)"
                        className="size-8 p-0"
                        onMouseDown={handleMouseDown}
                    >
                        <LinkIcon className="size-4"/>
                    </Toggle>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <Label htmlFor="link-url">URL</Label>
                            <Input
                                id="link-url"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSetLink();
                                    }
                                }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={handleSetLink}
                                disabled={!url}
                                className="flex-1"
                            >
                                Set Link
                            </Button>
                            {editor.isActive("link") && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleUnlink}
                                    className="flex-1"
                                >
                                    <Unlink className="size-4 mr-1"/>
                                    Remove
                                </Button>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }
);

LinkDialog.displayName = "LinkDialog";

/**
 * AI Assistant Button Component
 *
 * A self-contained component that provides AI-powered text transformation
 * with a modal preview, streaming support, and accept/cancel functionality.
 */
interface AIAssistantButtonProps {
    editor: Editor;
    disabled?: boolean;
}

const AIAssistantButton = React.memo(
    ({ editor, disabled }: AIAssistantButtonProps) => {
        const [loading, setLoading] = React.useState(false);

        // AI Modal state
        const [isAIModalOpen, setIsAIModalOpen] = React.useState(false);
        const [aiPreviewContent, setAiPreviewContent] = React.useState("");
        const [aiActionType, setAiActionType] = React.useState("");
        const [aiSubAction, setAiSubAction] = React.useState("");
        const [isStreaming, setIsStreaming] = React.useState(false);
        const [originalText, setOriginalText] = React.useState("");

        // Mock AI text modify API
        const mockAITextModify = async (action: string, text: string, subAction?: string): Promise<string> => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            switch (action) {
                case 'restructure':
                    return `Restructured: ${text}`;
                case 'rephrase':
                    return `Rephrased: ${text}`;
                case 'shorten':
                    return text.length > 10 ? text.slice(0, Math.floor(text.length / 2)) + '...' : text;
                case 'extend':
                    return `${text} (extended with additional details for better understanding)`;
                case 'summarize':
                    return text.length > 50 ? `Summary: ${text.slice(0, 50)}...` : `Summary: ${text}`;
                case 'simplify':
                    return `Simplified: ${text}`;
                case 'fix_spelling':
                    return text.replace(/teh/g, 'the').replace(/recieve/g, 'receive').replace(/seperate/g, 'separate');
                case 'change_tone':
                    return `Tone changed to ${subAction}: ${text}`;
                default:
                    return text;
            }
        };

        // Simulate streaming text generation
        const simulateStreaming = async (text: string, onChunk: (chunk: string) => void) => {
            const words = text.split(' ');
            for (let i = 0; i < words.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Simulate streaming delay
                onChunk(words.slice(0, i + 1).join(' '));
            }
        };

        // Handle AI action with modal preview
        const handleAIAction = async (action: string, subAction?: string) => {
            setLoading(true);
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to, ' ');
            const textToModify = selectedText.trim() || editor.getText().trim();
            
            if (!textToModify) return; // No text to modify
            
            // Store original text and action info
            setOriginalText(textToModify);
            setAiActionType(action);
            setAiSubAction(subAction || "");
            setIsStreaming(true);
            setIsAIModalOpen(true);
            setAiPreviewContent(""); // Start with empty preview
            
            try {
                const modifiedText = await mockAITextModify(action, textToModify, subAction);
                
                // Simulate streaming the result
                await simulateStreaming(modifiedText, (chunk) => {
                    setAiPreviewContent(chunk);
                });
                
            } catch (error) {
                console.error('AI text modify error:', error);
                setAiPreviewContent("Error generating content. Please try again.");
            } finally {
                setIsStreaming(false);
                setLoading(false);
            }
        };

        // Handle accepting AI changes
        const handleAcceptAIChanges = () => {
            if (!editor || !aiPreviewContent) return;
            
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to, ' ');
            
            if (selectedText.trim()) {
                // Replace selected text
                editor.chain().focus().deleteSelection().insertContent(aiPreviewContent).run();
            } else {
                // Replace entire content
                editor.commands.setContent(`<p>${aiPreviewContent}</p>`);
            }
            
            setIsAIModalOpen(false);
            setAiPreviewContent("");
        };

        // Handle canceling AI changes
        const handleCancelAIChanges = () => {
            setIsAIModalOpen(false);
            setAiPreviewContent("");
            setOriginalText("");
            setAiActionType("");
            setAiSubAction("");
        };

        return (
            <>
                {/* AI Text Tools Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="size-8 p-0"
                            disabled={disabled || loading}
                            title="AI Text Tools"
                        >
                            {loading ? <Loader2 className="size-4 animate-spin" /> : <WandSparkles className="size-4" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => handleAIAction('restructure')}>Restructure</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAIAction('rephrase')}>Rephrase</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAIAction('shorten')}>Shorten</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAIAction('extend')}>Extend</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAIAction('summarize')}>Summarize</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAIAction('simplify')}>Simplify</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAIAction('fix_spelling')}>Fix Spelling</DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Change Tone</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => handleAIAction('change_tone', 'formal')}>Formal</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAIAction('change_tone', 'casual')}>Casual</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAIAction('change_tone', 'professional')}>Professional</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAIAction('change_tone', 'friendly')}>Friendly</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* AI Preview Modal */}
                <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>AI Text Transformation</DialogTitle>
                            <DialogDescription>
                                {aiActionType && `Action: ${aiActionType}${aiSubAction ? ` (${aiSubAction})` : ''}`}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex-1 mt-3 flex flex-col gap-4">
                            {/* Original text section */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <h4 className="text-sm font-medium mb-2">Original Text</h4>
                                <div className="flex-1 overflow-y-auto p-3 bg-muted rounded-md text-sm">
                                    {originalText}
                                </div>
                            </div>
                            
                            {/* Preview section */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <h4 className="text-sm font-medium mb-2">AI Generated Preview</h4>
                                <div className="flex-1 overflow-y-auto p-3 bg-muted rounded-md text-sm">
                                    {isStreaming ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="size-4 animate-spin" />
                                            <span>Generating content...</span>
                                        </div>
                                    ) : (
                                        aiPreviewContent || "No content generated"
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <DialogFooter className="flex gap-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={handleCancelAIChanges}
                                disabled={isStreaming}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAcceptAIChanges}
                                disabled={isStreaming || !aiPreviewContent}
                            >
                                Accept
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        );
    }
);

AIAssistantButton.displayName = "AIAssistantButton";

/**
 * TextareaTiptap component
 *
 * A production-ready HTML rich text editor built with Tiptap that functions as a textarea replacement.
 * Supports rich text formatting, HTML input/output, form integration, AI-powered text manipulation,
 * and maintains consistent styling with other form inputs.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [content, setContent] = useState("<p>Hello world</p>");
 * <TextareaTiptap
 *   value={content}
 *   onChange={setContent}
 *   placeholder="Start typing..."
 * />
 *
 * // With React Hook Form
 * <Controller
 *   name="description"
 *   control={control}
 *   render={({ field, fieldState }) => (
 *     <TextareaTiptap
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       error={!!fieldState.error}
 *       maxCharacters={5000}
 *     />
 *   )}
 * />
 *
 * // With character limit
 * <TextareaTiptap
 *   value={content}
 *   onChange={setContent}
 *   maxCharacters={1000}
 *   maxHeight="300px"
 * />
 *
 * // Extract plain text
 * const plainText = editor.getText();
 *
 * // With AI text manipulation
 * // Select text and use the AI tools dropdown in the toolbar to restructure, rephrase, etc.
 * ```
 *
 * // With color picker
 * const [content, setContent] = useState("<p><span style='color: #FF5733'>Colored text</span></p>");
 * <TextareaTiptap
 *   value={content}
 *   onChange={setContent}
 *   placeholder="Type and pick a color..."
 * />
 */
export const TextareaTiptap = React.memo(
    React.forwardRef<HTMLDivElement, TextareaTiptapProps>(
        (
            {
                value,
                onChange,
                onBlur,
                placeholder = "Start typing...",
                disabled = false,
                error = false,
                minHeight = "150px",
                maxHeight,
                maxCharacters,
                showCount = true,
                warningThreshold = 0.8,
                className,
                editorClassName,
                toolbarClassName,
                "data-testid": dataTestId,
            },
            ref
        ) => {
            const [isFocused, setIsFocused] = React.useState(false);
            // Force re-render when selection changes to update toolbar button states
            const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

            // Initialize editor with extensions
            const editor = useEditor({
                extensions: [
                    StarterKit.configure({
                        heading: {
                            levels: [1, 2, 3],
                        },
                    }),
                    TextStyle,
                    Color, // <-- Add color extension
                    FontSize,
                    Placeholder.configure({
                        placeholder,
                    }),
                ],
                content: value,
                editable: !disabled,
                onUpdate: ({editor}) => {
                    const html = editor.getHTML();
                    onChange?.(html);
                },
                onSelectionUpdate: () => {
                    // Force re-render to update toolbar button states
                    forceUpdate();
                },
                onFocus: () => setIsFocused(true),
                onBlur: () => {
                    setIsFocused(false);
                    onBlur?.();
                },
            });

            // Memoize the provider value to avoid unnecessary re-renders
            const providerValue = useMemo(() => ({editor}), [editor])

            if (!editor) {
                return null;
            }

            const shouldShowCounter = (showCount || maxCharacters !== undefined);

            return (
                <EditorContext.Provider value={providerValue}>
                    <div
                        ref={ref}
                        className={cn("w-full flex flex-col rounded-md border border-input bg-background", className, isFocused && !error && "border-ring ring-ring/50 ring-[3px]",)}
                        data-testid={dataTestId}
                    >
                        {/* Toolbar */}
                        <div
                            className={cn(
                                "rounded-sm bg-accent m-1 p-2 flex flex-wrap items-center gap-1",
                                disabled && "opacity-50 pointer-events-none",
                                error && "border-destructive",
                                toolbarClassName
                            )}
                            data-slot="toolbar"
                        >
                            {/* AI Text Tools */}
                            <AIAssistantButton editor={editor} disabled={disabled} />

                            {/* Text Formatting */}
                            <ToolbarButton
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                isActive={editor.isActive("bold")}
                                disabled={disabled}
                                title="Bold (Ctrl+B)"
                            >
                                <Bold className="size-4"/>
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                isActive={editor.isActive("italic")}
                                disabled={disabled}
                                title="Italic (Ctrl+I)"
                            >
                                <Italic className="size-4"/>
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                isActive={editor.isActive("underline")}
                                disabled={disabled}
                                title="Underline (Ctrl+U)"
                            >
                                <UnderlineIcon className="size-4"/>
                            </ToolbarButton>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Toggle
                                        size="sm"
                                        pressed={!!editor.getAttributes("textStyle").color}
                                        aria-label="Text color"
                                        title="Text color"
                                        className="size-8 p-0"
                                        disabled={disabled}
                                        style={{
                                            color: editor.getAttributes("textStyle").color || undefined,
                                            borderColor: editor.getAttributes("textStyle").color
                                                ? editor.getAttributes("textStyle").color
                                                : '#000000',
                                        }}
                                    >
                                        <Square className="size-4" style={{
                                            backgroundColor: editor.getAttributes("textStyle").color || '#000000',
                                        }} />
                                    </Toggle>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-3" align="start">
                                    <div className="flex flex-col gap-2">
                                        <ColorPicker
                                            value={editor.getAttributes("textStyle").color || "#000000"}
                                            onChange={(color) => {
                                                editor.chain().focus().setColor(color).run();
                                                // Do NOT close the popover here!
                                            }}
                                            disabled={disabled}
                                            data-testid="tiptap-color-picker"
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="mt-1"
                                            onClick={() => {
                                                editor.chain().focus().unsetColor().run();
                                            }}
                                            disabled={disabled || !editor.getAttributes("textStyle").color}
                                            tabIndex={0}
                                        >
                                            Reset Color
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {/* Clear Formatting */}
                            <ToolbarButton
                                onClick={() => {
                                    editor.chain().focus().clearNodes().unsetAllMarks().run();
                                }}
                                disabled={disabled || editor.state.selection.empty}
                                title="Clear Formatting"
                                isActive={false}
                            >
                                <RemoveFormatting className="size-4"/>
                            </ToolbarButton>

                            <Separator orientation="vertical" className="h-6"/>

                            {/* Headings */}
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleHeading({level: 1}).run()
                                }
                                isActive={editor.isActive("heading", {level: 1})}
                                disabled={disabled}
                                title="Heading 1"
                            >
                                <Heading1 className="size-4"/>
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleHeading({level: 2}).run()
                                }
                                isActive={editor.isActive("heading", {level: 2})}
                                disabled={disabled}
                                title="Heading 2"
                            >
                                <Heading2 className="size-4"/>
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleHeading({level: 3}).run()
                                }
                                isActive={editor.isActive("heading", {level: 3})}
                                disabled={disabled}
                                title="Heading 3"
                            >
                                <Heading3 className="size-4"/>
                            </ToolbarButton>

                            <Separator orientation="vertical" className="h-6"/>

                            {/* Lists */}
                            <ToolbarButton
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                isActive={editor.isActive("bulletList")}
                                disabled={disabled}
                                title="Bullet List"
                            >
                                <List className="size-4"/>
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                isActive={editor.isActive("orderedList")}
                                disabled={disabled}
                                title="Numbered List"
                            >
                                <ListOrdered className="size-4"/>
                            </ToolbarButton>

                            <Separator orientation="vertical" className="h-6"/>

                            {/* Code Block */}
                            <ToolbarButton
                                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                isActive={editor.isActive("codeBlock")}
                                disabled={disabled}
                                title="Code Block"
                            >
                                <Code className="size-4"/>
                            </ToolbarButton>

                            {/* Link */}
                            <LinkDialog editor={editor} disabled={disabled}/>

                            {/* Font Size */}
                            <select
                                value={editor.getAttributes("textStyle").fontSize || "12px"}
                                onChange={(e) => {
                                    editor.chain().focus().setFontSize(e.target.value).run();
                                }}
                                disabled={disabled}
                                aria-label="Font size"
                                title="Font size"
                                className={cn(
                                    "h-8 rounded-md border border-input bg-background px-2 text-sm",
                                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                    "hover:bg-accent hover:text-accent-foreground transition-colors"
                                )}
                            >
                                <option value="12px">12px</option>
                                <option value="14px">14px</option>
                                <option value="16px">16px</option>
                                <option value="18px">18px</option>
                                <option value="24px">24px</option>
                                <option value="32px">32px</option>
                            </select>

                            {/* Undo/Redo */}
                            <ToolbarButton
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={disabled || !editor.can().undo()}
                                title="Undo (Ctrl+Z)"
                            >
                                <Undo className="size-4"/>
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={disabled || !editor.can().redo()}
                                title="Redo (Ctrl+Y)"
                            >
                                <Redo className="size-4"/>
                            </ToolbarButton>
                        </div>

                        {/* Editor Content */}
                        <div
                            className={cn(
                                "relative bg-background rounded-b-md overflow-hidden",
                                disabled && "opacity-50 pointer-events-none cursor-not-allowed",
                                error && "border-destructive",
                                shouldShowCounter && "pb-8"
                            )}
                            data-slot="editor-container"
                            style={{
                                minHeight,
                                maxHeight,
                            }}
                        >
                            <EditorContent
                                editor={editor}
                                className={cn(
                                    "rich-text-editor prose prose-sm max-w-none px-3 py-2 focus:outline-none cursor-text",
                                    maxHeight && "overflow-y-auto",
                                    editorClassName
                                )}
                                onClick={() => editor.chain().focus()}
                                style={{
                                    minHeight,
                                    maxHeight,
                                }}
                                data-slot="editor"
                            />

                            {/*Character Counter */}
                            <CharacterCounter
                                characterCount={editor?.getText().length || 0}
                                maxCharacters={maxCharacters}
                                showCount={showCount}
                                warningThreshold={warningThreshold}
                                disabled={disabled}
                            />
                        </div>
                    </div>

                </EditorContext.Provider>
            );
        }
    )
);

TextareaTiptap.displayName = "TextareaTiptap";

/**
 * Text color picker integration:
 * - Uses Tiptap's @tiptap/extension-color and @tiptap/extension-text-style.
 * - The toolbar includes a color picker button (palette icon) that opens a popover with a color picker.
 * - Selecting a color applies it to the selected text. "Reset Color" clears the color formatting.
 * - Uses the project's ColorPicker component for a consistent, accessible UI.
 * - Fully compatible with other formatting and mobile-friendly.
 */

/**
 * AI-powered text manipulation integration:
 * - Provides a dropdown menu with AI tools for text transformation.
 * - Supports restructuring, rephrasing, shortening, extending, summarizing, simplifying, fixing spelling, and changing tone.
 * - Uses a mock API for development; replace with actual backend endpoint.
 * - Handles selected text or entire editor content.
 * - Shows loading state during API calls and handles errors gracefully.
 * - Accessible via keyboard navigation and screen readers.
 */

/**
 * Helper function to extract plain text from HTML
 */
export const getPlainTextFromHTML = (html: string): string => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
};

/**
 * Helper function to check if HTML content is empty
 */
export const isHTMLEmpty = (html: string): boolean => {
    const plainText = getPlainTextFromHTML(html);
    return !plainText.trim();
};