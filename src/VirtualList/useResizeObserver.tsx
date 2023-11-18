import { useEffect, useState } from 'react';

export function useResizeObserver(): ResizeObserverWrapper {
    const [resizeObserver] = useState(() => new ResizeObserverWrapper());

    useEffect(() => {
        return () => resizeObserver.disconnect();
    }, [resizeObserver]);

    return resizeObserver;
}

export class ResizeObserverWrapper {
    private readonly resizeObserver: ResizeObserver;
    private readonly callbacks = new Map<Element, (entry: ResizeObserverEntry) => void>();

    constructor() {
        this.resizeObserver = new ResizeObserver(this.onResize);
    }

    private readonly onResize = (entries: ResizeObserverEntry[]) => {
        for (const entry of entries) {
            this.callbacks.get(entry.target)?.(entry);
        }
    };

    observe(target: Element, callback: (entry: ResizeObserverEntry) => void) {
        this.unobserve(target);
        this.resizeObserver.observe(target);
        this.callbacks.set(target, callback);
    }

    unobserve(target: Element) {
        this.resizeObserver.unobserve(target);
        this.callbacks.delete(target);
    }

    disconnect() {
        this.resizeObserver.disconnect();
        this.callbacks.clear();
    }
}
