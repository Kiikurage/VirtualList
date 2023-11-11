import { useState } from 'react';
import { VirtualListView } from './VirtualListView';

export const AppShell = () => {
    const [rows, setRows] = useState(10);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                gap: '32px',
                padding: '32px',
                flexDirection: 'column',
            }}
        >
            <header
                style={{
                    flexDirection: 'row',
                    display: 'flex',
                    gap: '16px',
                }}
            >
                <label>
                    <span>行数/rows</span>
                    <input
                        type="number"
                        min={1}
                        style={{ marginLeft: '8px' }}
                        value={rows}
                        onChange={(ev) => setRows(Number(ev.target.value))}
                    />
                </label>
            </header>
            <div style={{ border: '1px solid #000', resize: 'both', overflow: 'hidden' }}>
                <VirtualListView rows={rows} ItemRenderer={ItemRenderer} />
            </div>
        </div>
    );
};

const ItemRenderer = ({ row }: { row: number }) => {
    return (
        <div
            style={{
                background: row % 2 === 0 ? '#e0e0e0' : '#fff',
                resize: 'vertical',
                overflow: 'auto',
                minHeight: '100px',
            }}
        >
            Item: {row}
        </div>
    );
};
