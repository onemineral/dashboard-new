import {matchPath, useLocation} from "react-router-dom";

export function useMatchPath(): (pattern: string) => boolean {
    const location = useLocation();

    return (pattern: string) => {
        return !!matchPath(pattern, location.pathname);
    };
}