import { ComponentType, useLayoutEffect, useRef } from 'react';
import { ResizeObserverWrapper } from './useResizeObserver';

export const VirtualListRow = ({
    row,
    top,
    resizeObserver,
    onResize,
    rowRenderer: RowRenderer,
}: {
    row: number;
    top: number;
    resizeObserver: ResizeObserverWrapper;
    onResize: (row: number, entry: ResizeObserverEntry) => void;
    rowRenderer: ComponentType<{ row: number }>;
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
            <RowRenderer row={row} />
        </li>
    );
};
