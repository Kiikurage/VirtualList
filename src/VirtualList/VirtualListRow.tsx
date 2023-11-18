import { useLayoutEffect, useRef } from 'react';
import { ResizeObserverWrapper } from './useResizeObserver';

export const VirtualListRow = ({
    row,
    top,
    resizeObserver,
    onResize,
}: {
    row: number;
    top: number;
    resizeObserver: ResizeObserverWrapper;
    onResize: (row: number, entry: ResizeObserverEntry) => void;
}) => {
    const rowRef = useRef<HTMLLIElement | null>(null);
    useLayoutEffect(() => {
        const viewport = rowRef.current;
        if (viewport === null) return;

        resizeObserver.observe(viewport, (entry) => onResize(row, entry));
        return () => resizeObserver.unobserve(viewport);
    }, [onResize, resizeObserver, row]);

    return (
        <li
            ref={rowRef}
            style={{
                position: 'absolute',
                top: `${top}px`,
                width: '100%',
            }}
        >
            <div
                style={{
                    padding: '20px',
                    borderTop: '1px solid #000',
                    overflow: 'hidden',
                    resize: 'vertical',
                    background: '#fff',
                    boxSizing: 'border-box',
                }}
            >
                ListItem {row}
            </div>
        </li>
    );
};
