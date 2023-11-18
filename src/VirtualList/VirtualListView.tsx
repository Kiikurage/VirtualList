import {
    ComponentType,
    memo,
    ReactNode,
    UIEventHandler,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { VirtualListState } from './VirtualListState';
import { useResizeObserver } from './useResizeObserver';
import { VirtualListItemView } from './VirtualListItemView';
import { ViewRecycleMapping } from './ViewRecycleMapping';

export const VirtualListView = ({
    rows,
    ItemRenderer,
}: {
    rows: number;
    ItemRenderer: ComponentType<{ row: number }>;
}) => {
    const viewRecycleMapping = useState(() => new ViewRecycleMapping())[0];

    const memoizedItemRenderer = useMemo(() => memo(ItemRenderer), [ItemRenderer]);

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

    const resizeObserver = useResizeObserver();

    const viewportRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(
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

            resizeObserver.observe(viewport, (entry) => {
                setRowState((oldState) =>
                    VirtualListState.setViewportSize(oldState, entry.contentRect.height, 'start'),
                );
            });
            return () => resizeObserver.unobserve(viewport);
        },
        [resizeObserver],
    );

    const handleViewportScroll: UIEventHandler = useCallback((ev) => {
        setRowState((oldState) => VirtualListState.setScrollOffset(oldState, (ev.target as Element).scrollTop));
    }, []);

    const handleRowHeightChange = useCallback((row: number, height: number) => {
        setRowState((oldState) => VirtualListState.setItemSize(oldState, row, height));
    }, []);

    const itemTops = useMemo(() => VirtualListState.getItemScrollOffsets(rowState), [rowState]);
    const [rowFrom, rowTo] = VirtualListState.getVisibleItemIndexes(rowState);
    viewRecycleMapping.update(rowFrom, rowTo);

    const rowNodes: ReactNode[] = [];
    for (const { viewId, contentId: row } of viewRecycleMapping.entries) {
        if (row === undefined) {
            rowNodes.push(
                <VirtualListItemView
                    hidden
                    key={viewId}
                    row={-1}
                    top={-1}
                    resizeObserver={resizeObserver}
                    ItemRenderer={memoizedItemRenderer}
                    onRowHeightChange={handleRowHeightChange}
                />,
            );
        } else {
            rowNodes.push(
                <VirtualListItemView
                    key={viewId}
                    row={row}
                    top={itemTops[row] - rowState.scrollOffset}
                    resizeObserver={resizeObserver}
                    ItemRenderer={memoizedItemRenderer}
                    onRowHeightChange={handleRowHeightChange}
                />,
            );
        }
    }

    return (
        <div
            ref={viewportRef}
            style={{
                overflow: 'overlay',
                width: '100%',
                height: '100%',
                position: 'relative',
            }}
            onScroll={handleViewportScroll}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    height: `${VirtualListState.getContentSize(rowState)}px`,
                }}
            />
            <div style={{ overflow: 'clip', position: 'sticky', inset: 0, height: '100%' }}>{rowNodes}</div>
        </div>
    );
};