import { useLocation, useNavigate } from "react-router-dom"

export function useNavigateBack(fallback: string): () => void {
    const location = useLocation();
    const navigate = useNavigate();

    return () => {
        if(location.state?.background) {
            // we are in a modal. we can do navigate(-1) to close the modal
            navigate(-1);
            return;
        }

        // If there is an in-app entry in the history, navigate back.
        // React Router manages window.history.state.idx. When idx > 0 we can safely go back.
        const idx = (window.history.state as { idx?: number } | null | undefined)?.idx ?? 0;
        if (idx > 0) {
            navigate(-1);
            return;
        }

        // we found nothing in the history. there is nowhere to go back so we use the fallback url
        // Use replace to avoid polluting the history stack.
        navigate(fallback, { replace: true });
    }
}
