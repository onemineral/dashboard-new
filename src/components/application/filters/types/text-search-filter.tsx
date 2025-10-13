import {cn} from "@/lib/utils.ts";
import {Input} from "@/components/ui/input.tsx";
import * as React from "react";
import {useFilter} from "@/components/application/filters/hooks/use-filter";
import {useEffect, useRef, useState} from "react";

const TextSearchFilter = ({field, className, ...props}: { field: string } & React.ComponentProps<"input">) => {
    const {remove, set, selection} = useFilter();
    const [internalValue, setInternalValue] = useState(selection?.value);
    const ref = useRef<any>(null);

    useEffect(() => {
        if(ref.current) {
            clearTimeout(ref.current);
        }

        ref.current = setTimeout(() => {
            if(internalValue) {
                set(internalValue, {
                    where: {
                        conditions: [
                            {
                                field: 'name',
                                contains: {
                                    value: internalValue
                                },
                            }
                        ]
                    }
                })
            } else {
                remove();
            }
        }, 400);
    }, [internalValue]);


    return <Input
            placeholder="Start typing..."
            value={internalValue}
            name={field}
            onChange={(e) => setInternalValue(e.target.value)}
            className={cn("h-8.5 w-[250px]", className)}
            {...props}
        />
}

export default TextSearchFilter;