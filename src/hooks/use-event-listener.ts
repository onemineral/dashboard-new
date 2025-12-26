import {useEffect} from "react";

export const useEventListener = (eventName: string, callbackFn: (event: Event) => void) => {
    useEffect(() => {
        window.addEventListener(eventName, callbackFn);

        return () => {
            window.removeEventListener(eventName, callbackFn);
        };
    }, [])
}