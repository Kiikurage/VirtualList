import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { VirtualListView } from './VirtualList/VirtualListView';

window.addEventListener('DOMContentLoaded', () => {
    createRoot(document.getElementById('root')!).render(<AppShell />);
});

export const AppShell = () => {
    const [rows, setRows] = useState(1000);

    return (
        <div>
            <header
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '16px',
                    marginBottom: '16px',
                }}
            >
                <span>行数</span>
                <input type="number" value={rows} onChange={(ev) => setRows(Number(ev.target.value))} />
            </header>
            <div
                style={{
                    border: '2px solid #000',
                    resize: 'both',
                    overflow: 'clip',
                    background: '#aaa',
                    height: '600px',
                }}
            >
                <VirtualListView rows={rows} ItemRenderer={ItemRenderer} />
            </div>
        </div>
    );
};

const ItemRenderer = ({ row }: { row: number }) => {
    return (
        <div
            style={{
                background: '#bcf5ff',
                borderBottom: '1px solid #000',
                resize: 'vertical',
                overflow: 'auto',
                padding: '4px 16px',
                boxSizing: 'border-box',
                height: '50px',
            }}
        >
            Item: {row}
        </div>
    );
};
