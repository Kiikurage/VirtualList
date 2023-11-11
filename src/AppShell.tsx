import { useEffect, useState } from 'react';
import { VirtualListView } from './VirtualListView';

export const AppShell = () => {
    const [rows, setRows] = useState(1000);
    const [autoRowInsert, setAutoRowInsert] = useState(false);
    const [autoRowInsertInterval, setAutoRowInsertInterval] = useState(100);

    useEffect(() => {
        if (!autoRowInsert) return;

        const timerId = setInterval(() => {
            setRows((r) => r + 1);
        }, autoRowInsertInterval);

        return () => clearInterval(timerId);
    }, [autoRowInsert, autoRowInsertInterval]);

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
                    alignItems: 'flex-end',
                    display: 'flex',
                    gap: '16px',
                }}
            >
                <label>
                    <span>行数</span>
                    <input
                        type="number"
                        min={1}
                        style={{ marginLeft: '8px' }}
                        value={rows}
                        onChange={(ev) => setRows(Number(ev.target.value))}
                    />
                </label>
                <label>
                    <input
                        type="checkbox"
                        style={{ marginRight: '8px' }}
                        checked={autoRowInsert}
                        onChange={(ev) => setAutoRowInsert(ev.target.checked)}
                    />
                    <span>行の自動追加</span>
                </label>
                <label>
                    <span>追加速度[ms]</span>
                    <input
                        type="number"
                        min={10}
                        style={{ marginLeft: '8px' }}
                        value={autoRowInsertInterval}
                        onChange={(ev) => setAutoRowInsertInterval(Number(ev.target.value))}
                    />
                </label>
            </header>
            <div style={{ border: '1px solid #000', resize: 'both', overflow: 'hidden', flex: 1 }}>
                <VirtualListView rows={rows} ItemRenderer={ItemRenderer} />
            </div>
        </div>
    );
};

const heightMap: Record<number, number> = {};

const ItemRenderer = ({ row }: { row: number }) => {
    const height = heightMap[row] ?? (heightMap[row] = 50 + Math.random() * 50);

    return (
        <div
            style={{
                background: row % 2 === 0 ? '#e0e0e0' : '#fff',
                resize: 'vertical',
                overflow: 'auto',
                padding: '4px 16px',
                boxSizing: 'border-box',
                height: `${height}px`,
            }}
        >
            Item: {row}
        </div>
    );
};
