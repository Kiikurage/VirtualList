import { ComponentType, useLayoutEffect, useRef } from 'react';
import { ResizeObserverWrapper } from './useResizeObserver';

export const VirtualListItemView = ({
    row,
    top,
    ItemRenderer,
    resizeObserver,
    onRowHeightChange,
}: {
    row: number;
    top: number;
    ItemRenderer: ComponentType<{ row: number }>;
    resizeObserver: ResizeObserverWrapper;
    onRowHeightChange: (row: number, height: number) => void;
}) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(
        function observeRowHeight() {
            const wrapper = wrapperRef.current;
            if (wrapper === null) return;

            resizeObserver.on(wrapper, (entry) => {
                onRowHeightChange(row, entry.contentRect.height);
            });
            return () => resizeObserver.unobserve(wrapper);
        },
        [onRowHeightChange, resizeObserver, row],
    );

    return (
        <div
            ref={wrapperRef}
            style={{
                position: 'absolute',
                top: `${top}px`,
                width: '100%',
            }}
        >
            <ItemRenderer row={row} />
        </div>
    );
};
