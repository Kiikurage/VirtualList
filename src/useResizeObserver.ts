import { useEffect, useState } from 'react';

export function useResizeObserver(callback: (entries: ResizeObserverEntry[]) => void) {
    const [resizeObserver] = useState(() => new ResizeObserver(callback));
    useEffect(
        function cleanUpResizeObserver() {
            return () => resizeObserver.disconnect();
        },
        [resizeObserver],
    );

    return resizeObserver;
}
