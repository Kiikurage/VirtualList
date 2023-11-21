import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { VirtualList } from './VirtualList/VirtualList';

window.addEventListener('DOMContentLoaded', () => {
    createRoot(document.getElementById('root')!).render(<Playground />);
});

const Playground = () => {
    const [rows, setRows] = useState(10);

    return (
        <div>
            <header style={{ marginBottom: '20px' }}>
                行数
                <input value={rows} type="number" onChange={(ev) => setRows(Number(ev.target.value))} />
            </header>
            <VirtualList rows={rows} rowRenderer={Row} />
        </div>
    );
};

const Row = ({ row }: { row: number }) => {
    return (
        <div
            style={{
                padding: '20px',
                borderTop: '1px solid #000',
                overflow: 'hidden',
                resize: 'vertical',
                background: '#fff',
                boxSizing: 'border-box',
            }}
        >
            VirtualList Row {row} <input type="text" /> <button>Button</button>
        </div>
    );
};
