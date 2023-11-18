import { ReactNode, useState } from 'react';
import { VirtualListState } from './VirtualListState';

const ROW_HEIGHT = 50;
const VIEWPORT_HEIGHT = 600;

export const VirtualList = ({ rows }: { rows: number }) => {
    const [virtualListState, setVirtualListState] = useState(() =>
        VirtualListState.create(rows, ROW_HEIGHT, VIEWPORT_HEIGHT),
    );

    if (rows !== virtualListState.rows) {
        setVirtualListState((oldState) => oldState.setRows(rows));
    }

    const [rowFrom, rowTo] = virtualListState.getVisibleRowRange();
    const rowNodes: ReactNode[] = [];
    for (let row = rowFrom; row < rowTo; row++) {
        rowNodes.push(
            <li
                key={row}
                style={{
                    position: 'absolute',
                    top: `${row * virtualListState.rowHeight - virtualListState.scrollTop}`,
                    padding: '20px',
                    borderTop: '1px solid #000',
                    overflow: 'hidden',
                    background: '#fff',
                    boxSizing: 'border-box',
                    width: '100%',
                    height: `${virtualListState.rowHeight}px`,
                }}
            >
                ListItem {row}
            </li>,
        );
    }

    return (
        <ul
            style={{
                padding: 0,
                margin: 0,
                position: 'relative',
                listStyle: 'none',
                border: '4px solid #000',
                background: '#c0c0c0',
                height: `${virtualListState.viewportHeight}px`,
                overflow: 'auto',
            }}
            onScroll={(ev) => {
                const scrollTop = ev.currentTarget.scrollTop;
                setVirtualListState((oldState) => oldState.setScrollTop(scrollTop));
            }}
        >
            <div style={{ position: 'absolute', inset: 0, height: `${rows * virtualListState.rowHeight}px` }} />

            <div
                style={{
                    position: 'sticky',
                    willChange: 'transform',
                    inset: 0,
                    overflow: 'clip',
                    height: '100%',
                }}
            >
                {rowNodes}
            </div>
        </ul>
    );
};
