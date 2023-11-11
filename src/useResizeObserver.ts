import { useEffect, useState } from 'react';

export function useResizeObserver(): ResizeObserverWrapper {
    const [resizeObserver] = useState(() => new ResizeObserverWrapper());
    useEffect(
        function cleanUpResizeObserver() {
            return () => resizeObserver.disconnect();
        },
        [resizeObserver],
    );

    return resizeObserver;
}

export class ResizeObserverWrapper {
    private readonly resizeObserver: ResizeObserver;
    private readonly callbacks = new Map<Element, (entry: ResizeObserverEntry) => void>();

    constructor() {
        this.resizeObserver = new ResizeObserver(this.handleResize);
    }

    private handleResize = (entries: ResizeObserverEntry[]) => {
        for (const entry of entries) {
            this.callbacks.get(entry.target)?.(entry);
        }
    };

    observe(element: Element) {
        this.resizeObserver.observe(element);
    }

    unobserve(element: Element) {
        this.resizeObserver.unobserve(element);
    }

    disconnect() {
        this.resizeObserver.disconnect();
        this.callbacks.clear();
    }

    on(element: Element, callback: (entry: ResizeObserverEntry) => void) {
        this.off(element);

        this.callbacks.set(element, callback);
    }

    off(element: Element) {
        this.callbacks.delete(element);
    }
}
