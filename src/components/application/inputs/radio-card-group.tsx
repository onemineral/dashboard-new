import {RadioGroupItem} from "@/components/ui/radio-group";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {ReactNode} from "react";

interface RadioCardProps {
    value: string;
    title: ReactNode;
    isSelected: boolean;
    onSelect: () => void;
    /**
     * Content to display when the option is selected (or always visible if hideChildrenUntilSelected is false).
     * Can be a description, custom input, or any React component.
     */
    children?: ReactNode;
    /**
     * When true, children are hidden until the card is selected, then revealed with a slide animation.
     * When false (default), children are always visible.
     * @default false
     */
    hideChildrenUntilSelected?: boolean;
    className?: string;
}

/**
 * RadioCard - A composable radio button card component
 *
 * Features:
 * - Radio button selection with visual card highlighting
 * - Configurable content visibility (always visible or hidden until selected)
 * - Animated content that slides down/up when selected (if hideChildrenUntilSelected is true)
 * - Flexible children prop for custom content (descriptions, inputs, etc.)
 * - Flexible title prop (can include badges, icons, or any React component)
 * - Fully composable - use with RadioGroup and any layout
 *
 * @example
 * // Basic usage in a RadioGroup
 * <RadioGroup value={value} onValueChange={setValue}>
 *   <div className="grid gap-3">
 *     <RadioCard
 *       value="option1"
 *       title="Option 1"
 *       isSelected={value === 'option1'}
 *       onSelect={() => setValue('option1')}
 *     >
 *       <p className="text-sm text-muted-foreground">Description for option 1</p>
 *     </RadioCard>
 *     <RadioCard
 *       value="option2"
 *       title={
 *         <div className="flex items-center gap-2">
 *           <span>Option 2</span>
 *           <Badge variant="secondary">Popular</Badge>
 *         </div>
 *       }
 *       isSelected={value === 'option2'}
 *       onSelect={() => setValue('option2')}
 *     >
 *       <p className="text-sm text-muted-foreground">Description for option 2</p>
 *     </RadioCard>
 *   </div>
 * </RadioGroup>
 *
 * @example
 * // With hidden content that slides in when selected
 * <RadioGroup value={value} onValueChange={setValue}>
 *   <div className="grid gap-3 @md:grid-cols-2">
 *     <RadioCard
 *       value="option1"
 *       title="Option 1"
 *       isSelected={value === 'option1'}
 *       onSelect={() => setValue('option1')}
 *       hideChildrenUntilSelected
 *     >
 *       <p className="text-sm text-muted-foreground">This appears when selected</p>
 *     </RadioCard>
 *     <RadioCard
 *       value="option2"
 *       title="Option 2"
 *       isSelected={value === 'option2'}
 *       onSelect={() => setValue('option2')}
 *       hideChildrenUntilSelected
 *     >
 *       <Textarea
 *         placeholder="Enter custom text..."
 *         onClick={(e) => e.stopPropagation()}
 *       />
 *     </RadioCard>
 *   </div>
 * </RadioGroup>
 *
 * @example
 * // With react-hook-form Controller
 * <Controller
 *   name="agreementType"
 *   control={control}
 *   render={({ field }) => (
 *     <RadioGroup value={field.value} onValueChange={field.onChange}>
 *       <div className="grid gap-3">
 *         <RadioCard
 *           value="standard"
 *           title="Standard Agreement"
 *           isSelected={field.value === 'standard'}
 *           onSelect={() => field.onChange('standard')}
 *         >
 *           <p className="text-sm text-muted-foreground">Pre-defined template</p>
 *         </RadioCard>
 *       </div>
 *     </RadioGroup>
 *   )}
 * />
 */
export function RadioCard({
    value,
    title,
    isSelected,
    onSelect,
    children,
    hideChildrenUntilSelected = false,
    className
}: RadioCardProps) {
    const hasChildren = !!children;

    return (
        <Card
            className={cn(
                "cursor-pointer transition-all shadow-none gap-0 py-4",
                isSelected && "ring-1 border-primary ring-primary ring-offset-0",
                className
            )}
            onClick={onSelect}
        >
            <CardHeader className={'gap-0'}>
                <CardTitle className="text-base flex items-center gap-2">
                    <RadioGroupItem value={value} id={value} />
                    <label htmlFor={value} className="cursor-pointer flex-1">
                        {title}
                    </label>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Children content - either always visible or animated based on selection */}
                {hasChildren && (
                    hideChildrenUntilSelected ? (
                        <div
                            className={cn(
                                "grid transition-all duration-300 ease-in-out",
                                isSelected
                                    ? "grid-rows-[1fr] opacity-100 pt-2"
                                    : "grid-rows-[0fr] opacity-0"
                            )}
                        >
                            <div className="overflow-hidden">
                                {children}
                            </div>
                        </div>
                    ) : (
                        <div className="pt-2">
                            {children}
                        </div>
                    )
                )}
            </CardContent>
        </Card>
    );
}