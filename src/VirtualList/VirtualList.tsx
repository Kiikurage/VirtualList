import { ReactNode, useState } from 'react';

const ROW_HEIGHT = 50;
const VIEWPORT_HEIGHT = 600;

export const VirtualList = ({ rows }: { rows: number }) => {
    const [scrollTop, setScrollTop] = useState(0);

    const rowFrom = Math.max(0, Math.min(Math.floor(scrollTop / ROW_HEIGHT), rows));
    const rowTo = Math.max(0, Math.min(Math.ceil((scrollTop + VIEWPORT_HEIGHT) / ROW_HEIGHT), rows));

    const rowNodes: ReactNode[] = [];
    for (let row = rowFrom; row < rowTo; row++) {
        rowNodes.push(
            <li
                key={row}
                style={{
                    position: 'absolute',
                    top: `${row * ROW_HEIGHT - scrollTop}`,
                    padding: '20px',
                    borderTop: '1px solid #000',
                    overflow: 'hidden',
                    background: '#fff',
                    boxSizing: 'border-box',
                    width: '100%',
                    height: `${ROW_HEIGHT}px`,
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
                height: `${VIEWPORT_HEIGHT}px`,
                overflow: 'auto',
            }}
            onScroll={(ev) => setScrollTop(ev.currentTarget.scrollTop)}
        >
            <div style={{ position: 'absolute', inset: 0, height: `${rows * ROW_HEIGHT}px` }} />

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
