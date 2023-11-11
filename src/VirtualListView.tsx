import { ComponentType, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VirtualListState } from './VirtualListState';
import { useResizeObserver } from './useResizeObserver';

export const VirtualListView = ({
    rows,
    ItemRenderer,
}: {
    rows: number;
    ItemRenderer: ComponentType<{ row: number }>;
}) => {
    const [rowState, setRowState] = useState(() =>
        VirtualListState.create({
            numItems: rows,
        }),
    );

    if (rows != rowState.itemSizes.length) {
        setRowState((oldState) => {
            let newState = oldState;
            while (newState.itemSizes.length < rows) newState = VirtualListState.addItemAtLast(newState);
            while (newState.itemSizes.length > rows) newState = VirtualListState.deleteItemAtLast(newState);
            return newState;
        });
    }

    const viewportRef = useRef<HTMLDivElement | null>(null);

    const resizeObserver = useResizeObserver((entries) => {
        for (const entry of entries) {
            if (entry.target === viewportRef.current) {
                setRowState((oldState) =>
                    VirtualListState.setViewportSize(oldState, entry.contentRect.height, 'start'),
                );
            }
            const row = itemContainerMap.get(entry.target);
            if (row !== undefined) {
                setRowState((oldState) => VirtualListState.setItemSize(oldState, row, entry.contentRect.height));
            }
        }
    });

    useEffect(
        function syncScrollTop() {
            const viewport = viewportRef.current;
            if (viewport === null) return;

            viewport.scrollTop = rowState.scrollOffset;
        },
        [rowState.scrollOffset],
    );

    useLayoutEffect(
        function observeViewport() {
            const viewport = viewportRef.current;
            if (viewport === null) return;

            resizeObserver.observe(viewport);
            return () => resizeObserver.unobserve(viewport);
        },
        [resizeObserver],
    );

    const itemTops = useMemo(() => VirtualListState.getItemOffsets(rowState), [rowState]);

    const [itemContainerMap] = useState(() => new Map<Element, number>());

    const updateItemContainerRef = useCallback(
        (newItemContainer: HTMLElement | null) => {
            if (newItemContainer === null) return;

            const row = Number(newItemContainer.dataset['row']);
            resizeObserver.observe(newItemContainer);
            itemContainerMap.set(newItemContainer, row);
        },
        [itemContainerMap, resizeObserver],
    );

    return (
        <div ref={viewportRef} style={{ overflow: 'overlay', width: '100%', height: '100%' }}>
            <div
                style={{
                    position: 'relative',
                    height: `${VirtualListState.getContentSize(rowState)}px`,
                }}
            >
                {itemTops.map((top, row) => (
                    <div
                        key={`${row}`}
                        data-row={row}
                        ref={updateItemContainerRef}
                        style={{
                            position: 'absolute',
                            top: `${top}px`,
                            width: '100%',
                        }}
                    >
                        <ItemRenderer row={row} />
                    </div>
                ))}
            </div>
        </div>
    );
};
