import { ComponentType, useLayoutEffect, useRef } from 'react';
import { ResizeObserverWrapper } from './useResizeObserver';

export const VirtualListItemView = ({
    hidden = false,
    row,
    top,
    ItemRenderer,
    resizeObserver,
    onRowHeightChange,
}: {
    hidden?: boolean;
    row: number;
    top: number;
    ItemRenderer: ComponentType<{ row: number }>;
    resizeObserver: ResizeObserverWrapper;
    onRowHeightChange: (row: number, height: number) => void;
}) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(
        function observeRowHeight() {
            if (hidden) return;

            const wrapper = wrapperRef.current;
            if (wrapper === null) return;

            resizeObserver.observe(wrapper, (entry) => {
                onRowHeightChange(row, entry.contentRect.height);
            });
            return () => resizeObserver.unobserve(wrapper);
        },
        [hidden, onRowHeightChange, resizeObserver, row],
    );

    if (hidden) {
        return <div style={{ visibility: 'hidden', display: 'none', userSelect: 'none', touchAction: 'none' }} />;
    }

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
