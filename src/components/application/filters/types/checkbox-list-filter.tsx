import {Separator} from "@/components/ui/separator.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {ReactNode, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {useFilter} from "@/components/application/filters/hooks/use-filter";
import {Plus} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {FilterRemoveButton} from "@/components/application/filters/filters";
import {FormattedMessage} from "react-intl";

const CheckboxListFilter = ({options, field}: { options: { [key: string]: string | ReactNode }, field: string }) => {
    const {remove, settings, set, selection} = useFilter();
    const [internalValue, setInternalValue] = useState<string[]>(selection?.value || []);
    const [open, setOpen] = useState<boolean>(!settings.featured && selection?.value === null);

    const updateValue = () => {
        if (internalValue.length) {
            set(internalValue, {
                where: {
                    conditions: [
                        {
                            field,
                            in: internalValue
                        }
                    ]
                }
            });
        } else {
            remove();
        }
    }

    return <div
        className={cn('transition-all  bg-background flex items-center group border rounded-lg hover:bg-accent shadow-xs', {
            'border-dashed': !selection?.value,
        })}>
        <Popover open={open} defaultOpen={open} modal onOpenChange={(o) => {
            setOpen(!open);
            if(o) {
                return;
            }

            updateValue();
        }}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm"
                        className={cn("border-0 shadow-none rounded-xl group-hover:bg-accent h-8 pr-0 focus-visible:ring-0", {
                            'text-gray-700': !selection?.body
                        })}>

                    <span className={'flex items-center gap-2'}>
                        {settings.label}
                        {selection?.value?.length > 0 ? (
                            <>
                                <Separator orientation="vertical" className="h-4!"/>
                                <Badge variant="default" className="lg:hidden">{selection?.value.length}</Badge>
                                <div className="hidden gap-1 lg:flex text-emerald-700">
                                    {selection?.value.length > 2 ? (
                                        <FormattedMessage
                                            defaultMessage="{count} {count, plural, one {selected} other {selected}}"
                                            description="Number of items selected in checkbox filter"
                                            values={{ count: selection?.value.length }}
                                        />
                                    ) : Object.keys(options).filter((k) => selection?.value.includes(k)).map((k) => options[k]).join(', ')}
                                </div>
                            </>
                        ) : <Plus className={'mr-3 size-3'}/>}
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent className={cn('mt-1 flex flex-col gap-3 dark', {
                'ml-5': selection?.value
            })}>
                {Object.keys(options).map((key: string) => (
                    <Label className="flex items-center gap-2" key={key}>
                        <Checkbox id={key} checked={internalValue.includes(key)} onCheckedChange={(e) => {
                            if (e) {
                                if (!internalValue.includes(key)) {
                                    setInternalValue([...internalValue, key]);
                                }
                            } else {
                                setInternalValue([...internalValue.filter((v) => v !== key)]);
                            }
                        }}
                                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-foreground data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                        />
                        <div className="grid gap-1.5 font-normal">
                            <p className="text-sm leading-none font-medium">
                                {options[key]}
                            </p>
                        </div>
                    </Label>
                ))}

                <Button variant={'default'} className={'w-full mt-2'} onClick={() => {
                    updateValue();
                    setOpen(!open);
                }}>
                    <FormattedMessage defaultMessage="Apply" description="Button to apply the checkbox filter selection" />
                </Button>
            </PopoverContent>
        </Popover>
        <FilterRemoveButton onClick={() => setInternalValue([])} />
    </div>
}

export default CheckboxListFilter;