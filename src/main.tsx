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
            <VirtualList rows={rows} />
        </div>
    );
};
