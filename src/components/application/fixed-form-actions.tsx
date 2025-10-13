import React, {ForwardedRef, ReactNode, useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils.ts";

const FixedFormActions= React.forwardRef(({children, className, visible}: { children: ReactNode, className?: string, visible: boolean }, ref: ForwardedRef<HTMLDivElement>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(1);

    useEffect(() => {
        const setSize = () => {
            setWidth((containerRef.current as HTMLElement | null)?.offsetWidth || 1);
        }

        setSize();
        window.addEventListener('resize', setSize);

        return () => {
            window.removeEventListener('resize', setSize);
        };
    }, []);

    return <div className={cn('w-full', {
        'h-16': visible
    })} ref={containerRef}>
        <div ref={ref} className={cn('fixed bottom-7 flex justify-center', className)} style={{width: `${width}px`}}>
            <div
                data-state={visible ? 'open' : 'closed'}
                className={'bg-background w-fit rounded-xl p-2 text-white flex items-center gap-2 dark data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom transition-all ease-in-out duration-100 data-[state=closed]:hidden transition-discrete'}>
                {children}
            </div>
        </div>
    </div>
});

export default FixedFormActions;