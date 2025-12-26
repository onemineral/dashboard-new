import { Separator } from "@/components/ui/separator.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { ReactNode, useState } from "react";
import { FormItem } from "@/components/ui/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { useFilter } from "@/components/application/filters/hooks/use-filter";
import { Plus } from "lucide-react";
import { FilterRemoveButton } from "@/components/application/filters/filters";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { useIntl } from "react-intl";

const RadioFilter = ({ options, field }: { options: { [key: string]: string | ReactNode }, field: string }) => {
    const { remove, settings, set, selection } = useFilter();
    const intl = useIntl();
    const value = selection?.value;
    const [internalValue, setInternalValue] = useState<string | undefined>(value?.[0]);
    const [open, setOpen] = useState<boolean>(!settings.featured && selection?.value === null);

    const updateValue = () => {
        if (internalValue) {
            set(internalValue, {
                where: {
                    conditions: [
                        {
                            field,
                            in: [internalValue]
                        }
                    ]
                }
            });
        } else {
            remove();
        }
    }

    return (
        <div
            className={cn('transition-all bg-background flex items-center group border shadow-xs border-input rounded-lg hover:bg-accent', {
                'border-dashed': !selection?.value,
            })}
        >
            <Popover open={open} defaultOpen={open} modal onOpenChange={(o) => {
                setOpen(!open);
                if (o) return;
                updateValue();
            }}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm"
                        className={cn("border-0 rounded-xl group-hover:bg-accent h-8 pr-0 focus-visible:ring-0", {
                            'text-gray-700': !selection?.body
                        })}>
                        <span className={'flex items-center gap-2'}>
                            {settings.label}
                            {value && value.length > 0 ? (
                                <>
                                    <Separator orientation="vertical" className="h-4!" />
                                    <Badge variant="default" className="lg:hidden">{1}</Badge>
                                    <div className="hidden gap-1 lg:flex text-emerald-700">
                                        {(() => {
                                            const displayText = Object.keys(options)
                                                .filter((k) => selection?.value == k)
                                                .map((k) => options[k])
                                                .join(', ');
                                            return displayText.length > 100
                                                ? displayText.slice(0, 100) + '…'
                                                : displayText;
                                        })()}
                                    </div>
                                </>
                            ) : <Plus className={'mr-3 size-3'} />}
                        </span>
                    </Button>
                </PopoverTrigger>

                <PopoverContent className={cn({
                    'ml-5': value,
                })}>
                    <FormItem>
                        <RadioGroup
                            value={internalValue}
                            onValueChange={setInternalValue}
                            className="flex flex-col gap-2"
                        >
                            {Object.keys(options).map((key: string) => {
                                const id = `radio-${field}-${key}`;
                                return (
                                    <div key={key} className="flex items-center gap-2">
                                        <RadioGroupItem value={key} id={id} />
                                        <label htmlFor={id} className="cursor-pointer select-none">{options[key]}</label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </FormItem>

                    <Button variant={'default'} className={'w-full mt-4'} onClick={() => {
                        updateValue();
                        setOpen(!open);
                    }}>
                        {intl.formatMessage({
                            defaultMessage: "Apply",
                            description: "Button to apply the radio filter selection"
                        })}
                    </Button>
                </PopoverContent>
            </Popover>
            <FilterRemoveButton onClick={() => setInternalValue(undefined)} />
        </div>
    );
}

export default RadioFilter;