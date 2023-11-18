import { useEffect, useState } from 'react';

export function useResizeObserver(callback: (entries: ResizeObserverEntry[]) => void): ResizeObserver {
    const [resizeObserver] = useState(() => new ResizeObserver(callback));

    useEffect(() => {
        return () => resizeObserver.disconnect();
    }, [resizeObserver]);

    return resizeObserver;
}
